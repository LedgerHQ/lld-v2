// @flow
import path from 'path'
import { ipcRenderer } from 'electron'
import debug from 'debug'

import network from '~/network'
import db from '~/helpers/db'

import { CHECK_UPDATE_DELAY, DISABLE_ACTIVITY_INDICATORS } from './../config/constants'

// TODO: import these
// import { onSetDeviceBusy } from 'components/DeviceBusyIndicator'
// import { onSetLibcoreBusy } from 'components/LibcoreBusyIndicator'

import { lock } from './actions/application'

const d = {
  sync: debug('lwd:sync'),
  update: debug('lwd:update'),
}

export function sendEvent(channel: string, msgType: string, data: any) {
  ipcRenderer.send(channel, {
    type: msgType,
    data,
  })
}

export default ({ store }: { store: Object }) => {
  // Ensure all sub-processes are killed before creating new ones (dev mode...)
  ipcRenderer.send('clean-processes')

  ipcRenderer.on('lock', () => {
    if (db.hasEncryptionKey('app', 'accounts')) {
      store.dispatch(lock())
    }
  })

  ipcRenderer.on('executeHttpQueryOnRenderer', (event: any, { networkArg, id }) => {
    network(networkArg).then(
      result => {
        ipcRenderer.send('executeHttpQueryPayload', { type: 'success', id, result })
      },
      error => {
        ipcRenderer.send('executeHttpQueryPayload', { type: 'error', id, error })
      },
    )
  })

  if (!DISABLE_ACTIVITY_INDICATORS) {
    ipcRenderer.on('setLibcoreBusy', (event: any, { busy }) => {
      // TODO: port this
      // onSetLibcoreBusy(busy)
    })

    ipcRenderer.on('setDeviceBusy', (event: any, { busy }) => {
      // TODO: port this
      // onSetDeviceBusy(busy)
    })
  }
}

if (module.hot) {
  module.hot.accept(path.resolve(__dirname, '..', 'commands'), () => {
    ipcRenderer.send('clean-processes')
  })
}

export function checkUpdates() {
  d.update('Update - check')
  setTimeout(() => sendEvent('updater', 'init'), CHECK_UPDATE_DELAY)
}
