// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import App from './App'

type Props = {
  children: React$Node,
}

const HotReloader = hot(({ children }: Props) => children)
const root = document.getElementById('react-root')

function r(Comp, rootNode) {
  if (rootNode) {
    render(<Comp />, rootNode)
  }
}

r((
  <HotReloader>
    <App />
  </HotReloader>,
), root)
