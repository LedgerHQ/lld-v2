// @flow
import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import './global.css'

import libcoreGetVersion from '../commands/libcoreGetVersion'
import { Provider } from 'react-redux'

import Title from './components/title'
import Switcher from './components/switcher'
import Img from './components/img'

type State = {
  error: ?Error,
}

type Props = {
  store: any,
}

class App extends Component<Props, State> {
  state = {
    error: null,
  }

  componentDidMount() {
    ipcRenderer.send('ready-to-show', {})
    libcoreGetVersion
      .send()
      .toPromise()
      .then(
        version => {
          console.log('libcoreGetVersion', version)
        },
        e => {
          console.error('libcoreGetVersion', e)
        },
      )
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
    })
  }

  render() {
    const { store } = this.props
    if (this.state.error) {
      return this.state.error.toString()
    }

    return (
      <Provider store={store}>
        <Title />
        <Switcher />
        <div>
          <Img />
        </div>
      </Provider>
    )
  }
}

export default App
