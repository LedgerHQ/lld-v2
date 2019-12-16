#!/usr/bin/env node
const Electron = require('./utils/Electron')
const WebpackWorker = require('./utils/WebpackWorker')
const WebpackBar = require('webpackbar')
const webpack = require('webpack')
const yargs = require('yargs')
const nodeExternals = require('webpack-node-externals')
const reduce = require('lodash/reduce')

const bundles = {
  renderer: {
    config: require('../renderer.webpack.config'),
    color: 'teal',
  },
  main: {
    config: require('../main.webpack.config'),
    color: 'orange',
  },
}

const buildMainEnv = (mode, config, argv) => {
  const env = {
    __DEV__: mode === 'development',
  }

  if (mode === 'development') {
    env.INDEX_URL = `http://localhost:${argv.port}/webpack/index.html`
  }

  console.log('current env:', env)

  return reduce(
    env,
    (acc, value, key) => {
      acc[key] = JSON.stringify(value)
      return acc
    },
    {},
  )
}

const buildRendererConfig = (mode, config) => {
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
    devtool: mode === 'development' ? 'eval-source-map' : 'none',
    entry,
    plugins: [...plugins, new WebpackBar({ name: 'renderer', color: '#8ABEB7' })],
    resolve: {
      ...config.resolve,
      alias,
    },
    output: {
      ...config.output,
      publicPath: mode === 'production' ? './' : '/webpack',
    },
  }
}

const buildMainConfig = (mode, config, argv) => {
  return {
    ...config,
    mode: mode === 'production' ? 'production' : 'development',
    devtool: mode === 'development' ? 'eval-source-map' : 'none',
    externals: [nodeExternals()],
    node: {
      __dirname: false,
      __filename: false,
    },
    plugins: [
      ...config.plugins,
      new WebpackBar({ name: 'main', color: '#F0C674' }),
      new webpack.DefinePlugin(buildMainEnv(mode, config, argv)),
    ],
  }
}

const startDev = async argv => {
  const mainWorker = new WebpackWorker(
    'main',
    buildMainConfig('development', bundles.main.config, argv),
  )
  const rendererWorker = new WebpackWorker(
    'renderer',
    buildRendererConfig('development', bundles.renderer.config, argv),
  )
  const electron = new Electron('./.webpack/main.bundle.js')

  await Promise.all([
    mainWorker.watch(() => {
      electron.reload()
    }),
    rendererWorker.serve(argv.port),
  ])
  electron.start()
}

const build = async argv => {
  const mainConfig = buildMainConfig('production', bundles.main.config, argv)
  const rendererConfig = buildRendererConfig('production', bundles.renderer.config, argv)

  const mainWorker = new WebpackWorker('main', mainConfig)
  const rendererWorker = new WebpackWorker('renderer', rendererConfig)

  await Promise.all([mainWorker.bundle(), rendererWorker.bundle()])
}

yargs
  .usage('Usage: $0 <command> [options]')
  .command({
    command: ['dev', '$0'],
    desc: 'start the development workflow',
    builder: yargs =>
      yargs.option('port', {
        alias: 'p',
        type: 'number',
        default: 8080,
      }),
    handler: startDev,
  })
  .command({
    command: 'build',
    desc: 'build the app for production',
    handler: build,
  })
  .help('h')
  .alias('h', 'help')
  .parse()
