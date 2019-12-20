// @flow
import fs from 'fs'
import moment from 'moment'
import { ipcRenderer, webFrame, remote } from 'electron'
import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllEnvs } from '@ledgerhq/live-common/lib/env'
import KeyHandler from 'react-key-handler'

import logger from '~/logger'

import getUser from '~/helpers/user'

import Button from '~/renderer/components/Button'

const queryLogs = () =>
  new Promise(resolve => {
    ipcRenderer.once('logs', (event: any, { logs }) => {
      resolve(logs)
    })
    ipcRenderer.send('queryLogs')
  })

const writeToFile = (file, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(file, data, error => {
      return error ? reject(error) : resolve()
    })
  })

type Props = {
  hookToShortcut?: boolean,
}

const ExportLogsBtn = ({ hookToShortcut }: Props) => {
  const [exporting, setExporting] = useState(false)
  const { t } = useTranslation()

  const exportLogs = useCallback(async () => {
    const resourceUsage = webFrame.getResourceUsage()
    const user = await getUser()
    logger.log('exportLogsMeta', {
      resourceUsage,
      release: __APP_VERSION__,
      git_commit: __GIT_REVISION__,
      environment: __DEV__ ? 'development' : 'production',
      userAgent: window.navigator.userAgent,
      userAnonymousId: user.id,
      env: {
        ...getAllEnvs(),
      },
    })
    const path = await remote.dialog.showSaveDialog({
      title: 'Export logs',
      defaultPath: `ledgerlive-logs-${moment().format('YYYY.MM.DD-HH.mm.ss')}-${__GIT_REVISION__ ||
        'unversioned'}.json`,
      filters: [
        {
          name: 'All Files',
          extensions: ['json'],
        },
      ],
    })

    if (path) {
      const logs = await queryLogs()
      const json = JSON.stringify(logs)
      await writeToFile(path, json)
    }
  }, [])

  const handleExportLogs = useCallback(async () => {
    if (exporting) return

    setExporting(true)

    try {
      await exportLogs()
    } catch (error) {
      logger.critical(error)
    } finally {
      setExporting(false)
    }
  }, [exporting, setExporting, exportLogs])

  const onKeyHandle = useCallback(
    e => {
      if (e.ctrlKey) {
        handleExportLogs()
      }
    },
    [handleExportLogs],
  )

  return hookToShortcut ? (
    <KeyHandler keyValue="e" onKeyHandle={onKeyHandle} />
  ) : (
    <Button small primary event="ExportLogs" onClick={handleExportLogs}>
      {t('settings.exportLogs.btn')}
    </Button>
  )
}

export default ExportLogsBtn
