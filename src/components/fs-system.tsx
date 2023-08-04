import React from 'react'
import {
  Tooltip,
  Body1Strong,
  Button,
} from '@fluentui/react-components'
import { FolderAdd24Regular } from '@fluentui/react-icons'
import { readDir } from '@tauri-apps/api/fs'
import dayjs from 'dayjs'
import {
  type OriginVideo, TypeEnum, type TauriFile, type EventJson,
} from '../model'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'

interface FsSystemProps {
  onAccess: (accessFile: OriginVideo[]) => void
}

function nameToTime(name: string): number {
  const date = name.slice(0, 10)
  const hours = name.slice(11, 13)
  const minutes = name.slice(14, 16)
  const seconds = name.slice(17, 19)
  return dayjs(`${date} ${hours}:${minutes}:${seconds}`).valueOf()
}

function nameToTitle(name: string): string {
  const time = nameToTime(name)
  return dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
}

function pathToType(path: string) {
  if (path.includes('SavedClips')) {
    return TypeEnum.事件
  }
  if (path.includes('RecentClips')) {
    return TypeEnum.行车记录仪
  }
  if (path.includes('SentryClips')) {
    return TypeEnum.哨兵
  }
  return TypeEnum.所有
}

function getDirFiles(files: TauriFile[]) {
  const result: TauriFile[] = []
  files.forEach(item => {
    if (item.children?.length) {
      result.push(...getDirFiles(item.children))
    } else {
      result.push(item)
    }
  })
  return result
}

function convertVideoFiles(videoFiles: TauriFile[]): OriginVideo[] {
  const reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}-.+/
  const videos: Record<string, Partial<OriginVideo>> = {}
  videoFiles.forEach(({ name, path }) => {
    if (!reg.test(name)) {
      return
    }
    const timeName = name.slice(0, 19)
    let exists = videos[timeName]
    if (!exists) {
      exists = {
        title: nameToTitle(timeName),
        time: nameToTime(timeName),
        type: pathToType(path),
        dir: path,
      }
      videos[timeName] = exists
    }
    const fs = {
      async get() {
        return Promise.resolve({
          url: convertFileSrc(path),
          name,
        })
      },
    }
    if (name.includes('front')) {
      exists.src_f = fs
    }
    if (name.includes('back')) {
      exists.src_b = fs
    }
    if (name.includes('right_repeater')) {
      exists.src_r = fs
    }
    if (name.includes('left_repeater')) {
      exists.src_l = fs
    }
  })
  return Object.values(videos) as OriginVideo[]
}

const FsSystem: React.FC<FsSystemProps> = props => {
  async function onSelectFile() {
    const teslaCamDir = await open({
      directory: true,
      multiple: false,
      recursive: true,
    })
    if (!teslaCamDir) {
      return
    }
    readDir(teslaCamDir as string, { recursive: true }).then(async res => {
      const files = getDirFiles(res as TauriFile[])
      const videos = convertVideoFiles(files)
      const eventsFiles = files.filter(({ path }) => /.+event.json$/.test(path))
      let events: EventJson[] = []
      for (let i = 0; i < eventsFiles.length; i++) {
        const eventJsonText = await readTextFile(eventsFiles[i].path)
        events.push(JSON.parse(eventJsonText))
      }
      events = events.sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf())
      const newVideos = videos.sort((a, b) => a.time - b.time)
      newVideos.forEach((item, vIndex) => {
        const eIndex = events.findIndex(({ timestamp }) => item.time > dayjs(timestamp).valueOf())
        if (eIndex > -1) {
          const event = events[eIndex]
          events.splice(eIndex, 1)
          if (newVideos[vIndex - 1]) {
            newVideos[vIndex - 1].event = dayjs(event.timestamp).valueOf()
          }
        }
      })
      props.onAccess(newVideos)
    })
  }
  return (
    <Tooltip
      content={<>选择车载U盘中的<Body1Strong>TeslaCam</Body1Strong>目录，或者是<Body1Strong>TeslaCam</Body1Strong>文件目录的拷贝</>}
      relationship="label"
    >
      <Button
        icon={<FolderAdd24Regular />}
        size="large"
        onClick={() => onSelectFile()}
      />
    </Tooltip>
  )
}

export default FsSystem
