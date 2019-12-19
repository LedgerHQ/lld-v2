// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '~/renderer/styles/global'

import defaultTheme from './theme'
import themes from './themes'

type Props = {
  children: React$Node,
  selectedTheme: any,
}

const StyleProvider = ({ children, selectedTheme }: Props) => {
  const theme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
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
