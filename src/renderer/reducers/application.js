// @flow

import { handleActions } from "redux-actions";

export type ApplicationState = {
  isLocked?: boolean,
};

const state: ApplicationState = {};

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
};

// NOTE: V2 `lock` and `unlock` have been moved to actions/application.js

// Selectors

export const isLocked = (state: Object) => state.application.isLocked === true;

// Exporting reducer

export default handleActions(handlers, state);
