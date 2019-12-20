// @flow
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { HashRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

import '~/renderer/global.css'

import dbMiddlewares from '~/renderer/middlewares/db'
import createStore from '~/renderer/createStore'

import StyleProvider from '~/renderer/styles/StyleProvider'
import Default from '~/renderer/Default'

const store = createStore({ dbMiddlewares })

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Span = styled.span`
  margin-right: 8px;
`

const App = () => (
  <Provider store={store}>
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
  </Provider>
)

export default hot(App)
