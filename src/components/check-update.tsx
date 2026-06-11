import React from 'react'
import {
  Button,
  Tooltip,
} from '@fluentui/react-components'
import { ApprovalsApp24Regular } from '@fluentui/react-icons'
import pkgJson from '../../package.json'
import { check } from '@tauri-apps/plugin-updater'
import { message } from '@tauri-apps/plugin-dialog'

const ExportTask: React.FC = () => {
  const onCheck = async () => {
    try {
      const update = await check()
      if (update) {
        await update.downloadAndInstall()
      }
    } catch (e) {
      message(JSON.stringify(e), {
        title: '更新发生错误',
        kind: 'error',
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
