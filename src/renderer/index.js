// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import './i18n/init'
import App from './App'

const root = document.getElementById('react-root')

function r(Comp, rootNode) {
  if (rootNode) {
    render(<Comp />, rootNode)
  }
}

r(hot(App), root)
