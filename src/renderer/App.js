import { Component } from 'react'
import { ipcRenderer } from 'electron'
import './global.css'

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
    return 'hello world'
  }
}

export default App
