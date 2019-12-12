const context = require.context('./', true, /\.(json)$/)

const regexp = /\.\/([a-z]{2})\/(.+).json/

const locales = context.keys().reduce((files, filename) => {
  const lang = filename.match(regexp)
  files[lang[1]] = { [lang[2]]: context(filename) }
  return files
}, {})

export default locales
