import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow

const isDev = process.env.NODE_ENV === 'development'

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

  mainWindow.loadURL(INDEX_URL)

  if (isDev) {
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
