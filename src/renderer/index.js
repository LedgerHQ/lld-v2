// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import HelloMessage from './hello1'
import HelloMessage2 from './hello2'

type Props = {
  children: React$Node,
}

const HotReloader = hot(({ children }: Props) => children)
const root = document.getElementById('react-root')

const App = () => {
  return (
    <HotReloader>
      <HelloMessage name="Thierry Boustanot" />
      <HelloMessage2 />
    </HotReloader>
  )
}

function r(Comp, rootNode) {
  if (rootNode) {
    render(<Comp />, rootNode)
  }
}

r(App, root)
