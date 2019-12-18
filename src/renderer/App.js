// @flow
import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import './global.css'

import Text from '~/renderer/components/Text'
import libcoreGetVersion from '~/commands/libcoreGetVersion'
import { Provider } from 'react-redux'

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
        <div>
          <Text ff="Inter|Bold">looool</Text>
        </div>
      </Provider>
    )
  }
}

export default App
