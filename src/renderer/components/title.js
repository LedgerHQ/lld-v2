// @flow
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UserState } from '~/renderer/reducers/user'

import { userSelector } from '~/renderer/selectors/user'

const Title = () => {
  const { t } = useTranslation()
  const user: UserState = useSelector(userSelector)

  return <h1>{t('accounts.title') + ' ' + user.name}</h1>
}

export default Title
