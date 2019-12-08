const Electron = require('./utils/Electron')
const WebpackWorker = require('./utils/WebpackWorker')
const WebpackBar = require('webpackbar');
const webpack = require('webpack')

const bundles = {
  renderer: {
    config: require('../renderer.webpack.config'),
    color: 'teal'
  },
  main: {
    config: require('../main.webpack.config'),
    color: 'orange'
  },
}

const createRendererConfig = (mode, config) => {
  const entry =
    mode === 'development'
      ? Array.isArray(config.entry)
      ? ['webpack-hot-middleware/client', ...config.entry]
      : ['webpack-hot-middleware/client', config.entry]
      : config.entry

  const plugins =
    mode === 'development'
      ? [...config.plugins, new webpack.HotModuleReplacementPlugin()]
      : config.plugins

  const alias =
    mode === 'development'
      ? { ...config.resolve.alias, 'react-dom': '@hot-loader/react-dom' }
      : config.resolve.alias

  return {
    ...config,
    mode: mode === 'production' ? 'production' : 'development',
    entry,
    plugins: [
      ...plugins,
      new WebpackBar({ name: 'renderer', color: 'indigo' })
    ],
    resolve: {
      ...config.resolve,
      alias,
    },
  }
}

const createMainConfig = (mode, config) => {
  return {
    ...config,
    mode: mode === 'production' ? 'production' : 'development',
    plugins: [
      ...config.plugins,
      new WebpackBar({ name: 'main', color: 'purple' })
    ],
  }
}

const build = async () => {
  const mainWorker = new WebpackWorker('main', createMainConfig('development', bundles.main.config))
  const rendererWorker = new WebpackWorker('renderer', createRendererConfig('development', bundles.renderer.config))
  const electron = new Electron('./dist/main/main.bundle.js')

  await Promise.all([
    mainWorker.watch(() => {
      electron.reload()
    }),
    rendererWorker.serve(8080)
  ])
  electron.start()
}

build()
