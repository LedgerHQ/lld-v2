#!/usr/bin/env node

const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const Listr = require('listr')
const { Observable } = require('rxjs')

console.log(process.env.INIT_CWD)

const configs = {
  renderer: require('../renderer.webpack.config'),
  main: require('../main.webpack.config'),
}

const runWebpack = config =>
  new Observable(observer => {
    const compiler = webpack(config)

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

const tasks = new Listr(
  [
    {
      title: 'Building main bundle',
      task: () => runWebpack(configs.main),
    },
    {
      title: 'Building renderer bundle',
      task: () => runWebpack(configs.renderer),
    },
  ],
  { concurrent: true },
)

tasks.run()
