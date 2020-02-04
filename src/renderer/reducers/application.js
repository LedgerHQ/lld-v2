// @flow

import { handleActions } from "redux-actions";

export type ApplicationState = {
  isLocked?: boolean,
  osDarkMode?: boolean,
  navigationLocked?: boolean,
};

const state: ApplicationState = {
  osDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
};

// NOTE: V2 `lock` and `unlock` have been moved to actions/application.js

// Selectors

export const isLocked = (state: Object) => state.application.isLocked === true;

export const osDarkModeSelector = (state: Object) => state.application.osDarkMode;

export const isNavigationLocked = (state: Object) => state.application.navigationLocked;

// Exporting reducer

export default handleActions(handlers, state);
