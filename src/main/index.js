import { app, BrowserWindow, ipcMain, screen, Menu } from 'electron'
import contextMenu from 'electron-context-menu'
import debounce from 'lodash/debounce'
import cluster from 'cluster'

import menu from './menu'

import {
  MIN_HEIGHT,
  MIN_WIDTH,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
} from './../config/constants'

const spawnCoreProcess = () => {
  cluster.fork({
    // FIXME
    LEDGER_LIVE_SQLITE_PATH: '_libcore_tmp_folder_',
  })

  cluster.on('exit', (worker, code, signal) => {
    // TODO handle more logic!!
    console.log(`worker ${worker.process.pid} died with error code ${code} and signal ${signal}`)
  })
}

spawnCoreProcess() // FIXME only on demand

let mainWindow = null

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()
    }
  })
}

// eslint-disable-next-line no-console
console.log(`Ledger Live ${__APP_VERSION__}`)

export const getMainWindow = () => mainWindow

contextMenu({
  showInspectElement: __DEV__,
  showCopyImageAddress: false,
  // TODO: i18n for labels
  labels: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    copyLink: 'Copy Link',
    inspect: 'Inspect element',
  },
})

const getWindowPosition = (width, height, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  }
}

const saveWindowSettings = window => {
  const windowParamsHandler = () => {
    const [width, height] = window.getSize()
    const [x, y] = window.getPosition()
    // USE DB TO SAVE POSITION
    console.log(width, height)
    console.log(x, y)
  }

  window.on('resize', debounce(windowParamsHandler, 100))
  window.on('move', debounce(windowParamsHandler, 100))
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = true // process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log)
}

const defaultWindowOptions = {
  // icons: 'path/to/icon'
  backgroundColor: '#fff',
  webPreferences: {
    blinkFeatures: 'OverlayScrollbars',
    devTools: __DEV__,
    experimentalFeatures: true,
    nodeIntegration: true,
  },
}

async function createMainWindow() {
  // TODO use DB to retrieve users params
  //  const savedDimensions = await db.getKey('windowParams', 'MainWindow.dimensions', {})
  //  const savedPositions = await db.getKey('windowParams', 'MainWindow.positions', null)
  const width = /* savedDimensions.width || */ DEFAULT_WINDOW_WIDTH
  const height = /* savedDimensions.height || */ DEFAULT_WINDOW_HEIGHT

  const windowOptions = {
    ...defaultWindowOptions,
    ...getWindowPosition(width, height),
    /* eslint-disable indent */
    ...(process.platform === 'darwin'
      ? {
          frame: false,
          titleBarStyle: 'hiddenInset',
        }
      : {}),
    /* eslint-enable indent */
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  }

  mainWindow = new BrowserWindow(windowOptions)

  mainWindow.name = 'MainWindow'

  saveWindowSettings(mainWindow)

  if (__DEV__) {
    mainWindow.loadURL(INDEX_URL)
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }

  if (__DEV__) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.focus()
  }
})

const show = win => {
  win.show()
  setImmediate(() => win.focus())
}

const showTimeout = setTimeout(() => {
  if (mainWindow) show(mainWindow)
}, 5000)

ipcMain.on('ready-to-show', () => {
  if (mainWindow) {
    clearTimeout(showTimeout)
    show(mainWindow)
  }
})

app.on('ready', async () => {
  if (__DEV__) {
    await installExtensions()
  }

  Menu.setApplicationMenu(menu)

  await createMainWindow()

  await clearSessionCache(mainWindow.webContents.session)
})

function clearSessionCache(session) {
  return new Promise(resolve => {
    session.clearCache(resolve)
  })
}
