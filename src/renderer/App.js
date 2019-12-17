// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components'

import dbMiddlewares from './middlewares/db'
import createStore from './createStore'

import './global.css'

import Index from './screens/index'
import Account from './screens/account'
import Accounts from './screens/accounts'
import Asset from './screens/asset'
import Dashboard from './screens/dashboard'
import Manager from './screens/manager'
import Partners from './screens/partners'
import Settings from './screens/settings'

const store = createStore({ dbMiddlewares })

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const A = styled.a`
  margin-right: 8px;
`

const App = () => (
  <Provider store={store}>
    <Router>
      <Nav style={{ marginTop: 40 }}>
        <Link to="/">
          <A>index</A>
        </Link>
        <Link to="/accounts">
          <A>accounts</A>
        </Link>
        <Link to="/account">
          <A>account</A>
        </Link>
        <Link to="/asset">
          <A>asset</A>
        </Link>
        <Link to="/dashboard">
          <A>dashboard</A>
        </Link>
        <Link to="/manager">
          <A>manager</A>
        </Link>
        <Link to="/partners">
          <A>partners</A>
        </Link>
        <Link to="/settings">
          <A>settings</A>
        </Link>
      </Nav>
      <Switch>
        <Route path="/" exact>
          <Index />
        </Route>
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
      </Switch>
    </Router>
  </Provider>
)

export default App
