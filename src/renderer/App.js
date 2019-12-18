// @flow
import React from 'react'
import '~/renderer/global.css'
import { Provider } from 'react-redux'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components'

import dbMiddlewares from '~/renderer/middlewares/db'
import createStore from '~/renderer/createStore'

import Index from '~/renderer/screens/index'
import Account from '~/renderer/screens/account'
import Accounts from '~/renderer/screens/accounts'
import Asset from '~/renderer/screens/asset'
import Dashboard from '~/renderer/screens/dashboard'
import Manager from '~/renderer/screens/manager'
import Partners from '~/renderer/screens/partners'
import Settings from '~/renderer/screens/settings'

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
    <Router>
      <Nav style={{ marginTop: 40 }}>
        <Link to="/">
          <Span>index</Span>
        </Link>
        <Link to="/accounts">
          <Span>accounts</Span>
        </Link>
        <Link to="/account">
          <Span>account</Span>
        </Link>
        <Link to="/asset">
          <Span>asset</Span>
        </Link>
        <Link to="/dashboard">
          <Span>dashboard</Span>
        </Link>
        <Link to="/manager">
          <Span>manager</Span>
        </Link>
        <Link to="/partners">
          <Span>partners</Span>
        </Link>
        <Link to="/settings">
          <Span>settings</Span>
        </Link>
      </Nav>
      <Switch>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/accounts">
          <Accounts />
        </Route>
        <Route path="/asset">
          <Asset />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/manager">
          <Manager />
        </Route>
        <Route path="/partners">
          <Partners />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/" exact>
          <Index />
        </Route>
      </Switch>
    </Router>
  </Provider>
)

export default App
