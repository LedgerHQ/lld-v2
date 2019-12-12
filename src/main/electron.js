import { app, BrowserWindow, ipcMain } from 'electron'

const isDev = DEV
let mainWindow

const electronMain = () => {
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

    app.on('window-all-closed', async () => {
      app.quit()
    })

    ipcMain.once('main-window-ready', () => {
      mainWindow.show()
    })

    mainWindow.loadURL(isDev ? INDEX_URL : `file://${__dirname}/index.html`)

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
}

export default electronMain
