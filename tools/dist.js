#!/usr/bin/env node
// @flow

const yargs = require("yargs");
const execa = require("execa");
const Listr = require("listr");
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
    {
      title: "Cleaning node_modules",
      task: () =>
        new Promise((resolve, reject) => {
          const nodeModulesDir = path.resolve(__dirname, "..", "node_modules");
          rimraf(nodeModulesDir, error => {
            if (error) return reject(error);
            resolve();
          });
        }),
    },
  ],
  { concurrent: true, collapse: false },
);

const setupTasks = new Listr(
  [
    {
      title: "Installing packages",
      task: async () => {
        try {
          const { stdout } = await execa("yarn");
          return stdout;
        } catch (error) {
          process.stderr.write(error);
          throw new Error("Could not install node_modules");
        }
      },
    },
    {
      title: "Rebuilding app deps",
      task: async () => {
        try {
          const { stdout } = await execa("yarn", ["install-deps"]);
          return stdout;
        } catch (error) {
          process.stderr.write(error);
          throw new Error("Could not rebuild app deps");
        }
      },
    },
  ],
  { collapse: false },
);

const buildTasks = (args = {}) =>
  new Listr(
    [
      {
        title: "Compiling assets",
        task: async () => {
          try {
            const { stdout } = await execa("yarn", ["build"]);
            return stdout;
          } catch (error) {
            process.stderr.write(error);
            throw new Error("Could not build the app");
          }
        },
      },
      {
        title: args.p
          ? "Packing the electron application (for debug purpose)"
          : "Bundling the electron application",
        task: async () => {
          try {
            const commands = ["dist:internal"];
            if (args.p) commands.push("--dir");
            if (args.n) {
              commands.push("--config");
              commands.push("electron-builder-nightly.yml");
            }

            const { stdout } = await execa("yarn", commands);
            return stdout;
          } catch (error) {
            process.stderr.write(error);
            throw new Error(`Could not ${args.p ? "pack" : "bundle"} the electron app`);
          }
        },
      },
    ],
    { collapse: false },
  );

const mainTask = args => {
  const { dirty } = args;
  const tasks = dirty
    ? []
    : [
        {
          title: "Cleanup",
          task: () => cleaningTasks,
        },
        {
          title: "Setup",
          task: () => setupTasks,
        },
      ];

  tasks.push({
    title: "Build",
    task: () => buildTasks(args),
  });

  return new Listr(tasks, { collapse: false });
};

yargs
  .usage("Usage: $0 <command> [options]")
  .command({
    command: ["build", "$0"],
    desc: "bundles the electron app",
    builder: yrgs =>
      yrgs
        .option("p", {
          alias: "pack",
          type: "boolean",
        })
        .option("n", {
          alias: "nightly",
          type: "boolean",
        })
        .option("dirty", {
          type: "boolean",
          describe: "Don't clean-up and rebuild dependencies before building",
        }),
    handler: args => {
      mainTask(args)
        .run()
        .catch(() => {
          process.exit(-1);
        });
    },
  })
  .help("h")
  .alias("h", "help")
  .parse();
