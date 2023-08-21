import React from 'react'
import {
  Button,
  Tooltip,
} from '@fluentui/react-components'
import { ApprovalsApp24Regular } from '@fluentui/react-icons'
import pkgJson from '../../package.json'
import { checkUpdate, installUpdate, onUpdaterEvent } from '@tauri-apps/api/updater'
import { message } from '@tauri-apps/api/dialog'

onUpdaterEvent(({ error, status }) => {
  console.log('Updater event', error, status)
})

const ExportTask: React.FC = () => {
  const onCheck = async () => {
    try {
      const updateFlag = await checkUpdate()
      if (updateFlag.shouldUpdate) {
        await installUpdate()
      }
    } catch (e) {
      message(JSON.stringify(e), {
        title: '更新发生错误',
        type: 'error',
      })
    }
  }
  return (
    <Tooltip content={`当前版本 v${pkgJson.version}，检查更新 `} relationship="label">
      <Button
        icon={<ApprovalsApp24Regular />}
        onClick={() => onCheck()}
      />
    </Tooltip>
  )
}

export default ExportTask
