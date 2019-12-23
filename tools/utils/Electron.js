const execa = require("execa");

const defaultElectronPath = "./node_modules/.bin/electron";

class Electron {
  constructor(bundlePath, electronPath = defaultElectronPath) {
    this.instance = null;
    this.bundlePath = bundlePath;
    this.electronPath = electronPath;
  }

  start() {
    if (!this.instance) {
      this.instance = execa(this.electronPath, [this.bundlePath]);
      this.instance.stdout.pipe(process.stdout);
    }
  }

  stop() {
    if (this.instance) {
      this.instance.cancel();
      this.instance = null;
    }
  }

  reload() {
    if (this.instance) {
      this.stop();
      this.start();
    }
  }
}

module.exports = Electron;
