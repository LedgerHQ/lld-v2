const chalk = require("chalk");
const hasha = require("hasha");
const execa = require("execa");
const fs = require("fs");

const rebuildDeps = async file => {
  try {
    await execa("yarn", ["install-deps"], {
      // env: { DEBUG: "electron-builder" },
    }).stdout.pipe(process.stdout);
    const checksum = await hasha.async(file, { algorithm: "md5" });
    await fs.promises.writeFile(file, checksum);
  } catch (err) {
    console.log(chalk.red(err));
  }
};

async function main() {
  const file = "node_modules/.cache/LEDGER_HASH_yarn.lock.hash";

  try {
    const oldChecksum = await fs.promises.readFile(file, { encoding: "utf8" });
    const currentChecksum = await hasha(file, { algorithm: "md5" });
    if (oldChecksum !== currentChecksum) {
      rebuildDeps(file);
    } else {
      console.log(chalk.blue("checksum are identical, no need to rebuild deps"));
    }
  } catch (error) {
    console.log(
      chalk.blue("no previous checksum saved, will rebuild native deps and save new checksum"),
    );
    await rebuildDeps(file);
  }
}

main();
