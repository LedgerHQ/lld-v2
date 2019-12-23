// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import { HashRouter as Router } from 'react-router-dom'

import './global.css'
import { BridgeSyncProvider } from '~/renderer/bridge/BridgeSyncContext'
import CounterValues from '~/renderer/countervalues'
import StyleProvider from '~/renderer/styles/StyleProvider'

import { UpdaterProvider } from '~/renderer/components/Updater/UpdaterContext'
import type { State } from '~/renderer/reducers'

import Default from './Default'

type Props = {
  store: Store<State>,
}

const App = ({ store }: Props) => (
  <Provider store={store}>
    <BridgeSyncProvider>
      <CounterValues.PollingProvider>
        <StyleProvider selectedPalette="light">
          <UpdaterProvider>
            <Router>
              <Default />
            </Router>
          </UpdaterProvider>
        </StyleProvider>
      </CounterValues.PollingProvider>
    </BridgeSyncProvider>
  </Provider>
)

export default hot(App)
