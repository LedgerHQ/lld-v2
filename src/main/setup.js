// @flow

import "../env";
import { ipcMain } from "electron";
import logger from "../logger";
import LoggerTransport from "../logger/logger-transport-main";
import contextMenu from "electron-context-menu";
import StorageService from "./db/StorageService";

const loggerTransport = new LoggerTransport();
logger.add(loggerTransport);

ipcMain.on("log", (e, { log }) => {
  logger.onLog(log);
});

ipcMain.on("queryLogs", event => {
  event.sender.send("logs", { logs: loggerTransport.logs });
});

const storageService = new StorageService();

storageService.start().then(() => {
  ipcMain.on("loadConfig", async (event, { storeName }) => {
    const data = storageService.get(storeName);
    event.sender.send("configLoaded", { data });
  });

  ipcMain.on("lock", async (event) => {
    storageService.lock();
    event.sender.send("locked", { isLocked: storageService.isLocked });
  });

  ipcMain.on("unlock", async (event, { password }) => {
    storageService.unlock(password);
    event.sender.send("unlocked", { isLocked: storageService.isLocked });
  });
});

process.setMaxListeners(0);

// eslint-disable-next-line no-console
console.log(`Ledger Live ${__APP_VERSION__}`);

contextMenu({
  showInspectElement: __DEV__,
  showCopyImageAddress: false,
  // TODO: i18n for labels
  labels: {
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    copyLink: "Copy Link",
    inspect: "Inspect element",
  },
});
