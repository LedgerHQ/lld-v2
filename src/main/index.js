import cluster from 'cluster'

// this module handle multi processing

const spawnCoreProcess = () => {
  cluster.fork()

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with error code ${code} and signal ${signal}`)
  })
}

if (cluster.isMaster) {
  spawnCoreProcess()
  require('./electron')
} else {
  try {
    require('./core')
  } catch (err) {
    console.log(err)
  }
}
