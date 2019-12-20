// @flow

import React, { useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { lock } from '~/renderer/actions/application'
import { openModal } from '~/renderer/actions/modals'

import { hasPasswordSelector } from '~/renderer/reducers/settings'
import { hasAccountsSelector } from '~/renderer/reducers/accounts'

import type { ThemedComponent } from '~/renderer/styles/StyleProvider'

import Box from '~/renderer/components/Box'
import Tooltip from '~/renderer/components/Tooltip'
// TODO: CurrenciesStatusBanner
// import CurrenciesStatusBanner from '~/renderer/components/CurrenciesStatusBanner'
import Breadcrumb from '~/renderer/components/Breadcrumb'

import IconLock from '~/renderer/icons/Lock'
import IconSettings from '~/renderer/icons/Settings'

// TODO: ActivityIndicator
import ActivityIndicator from './ActivityIndicator'
import ItemContainer from './ItemContainer'

const Container: ThemedComponent<void> = styled(Box).attrs(() => ({
  px: 6,
}))`
  height: ${p => p.theme.sizes.topBarHeight}px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
`
const Inner = styled(Box).attrs(() => ({
  horizontal: true,
  grow: true,
  flow: 4,
  align: 'center',
}))``

const Bar = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`

export const SeparatorBar: ThemedComponent<void> = styled.div`
  height: 1px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`

const TopBar = () => {
  const settingsClickTimes = useRef([])
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const hasPassword = useSelector(hasPasswordSelector)
  const hasAccounts = useSelector(hasAccountsSelector)

  const handleLock = useCallback(() => dispatch(lock()), [dispatch])

  const navigateToSettings = useCallback(() => {
    const url = '/settings'

    const now = Date.now()
    settingsClickTimes.current = settingsClickTimes.current.filter(t => now - t < 3000).concat(now)
    if (settingsClickTimes.current.length === 7) {
      settingsClickTimes.current = []
      dispatch(openModal('MODAL_DEBUG'))
    }

    if (location.pathname !== url) {
      history.push(url)
    }
  }, [history, location, dispatch])

  return (
    <Container bg="palette.background.default" color="palette.text.shade80">
      <Inner>
        <Box grow horizontal justifyContent="space-between">
          <Breadcrumb />
          <Box horizontal>
            {/* <CurrenciesStatusBanner /> */}
            {hasAccounts && (
              <>
                <ActivityIndicator />
                <Box justifyContent="center">
                  <Bar />
                </Box>
              </>
            )}
            <Tooltip content={t('settings.title')} placement="bottom">
              <ItemContainer data-e2e="setting_button" isInteractive onClick={navigateToSettings}>
                <IconSettings size={16} />
              </ItemContainer>
            </Tooltip>
            {hasPassword && (
              <>
                <Box justifyContent="center">
                  <Bar />
                </Box>
                <Tooltip content={t('common.lock')}>
                  <ItemContainer isInteractive justifyContent="center" onClick={handleLock}>
                    <IconLock size={16} />
                  </ItemContainer>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </Inner>
      <SeparatorBar />
    </Container>
  )
}

export default TopBar
