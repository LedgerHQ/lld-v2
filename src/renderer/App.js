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
import StyleProvider from '~/renderer/styles/StyleProvider'

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
    <StyleProvider selectedTheme="dusk"></StyleProvider>
  </Provider>
)

export default App
