import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import './global.css'

import Title from './components/title'
import Switcher from './components/switcher'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
    }
  }

  componentDidMount() {
    ipcRenderer.send('main-window-ready', {})
  }

  componentDidCatch(error, errorInfo) {
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
      </>
    )
  }
}

export default App
