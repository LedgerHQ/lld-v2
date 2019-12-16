#!/usr/bin/env node
const Electron = require('./utils/Electron')
const WebpackWorker = require('./utils/WebpackWorker')
const WebpackBar = require('webpackbar')
const webpack = require('webpack')
const yargs = require('yargs')
const nodeExternals = require('webpack-node-externals')

const pkg = require('./../package.json')

const { SENTRY_URL, GIT_REVISION } = process.env

// TODO: ADD BUNDLE ANALYZER

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
    __DEV__: JSON.stringify(mode === 'development'),
    __APP_VERSION__: JSON.stringify(pkg.version),
  }

  if (mode === 'development') {
    env.INDEX_URL = JSON.stringify(`http://localhost:${argv.port}/webpack/index.html`)
  }

  return env
}

const buildRendererEnv = (mode, config) => {
  const env = {
    __DEV__: JSON.stringify(mode === 'development'),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_REVISION__: JSON.stringify(GIT_REVISION),
    __SENTRY_URL__: JSON.stringify(SENTRY_URL || null),
  }

  return env
}

const buildRendererConfig = (mode, config, argv) => {
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
    plugins: [
      ...plugins,
      new WebpackBar({ name: 'renderer', color: '#8ABEB7' }),
      new webpack.DefinePlugin(buildRendererEnv(mode, config, argv)),
    ],
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
    buildRendererConfig('development', bundles.renderer.config),
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
