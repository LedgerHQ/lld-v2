#!/usr/bin/env node
// @flow

const yargs = require("yargs");
const execa = require("execa");
const Listr = require("listr");
const verboseRenderer = require("listr-verbose-renderer");
const path = require("path");
const rimraf = require("rimraf");

const cleaningTasks = new Listr(
  [
    {
      title: "Cleaning dist/ folder",
      task: () =>
        new Promise((resolve, reject) => {
          const distDir = path.resolve(__dirname, "..", "dist");
          rimraf(distDir, error => {
            if (error) return reject(error);
            resolve();
          });
        }),
    },
  ],
  { concurrent: true, collapse: false },
);

const setupTasks = args =>
  new Listr(
    [
      {
        title: "Installing packages",
        task: async () => {
          await execa("yarn", ["-s", "--frozen-lockfile"], {
            stdio: args.verbose ? "inherit" : "pipe",
          });
        },
      },
    ],
    { collapse: false },
  );

const buildTasks = args =>
  new Listr(
    [
      {
        title: "Compiling assets",
        task: async () => {
          await execa("yarn", ["-s", "--frozen-lockfile", "build"], {
            stdio: args.verbose ? "inherit" : "pipe",
          });
        },
      },
      {
        title: args.p
          ? "Packing the electron application (for debug purpose)"
          : "Bundling the electron application",
        task: async () => {
          const commands = ["-s", "--frozen-lockfile", "dist:internal"];
          if (args.dir) commands.push("--dir");
          if (args.publish) commands.push("--publish", "always");
          if (args.n) {
            commands.push("--config");
            commands.push("electron-builder-nightly.yml");
          }

          await execa("yarn", commands, {
            stdio: args.verbose ? "inherit" : "pipe",
          });
        },
      },
    ],
    { collapse: false },
  );

const mainTask = (args = {}) => {
  const { dirty, verbose } = args;

  const tasks = [
    {
      title: "Cleanup",
      skip: () => (dirty ? "--dirty flag passed" : false),
      task: () => cleaningTasks,
    },
    {
      title: "Setup",
      skip: () => (dirty ? "--dirty flag passed" : false),
      task: () => setupTasks(args),
    },
    {
      title: "Build",
      task: () => buildTasks(args),
    },
  ];

  const options = {
    collapse: false,
    renderer: verbose ? verboseRenderer : undefined,
  };

  return new Listr(tasks, options);
};

yargs
  .usage("Usage: $0 <command> [options]")
  .command({
    command: ["build", "$0"],
    desc: "bundles the electron app",
    builder: yrgs =>
      yrgs
        .option("dir", {
          type: "boolean",
          describe: "Build unpacked dir. Useful for tests",
        })
        .option("n", {
          alias: "nightly",
          type: "boolean",
        })
        .option("dirty", {
          type: "boolean",
          describe: "Don't clean-up and rebuild dependencies before building",
        })
        .option("publish", {
          type: "boolean",
          describe: "Publish the created artifacts on GitHub as a draft release",
        })
        .option("verbose", {
          alias: "v",
          type: "boolean",
          describe:
            "Do not pretty print progress (ncurses) and display output from called commands",
        }),
    handler: args => {
      mainTask(args)
        .run()
        .catch(error => {
          console.error(error);
          process.exit(-1);
        });
    },
  })
  .help("h")
  .alias("h", "help")
  .parse();
