import cluster from 'cluster'
import electronMain from './electron'
import coreMain from './core'

const spawnCoreProcess = () => {
  cluster.fork()

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with error code ${code} and signal ${signal}`)
  })
}

if (cluster.isMaster) {
  spawnCoreProcess()
  electronMain()
} else {
  coreMain()
}
