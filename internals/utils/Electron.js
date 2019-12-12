const execa = require('execa')

class Electron {
  constructor(bundlePath) {
    this.instance = null
    this.bundlePath = bundlePath
  }

  start() {
    if (!this.instance) {
      this.instance = execa('electron', [this.bundlePath], { preferLocal: true })
      this.instance.stdout.pipe(process.stdout)
    }
  }

  stop() {
    if (this.instance) {
      this.instance.cancel()
      this.instance = null
    }
  }

  reload() {
    if (this.instance) {
      this.stop()
      this.start()
    }
  }
}

module.exports = Electron
