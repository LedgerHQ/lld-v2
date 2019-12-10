#!/usr/bin/env node

const yargs = require('yargs')
const execa = require('execa')
const Listr = require('listr')
const path = require('path')
const rimraf = require('rimraf')

const cleaningTasks = new Listr(
  [
    {
      title: 'Cleaning dist/ folder',
      task: () =>
        new Promise((resolve, reject) => {
          const distDir = path.resolve(__dirname, '..', 'dist')
          rimraf(distDir, error => {
            if (error) return reject(error)
            resolve()
          })
        }),
    },
    {
      title: 'Cleaning node_modules',
      task: () =>
        new Promise((resolve, reject) => {
          const nodeModulesDir = path.resolve(__dirname, '..', 'node_modules')
          rimraf(nodeModulesDir, error => {
            if (error) return reject(error)
            resolve()
          })
        }),
    },
  ],
  { concurrent: true },
)

const setupTasks = new Listr([
  {
    title: 'Installing packages',
    task: async () => {
      try {
        const { stdout } = await execa('yarn')
        return stdout
      } catch (error) {
        throw new Error('Could not install node_modules')
      }
    },
  },
  {
    title: 'Rebuilding app deps',
    task: async () => {
      try {
        const { stdout } = await execa('yarn', ['install-deps'])
        return stdout
      } catch (error) {
        throw new Error('Could not rebuild app deps')
      }
    },
  },
])

const buildTasks = (pack = false) =>
  new Listr([
    {
      title: 'Compiling assets',
      task: async () => {
        try {
          const { stdout } = await execa('yarn', ['build'])
          return stdout
        } catch (error) {
          throw new Error('Could not build the app')
        }
      },
    },
    {
      title: pack
        ? 'Packing the electron application (for debug purpose)'
        : 'Bundling the electron application',
      task: async () => {
        try {
          const { stdout } = await execa('yarn', ['dist:internal', pack ? '--dir' : null])
          return stdout
        } catch (error) {
          throw new Error(`Could not ${pack ? 'pack' : 'bundle'} the electron app`)
        }
      },
    },
  ])

const mainTask = (pack = false) =>
  new Listr([
    {
      title: 'Cleanup',
      task: () => cleaningTasks,
    },
    {
      title: 'Setup',
      task: () => setupTasks,
    },
    {
      title: 'Build',
      task: () => buildTasks(pack),
    },
  ])

yargs
  .usage('Usage: $0 <command> [options]')
  .command({
    command: ['build', '$0'],
    desc: 'bundles the electron app',
    builder: yrgs =>
      yrgs.option('p', {
        alias: 'pack',
        type: 'boolean',
      }),
    handler: args => {
      mainTask(args.p)
        .run()
        .catch(() => {
          process.exit(-1)
        })
    },
  })
  .help('h')
  .alias('h', 'help')
  .parse()
