// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import t from './theme'
import themes from './themes'
import { GlobalStyle } from '~/renderer/styles/global'

const StyleProvider = ({ children, selectedTheme }) => {
  const theme = {
    ...t,
    colors: {
      ...t.colors,
      palette: themes[selectedTheme],
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}

export default StyleProvider
