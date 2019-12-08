#!/usr/bin/env node

const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const Listr = require('listr')
const { Observable } = require('rxjs')
const express = require('express')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const execa = require('execa')
const winston = require('winston')
const path = require('path')
const Electron = require('./utils/Electron')

const webpackDir = path.resolve(__dirname, '../.webpack')

const createLogger = name => winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: path.resolve(webpackDir, name, `${name}.log`),
    }),
  ]
})

const electron = new Electron('./dist/main/main.bundle.js')

const mainLogger = createLogger('main')
const rendererLogger = createLogger('renderer')

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
    plugins,
    resolve: {
      ...config.resolve,
      alias,
    },
  }
}

const configs = {
  renderer: createRendererConfig('development', require('../renderer.webpack.config')),
  main: require('../main.webpack.config'),
}

const runWebpack = (name, config) => ctx => {
  let started = false

  return new Observable(observer => {
    const compiler = webpack(config)

    compiler.apply(
      new ProgressPlugin((percentage, msg) => {
        if (!started) {
          observer.next(`${msg} ${Math.floor(percentage * 100)}%`)
        }
      }),
    )

    const watcher = compiler.watch({}, (err, stats) => {
      if (stats) {
        mainLogger.info(stats.toString({ colors: true }))
      }
      if (err) {
        mainLogger.error(err)
        return observer.error(err)
      }
      if (stats.hasErrors()) {
        return observer.error("Error while bundling, please check the logs")
      }

      if (!started) {
        started = true
        observer.complete()
      } else {
        console.log('reloading electron')
        electron.reload()
      }
    })
  })

}

const runWebpackDevServer = config =>
  new Observable(observer => {
    const compiler = webpack(config)

    compiler.apply(
      new ProgressPlugin((percentage, msg) => {
        observer.next(`${msg} ${Math.floor(percentage * 100)}%`)
        if (percentage === 1) {
          observer.complete()
        }
      }),
    )

    const devServer = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      logger: {
        debug: rendererLogger.debug.bind(rendererLogger),
        log: rendererLogger.log.bind(rendererLogger),
        info: rendererLogger.info.bind(rendererLogger),
        error: rendererLogger.error.bind(rendererLogger),
        warn: rendererLogger.warn.bind(rendererLogger),
      }
    })

    const server = express()
    server.use(devServer)
    server.use(webpackHotMiddleware(compiler))

    server.listen(8080, () => {
    })
  })

const mainTasks = new Listr([
  {
    title: 'Building bundles',
    task: () => new Listr(
      [
        {
          title: '- main',
          task: runWebpack('main', configs.main),
        },
        {
          title: '- renderer',
          task: () => {
            return runWebpackDevServer(configs.renderer)
          },
        },
      ],
      { concurrent: true, collapse: false},
    )
  },
  {
    title: 'Starting electron',
    task: async ctx => {
      electron.start()
    },
  },
], { collapse: false })

const initialContext = {
  watchers: {}
}

mainTasks.run(initialContext).catch(err => {
  console.log('ERROR: ', err)
})
