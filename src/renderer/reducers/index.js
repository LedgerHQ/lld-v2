// @flow
import { combineReducers } from 'redux'

import type { UserAction } from '~/renderer/actions/user'
import type { UserState } from './user'
import user from './user'

export type State = {
  user: UserState,
}

export type Actions = UserAction

export default combineReducers<State, Actions>({ user })
