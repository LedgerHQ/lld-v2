// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import { HashRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

import './global.css'
import { BridgeSyncProvider } from '~/renderer/bridge/BridgeSyncContext'
import StyleProvider from '~/renderer/styles/StyleProvider'

import type { State } from '~/renderer/reducers'

import CounterValues from './countervalues'

import Default from './Default'

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Span = styled.span`
  margin-right: 8px;
`

type Props = {
  store: Store<State>,
}

const App = ({ store }: Props) => (
  <Provider store={store}>
    <BridgeSyncProvider>
      <CounterValues.PollingProvider>
        <StyleProvider selectedPalette="light">
          <Router>
            <Nav style={{ marginTop: 40 }}>
              <Link to="/">
                <Span>dashboard</Span>
              </Link>
              <Link to="/accounts">
                <Span>accounts</Span>
              </Link>
              <Link to="/settings">
                <Span>settings</Span>
              </Link>
              <Link to="/account/1">
                <Span>account</Span>
              </Link>
              <Link to="/account/1/2">
                <Span>account</Span>
              </Link>
              <Link to="/manager">
                <Span>manager</Span>
              </Link>
              <Link to="/asset/tezos">
                <Span>asset</Span>
              </Link>
              <Link to="/partners">
                <Span>partners</Span>
              </Link>
            </Nav>
            <Default />
          </Router>
        </StyleProvider>
      </CounterValues.PollingProvider>
    </BridgeSyncProvider>
  </Provider>
)

export default hot(App)
