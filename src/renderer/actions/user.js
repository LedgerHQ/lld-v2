// @flow
export const SET_NAME = 'SET_NAME'
export const REMOVE_NAME = 'REMOVE_NAME'

export type SetNameAction = { type: 'SET_NAME', name: string }
export type RemoveNameAction = { type: 'REMOVE_NAME' }

export type UserAction = SetNameAction | RemoveNameAction

export const setName = (name: string): SetNameAction => ({
  type: SET_NAME,
  name,
})

export const deleteName = (): RemoveNameAction => ({
  type: REMOVE_NAME,
})
