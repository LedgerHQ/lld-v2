// @flow

import Color from 'color'

const context = require.context('./', true, /\.(json)$/)

const regexp = /\.\/(.+).json/

const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

type RawPalette = {
  type: 'light' | 'dark',
  primary: {
    main: String,
    contrastText: String,
  },
  secondary: {
    main: String,
  },
  background: {
    paper: String,
    default: String,
  },
  action: {
    active: 'String',
    hover: 'String',
    disabled: 'String',
  },
}

export type Theme = {
  ...RawPalette,
  text: {
    shade10: String,
    shade20: String,
    shade30: String,
    shade40: String,
    shade50: String,
    shade60: String,
    shade70: String,
    shade80: String,
    shade90: String,
    shade100: String,
  },
}

const enrichPalette = (rawPalette: RawPalette): Theme => {
  return {
    ...rawPalette,
    text: shades.reduce((acc, value) => {
      acc[`shade${value}`] = Color(rawPalette.secondary.main)
        .alpha(value / 100)
        .toString()
      return acc
    }, {}),
  }
}

const palettes = context.keys().reduce((acc, filename) => {
  const name = filename.match(regexp)[1]
  const rawPalette: RawPalette = context(filename)
  acc[name] = enrichPalette(rawPalette)

  return acc
}, {})

export default palettes
