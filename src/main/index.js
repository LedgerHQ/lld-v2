import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow

const isDev = process.env.NODE_ENV === 'development'

async function createWindow() {
  console.log('dsdsdsddsd')

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {},
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:8080/dist/renderer'
      : `file://${path.resolve(__dirname, 'dist/renderer/index.html')}`,
  )

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
