// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import './i18n/init'
import App from './App'

import store from './store'

const root = document.getElementById('react-root')

function r(Comp, rootNode) {
  if (rootNode) {
    render(
      <Provider store={store}>
        <Comp />
      </Provider>,
      rootNode,
    )
  }
}

r(hot(App), root)
