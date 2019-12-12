// @flow
import { createStore } from 'redux'

import type { State, Actions } from '~/renderer/reducers'
import rootReducer from '~/renderer/reducers'

export default createStore<State, Actions, {}>(rootReducer)
