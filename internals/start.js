#!/usr/bin/env node

const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const Listr = require('listr')
const { Observable } = require('rxjs')
const express = require('express')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')

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

const runWebpack = compiler =>
  new Observable(observer => {
    compiler.apply(
      new ProgressPlugin((percentage, msg) => {
        observer.next(`${msg} ${Math.floor(percentage * 100)}%`)
      }),
    )

    compiler.run((err, stats) => {
      if (err) {
        return observer.error(err)
      }
      if (stats.hasErrors()) {
        return observer.error(stats.toString({ colors: true }))
      }
      observer.complete()
    })
  })

const runWebpackDevServer = compiler =>
  new Observable(observer => {
    compiler.apply(
      new ProgressPlugin((percentage, msg) => {
        observer.next(`${msg} ${Math.floor(percentage * 100)}%`)
      }),
    )

    const devServer = webpackDevMiddleware(compiler, {
      publicPath: '/dist/renderer',
    })

    const server = express()
    server.use(devServer)
    server.use(webpackHotMiddleware(compiler))

    server.listen(8080, () => {
      observer.complete()
    })
  })

const tasks = new Listr(
  [
    {
      title: 'Building main bundle',
      task: () => {
        const compiler = webpack(configs.main)
        return runWebpack(compiler)
      },
    },
    {
      title: 'Building and serving renderer bundle',
      task: () => {
        const compiler = webpack(configs.renderer)
        return runWebpackDevServer(compiler)
      },
    },
  ],
  { concurrent: true },
)

tasks.run()
