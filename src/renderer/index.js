// @flow
import './live-common-setup'
import './i18n/init'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'

import dbMiddlewares from './../middlewares/db'

import createStore from './createStore'
import App from './App'

const store = createStore({ dbMiddlewares })
const root = document.getElementById('react-root')

function r(Comp, rootNode) {
  if (rootNode) {
    render(<Comp store={store} />, rootNode)
  }
}

r(hot(App), root)
