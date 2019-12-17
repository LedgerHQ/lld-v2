// @flow
import './live-common-setup'
import './i18n/init'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'

import ReactRoot from './ReactRoot'

const root = document.getElementById('react-root')

function r(Comp, rootNode) {
  if (rootNode) {
    render(<Comp />, rootNode)
  }
}

r(hot(ReactRoot), root)
