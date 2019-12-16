// @flow

import fs from 'fs'

import { promisify } from './promise'

export const fsReadFile = promisify(fs.readFile)
export const fsReaddir = promisify(fs.readdir)
export const fsWriteFile = promisify(fs.writeFile)
export const fsMkdir = promisify(fs.mkdir)
export const fsUnlink = promisify(fs.unlink)
