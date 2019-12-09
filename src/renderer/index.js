import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import App from './App'

const HotReloader = hot(({ children }) => children)

render(
  <HotReloader>
    <App />
  </HotReloader>,
  document.getElementById('react-root'),
)
