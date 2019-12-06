#!/usr/bin/env node

const webpack = require('webpack');
const Listr = require('listr');

const config = {
  renderer: require('./renderer.webpack.config'),
  main: require('./main.webpack.config')
}

const tasks = new Listr([
  {
    title: 'Building main bundle',
    task: () => new Promise((resolve, reject) => {
      webpack(config.main, (err, stats) => {
        if (err) {
          return reject(err)
        }
        if (stats.hasErrors()) {
          return reject(stats.toString({ colors: true }))
        }
        resolve()
      })
    })
  },
  {
    title: 'Building renderer bundle',
    task: () => new Promise((resolve, reject) => {
      webpack(config.main, (err, stats) => {
        if (err) {
          return reject(err)
        }
        if (stats.hasErrors()) {
          return reject(stats.toString({ colors: true }))
        }
        resolve()
      })
    })
  }
], { concurrent: true })

tasks.run()