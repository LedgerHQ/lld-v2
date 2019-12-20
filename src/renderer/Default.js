// @flow

import { remote } from 'electron'
import React, { useEffect, useCallback, createRef } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'

// import { SYNC_PENDING_INTERVAL } from '~/config/constants'

import Box from '~/renderer/components/Box/Box'
import GrowScroll from '~/renderer/components/GrowScroll'
import ListenDevices from '~/renderer/components/ListenDevices'
import ExportLogsBtn from '~/renderer/components/ExportLogsButton'
import Idler from '~/renderer/components/Idler'

import Dashboard from '~/renderer/screens/dashboard'
import Settings from '~/renderer/screens/settings'
import Accounts from '~/renderer/screens/accounts'
import Manager from '~/renderer/screens/manager'
import Partners from '~/renderer/screens/partners'
import Account from '~/renderer/screens/account'
import Asset from '~/renderer/screens/asset'
import IsUnlocked from './components/IsUnlocked'

const Main = styled(GrowScroll).attrs(() => ({
  px: 6,
}))`
  outline: none;
  padding-top: ${p => p.theme.sizes.topBarHeight + p.theme.space[6]}px;
`

const Default = () => {
  const location = useLocation()
  const ref = createRef()

  const kbShortcut = useCallback(event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      remote.getCurrentWindow().webContents.reload()
    }
  }, [])

  // onMount onWillUnmount
  useEffect(() => {
    window.addEventListener('keydown', kbShortcut)

    // Prevents adding multiple listeners when hot reloading
    return () => window.removeEventListener('keydown', kbShortcut)
  }, [])

  // TODO: REWORK SCROLLTOP (GROWSCROLL Component)
  useEffect(() => {
    // if (ref.current) {
    //   ref.current.scrollContainer.scrollTo(0, 0)
    // }
  }, [location, ref.current])

  return (
    <>
      <ListenDevices />
      <ExportLogsBtn hookToShortcut />

      {/* TODO: ANALYTICS: v1 = analytics/track */}
      {/* <Track mandatory onMount event="App Starts" /> */}
      <Idler />

      <div id="sticky-back-to-top-root" />
      <IsUnlocked>
        <Box grow horizontal bg="palette.background.paper">
          {/* TODO: SIDEBAR HERE */}
          <Box
            className="main-container"
            shrink
            grow
            bg="palette.background.default"
            color="palette.text.shade60"
            overflow="visible"
            relative
          >
            <Main ref={ref} tabIndex={-1} full>
              <Switch>
                <Route path="/" exact>
                  <Dashboard />
                </Route>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/accounts">
                  <Accounts />
                </Route>
                <Route path="/manager">
                  <Manager />
                </Route>
                <Route path="/partners">
                  <Partners />
                </Route>
                <Route path="/account/:parentId/:id">
                  <Account />
                </Route>
                <Route path="/account/:id">
                  <Account />
                </Route>
                <Route path="/asset/:assetId+">
                  <Asset />
                </Route>
              </Switch>
            </Main>
          </Box>
        </Box>
      </IsUnlocked>
    </>
  )
}

export default Default
