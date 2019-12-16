// @flow

// This is a test example for dev testing purpose.

import { interval } from 'rxjs/observable/interval'
import { createCommand, Command } from './ipcCommand'

type Input = number
type Result = number

const cmd: Command<Input, Result> = createCommand('testInterval', interval)

export default cmd
