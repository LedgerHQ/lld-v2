// @flow
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import gt from 'semver/functions/gt'

import { MODAL_RELEASES_NOTES } from '~/config/constants'

import { lastUsedVersionSelector } from '~/renderer/reducers/settings'

import { saveSettings } from '~/renderer/actions/settings'
import { openModal } from '~/renderer/actions/modals'

const IsNewVersion = () => {
  const dispatch = useDispatch()
  const lastUsedVersion = useSelector(lastUsedVersionSelector)
  const currentVersion = __APP_VERSION__

  useEffect(() => {
    if (gt(currentVersion, lastUsedVersion)) {
      dispatch(openModal(MODAL_RELEASES_NOTES, currentVersion))
      dispatch(saveSettings({ lastUsedVersion: currentVersion }))
    }
  }, [])

  return null
}

export default IsNewVersion
