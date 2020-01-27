// @flow

import "../env";
import { ipcMain } from "electron";
import logger, { enableDebugLogger } from "../logger";
import LoggerTransport from "../logger/logger-transport-main";
import contextMenu from "electron-context-menu";
import updater from "./updater";

const loggerTransport = new LoggerTransport();
logger.add(loggerTransport);

if (process.env.DEV_TOOLS) {
  enableDebugLogger();
}

ipcMain.on("log", (e, { log }) => {
  logger.onLog(log);
});

ipcMain.on("queryLogs", event => {
  event.sender.send("logs", { logs: loggerTransport.logs });
});

ipcMain.on("updater", (e, type) => {
  updater(type);
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
