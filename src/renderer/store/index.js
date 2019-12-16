// @flow
import { createStore } from 'redux'

import type { State, Actions } from './../reducers'
import rootReducer from './../reducers'

export default createStore<State, Actions, {}>(rootReducer)
