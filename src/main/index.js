import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow

const isDev = DEV

async function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  ipcMain.once('main-window-ready', () => {
    mainWindow.show()
  })

  if (isDev) {
    mainWindow.loadURL(INDEX_URL)
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }

  if (DEV) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
