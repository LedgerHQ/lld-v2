// @flow
import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import './global.css'

import Title from './components/title'
import Switcher from './components/switcher'
import Img from './components/img'

type State = {
  error: ?Error,
}

class App extends Component<{}, State> {
  state = {
    error: null,
  }

  componentDidMount() {
    ipcRenderer.send('main-window-ready', {})
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
    })
  }

  render() {
    if (this.state.error) {
      return this.state.error.toString()
    }

    return (
      <>
        <Title />
        <Switcher />
        <div>
          <Img />
        </div>
      </>
    )
  }
}

export default App
