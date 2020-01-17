// @flow
import "./setup";
import { app, Menu, ipcMain } from "electron";
import menu from "./menu";
import { createMainWindow, getMainWindow } from "./window-lifecycle";
import "./internal-lifecycle";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import db from "./db";

const gotLock = app.requestSingleInstanceLock();
const userDataDirectory = resolveUserDataDirectory();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    const w = getMainWindow();
    if (w) {
      if (w.isMinimized()) {
        w.restore();
      }
      w.focus();
    }
  });
}

const showTimeout = setTimeout(() => {
  const w = getMainWindow();
  if (w) show(w);
}, 5000);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  const w = getMainWindow();
  if (w) {
    w.focus();
  }
});

app.on("ready", async () => {
  if (__DEV__) {
    await installExtensions();
  }

  db.init(userDataDirectory);

  ipcMain.handle("getKey", (event, { ns, keyPath, defaultValue }) => {
    return db.getKey(ns, keyPath, defaultValue);
  });

  ipcMain.handle("setKey", (event, { ns, keyPath, value }) => {
    return db.setKey(ns, keyPath, value);
  });

  ipcMain.handle("hasEncryptionKey", (event, { ns, keyPath }) => {
    return db.hasEncryptionKey(ns, keyPath);
  });

  ipcMain.handle("setEncryptionKey", (event, { ns, keyPath, encryptionKey }) => {
    return db.setEncryptionKey(ns, keyPath, encryptionKey);
  });

  ipcMain.handle("removeEncryptionKey", (event, { ns, keyPath }) => {
    return db.removeEncryptionKey(ns, keyPath);
  });

  ipcMain.handle("isEncryptionKeyCorrect", (event, { ns, keyPath, encryptionKey }) => {
    return db.isEncryptionKeyCorrect(ns, keyPath, encryptionKey);
  });

  ipcMain.handle("hasBeenDecrypted", (event, { ns, keyPath }) => {
    return db.hasBeenDecrypted(ns, keyPath);
  });

  ipcMain.handle("resetAll", () => {
    return db.resetAll();
  });

  ipcMain.handle("cleanCache", () => {
    return db.cleanCache();
  });

  const initialSettings = await db.getKey("app", "settings", {});

  Menu.setApplicationMenu(menu);

  const w = await createMainWindow(initialSettings);

  await clearSessionCache(w.webContents.session);
});

ipcMain.on("ready-to-show", () => {
  const w = getMainWindow();
  if (w) {
    clearTimeout(showTimeout);
    show(w);
  }
});

async function installExtensions() {
  const installer = require("electron-devtools-installer");
  const forceDownload = true; // process.env.UPGRADE_EXTENSIONS
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
}

function clearSessionCache(session) {
  return new Promise(resolve => {
    session.clearCache(resolve);
  });
}

function show(win) {
  win.show();
  setImmediate(() => win.focus());
}
