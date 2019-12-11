// @flow
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import locales from '.'

const config = {
  resources: locales,
  lng: 'en',
  defaultNS: 'app',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },

  debug: true, // TODO disable when not in dev
  react: {
    useSuspense: false,
  },
}

i18n.use(initReactI18next).init(config)

export default i18n
