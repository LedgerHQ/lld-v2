// @flow
import React from 'react'
import '~/renderer/global.css'
import { Provider } from 'react-redux'
import { HashRouter as Router, Link, Switch } from 'react-router-dom'
import styled from 'styled-components'

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
    <StyleProvider selectedTheme="dusk">
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
        <Switch>
          <Default />
        </Switch>
      </Router>
    </StyleProvider>
  </Provider>
)

export default App
