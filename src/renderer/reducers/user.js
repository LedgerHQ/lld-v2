// @flow
import type { UserAction } from './../actions/user'
import { SET_NAME, REMOVE_NAME } from './../actions/user'

export type UserState = {
  +name: string,
}

const initialState: UserState = {
  name: 'val_pinkman',
}

const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case SET_NAME: {
      return {
        ...state,
        name: action.name,
      }
    }
    case REMOVE_NAME: {
      return { ...state, name: '' }
    }

    default:
      return state
  }
}

export default userReducer
