// @flow

import Color from 'color'

const context = require.context('./', true, /\.(json)$/)

const regexp = /\.\/(.+).json/

const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const enrichTheme = rawTheme => {
  return {
    ...rawTheme,
    text: shades.reduce((acc, value) => {
      acc[`shade${value}`] = Color(rawTheme.secondary.main)
        .alpha(value / 100)
        .toString()
      return acc
    }, {}),
  }
}

const themes = context.keys().reduce((acc, filename) => {
  const name = filename.match(regexp)[1]
  const rawTheme = context(filename)
  acc[name] = enrichTheme(rawTheme)

  return acc
}, {})

console.log(themes)
export default themes
