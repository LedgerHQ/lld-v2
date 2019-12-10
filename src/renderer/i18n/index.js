const context = require.context('./', true, /\.(json)$/)

const locales = context.keys().reduce((files, filename) => {
  files[filename] = context(filename)
  return files
}, {})

export default locales
