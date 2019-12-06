import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import HelloMessage from './hello1'
import HelloMessage2 from './hello2'

const HotReloader = hot(({ children }) => children)

render(
  <HotReloader>
    <HelloMessage name="mr. Thierry Boustanot" />
    <HelloMessage2 />
  </HotReloader>,
  document.getElementById('react-root'),
)
