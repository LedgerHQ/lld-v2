// @flow
import "./setup";
import { BrowserWindow, screen } from "electron";
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
  DEV_TOOLS,
} from "./../config/constants";
import { terminate } from "./terminator";

let mainWindow = null;

export const getMainWindow = () => mainWindow;

const getWindowPosition = (width, height, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display;

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  };
};

const defaultWindowOptions = {
  // icons: 'path/to/icon'
  backgroundColor: "#fff",
  webPreferences: {
    blinkFeatures: "OverlayScrollbars",
    devTools: __DEV__,
    experimentalFeatures: true,
    nodeIntegration: true,
  },
};

export async function createMainWindow({ dimensions, positions }: any) {
  console.log(dimensions, positions);
  // TODO renderer should provide the saved window rectangle
  const width = dimensions ? dimensions.width : DEFAULT_WINDOW_WIDTH;
  const height = dimensions ? dimensions.height : DEFAULT_WINDOW_HEIGHT;
  const windowPosition = positions || getWindowPosition(width, height);

  const windowOptions = {
    ...defaultWindowOptions,
    x: windowPosition.x,
    y: windowPosition.y,
    /* eslint-disable indent */
    ...(process.platform === "darwin"
      ? {
          frame: false,
          titleBarStyle: "hiddenInset",
        }
      : {}),
    /* eslint-enable indent */
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    webPreferences: {
      ...defaultWindowOptions.webPreferences,
    },
  };

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.name = "MainWindow";

  if (__DEV__) {
    mainWindow.loadURL(INDEX_URL);
  } else {
    mainWindow.loadURL(`file://${__dirname}/index.html`);
  }

  if (__DEV__ || DEV_TOOLS) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", terminate);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}
