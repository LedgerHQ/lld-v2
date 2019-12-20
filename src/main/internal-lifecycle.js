// @flow

import invariant from 'invariant'
import { app, ipcMain } from 'electron'
import debounce from 'lodash/debounce'
import path from 'path'
import rimraf from 'rimraf'
import cluster from 'cluster'
import { setEnvUnsafe, getAllEnvs } from '@ledgerhq/live-common/lib/env'
import { isRestartNeeded } from '~/renderer/helpers/env'
import { ipcMainListenReceiveCommands } from '~/commands/ipc'
import logger from '~/logger'
import { setInternalProcessPID } from './terminator'
import { getMainWindow } from './window-lifecycle'

// ~~~ Local state that main thread keep

const hydratedPerCurrency = {}
let internalProcess

// ~~~

const LEDGER_CONFIG_DIRECTORY = app.getPath('userData')
const LEDGER_LIVE_SQLITE_PATH = path.resolve(app.getPath('userData'), 'sqlite')

const cleanUpBeforeClosingSync = () => {
  rimraf.sync(path.resolve(LEDGER_CONFIG_DIRECTORY, 'sqlite/*.log'))
}

const handleExit = (worker: cluster$Worker, code, signal) => {
  const { process } = worker
  console.log(`worker ${process && process.pid} died with error code ${code} and signal ${signal}`)
  logger.warn(`Internal process ended with code ${code}`)
  internalProcess = null
}

const killInternalProcess = () => {
  if (internalProcess) {
    logger.log('killing internal process...')
    internalProcess.removeListener('exit', handleExit)
    internalProcess.kill('SIGINT')
    internalProcess = null
  }
}

const killInternalProcessDebounce = debounce(() => {
  killInternalProcess()
}, 500)

const sentryEnabled = false
const userId = 'TODO'

const spawnCoreProcess = () => {
  const env = {
    ...getAllEnvs(),
    // $FlowFixMe
    ...process.env,
    IS_INTERNAL_PROCESS: 1,
    LEDGER_CONFIG_DIRECTORY,
    LEDGER_LIVE_SQLITE_PATH,
    INITIAL_SENTRY_ENABLED: sentryEnabled,
    SENTRY_USER_ID: userId,
  }

  const worker = cluster.fork(env)
  setInternalProcessPID(worker.process.pid)

  worker.on('message', handleGlobalInternalMessage)
  worker.on('exit', handleExit)
  worker.send({
    type: 'init',
    hydratedPerCurrency,
  })

  internalProcess = worker
}

process.on('exit', () => {
  killInternalProcess()
  cleanUpBeforeClosingSync()
})

ipcMain.on('clean-processes', () => {
  killInternalProcess()
})

// spawnCoreProcess() // FIXME only on demand

ipcMainListenReceiveCommands({
  onUnsubscribe: requestId => {
    if (internalProcess) {
      internalProcess.send({ type: 'command-unsubscribe', requestId })
    }
  },
  onCommand: (command, notifyCommandEvent) => {
    if (!internalProcess) spawnCoreProcess()
    const p = internalProcess
    invariant(p, 'internalProcess not started !?')

    const handleExit = code => {
      p.removeListener('message', handleMessage)
      p.removeListener('exit', handleExit)
      notifyCommandEvent({
        type: 'cmd.ERROR',
        requestId: command.requestId,
        data: { message: `Internal process error (${code})`, name: 'InternalError' },
      })
    }

    const handleMessage = payload => {
      if (payload.requestId !== command.requestId) return
      notifyCommandEvent(payload)
      if (payload.type === 'cmd.ERROR' || payload.type === 'cmd.COMPLETE') {
        p.removeListener('message', handleMessage)
        p.removeListener('exit', handleExit)
      }
    }

    p.on('exit', handleExit)
    p.on('message', handleMessage)
    p.send({ type: 'command', command })
  },
})

function handleGlobalInternalMessage(payload) {
  switch (payload.type) {
    case 'uncaughtException': {
      // FIXME
      // const err = deserializeError(payload.error)
      // captureException(err)
      break
    }
    case 'log':
      logger.onLog(payload.log)
      break
    case 'setLibcoreBusy':
    case 'setDeviceBusy':
    case 'executeHttpQueryOnRenderer': {
      const win = getMainWindow && getMainWindow()
      if (!win) {
        logger.warn(`can't ${payload.type} because no renderer`)
        return
      }
      win.webContents.send(payload.type, payload)
      break
    }
    default:
  }
}

ipcMain.on('executeHttpQueryPayload', (event, payload) => {
  const p = internalProcess
  if (!p) return
  p.send({ type: 'executeHttpQueryPayload', payload })
})

// FIXME this should be a done with a env instead.
/*
ipcMain.on('sentryLogsChanged', (event, payload) => {
  sentryEnabled = payload.value
  const p = internalProcess
  if (!p) return
  p.send({ type: 'sentryLogsChanged', payload })
})
*/

ipcMain.on('setEnv', (event, env) => {
  const { name, value } = env

  if (setEnvUnsafe(name, value)) {
    if (isRestartNeeded(name)) {
      killInternalProcessDebounce()
    } else {
      const p = internalProcess
      if (!p) return
      p.send({ type: 'setEnv', env })
    }
  }
})

ipcMain.on('hydrateCurrencyData', (event, { currencyId, serialized }) => {
  if (hydratedPerCurrency[currencyId] === serialized) return
  hydratedPerCurrency[currencyId] = serialized
  const p = internalProcess
  if (p) {
    p.send({ type: 'hydrateCurrencyData', serialized, currencyId })
  }
})
