// @flow
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import locales from '../i18n'

const keys = Object.keys(locales)

const Switcher = () => {
  const { i18n } = useTranslation()

  const changeLang = useCallback(
    e => {
      if (keys.includes(e.currentTarget.value)) {
        i18n.changeLanguage(e.currentTarget.value)
      }
    },
    [i18n],
  )

  return (
    <select id="lang" onChange={changeLang}>
      {keys.map(key => (
        <option value={key} key={key}>
          {key}
        </option>
      ))}
    </select>
  )
}

export default Switcher
