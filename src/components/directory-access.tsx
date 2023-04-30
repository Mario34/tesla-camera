import React from 'react'
import {
  Tooltip,
  Body1Strong,
  Button,
} from '@fluentui/react-components'
import { FolderAdd24Regular } from '@fluentui/react-icons'
import dayjs from 'dayjs'
import { type OriginVideo, TypeEnum } from '../model'

interface DirectoryAccessProps {
  onAccess: (videos: OriginVideo[]) => void
}

interface VideoFile {
  fs: FileSystemHandle
  path: string
}

async function getDirFiles(fs: FileSystemDirectoryHandle, path = '') {
  const files: VideoFile[] = []
  const fsHandles = await fs.values()
  for await (const fsHandle of fsHandles) {
    const currentPath = `${path}/${fsHandle.name}`
    if (fsHandle.kind === 'file') {
      files.push({ fs: fsHandle, path: currentPath })
    }
    if (fsHandle.kind === 'directory') {
      files.push(...await getDirFiles(fsHandle, currentPath))
    }
  }
  return files
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

function convertFiles(videoFiles: VideoFile[]): OriginVideo[] {
  const reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}-.+/
  const videos: Record<string, Partial<OriginVideo>> = {}
  videoFiles.forEach(({ fs, path }) => {
    if (!reg.test(fs.name)) {
      return
    }
    const name = fs.name.slice(0, 19)
    let exists = videos[name]
    if (!exists) {
      exists = {
        title: nameToTitle(name),
        time: nameToTime(name),
        type: pathToType(path),
      }
      videos[name] = exists
    }
    if (fs.name.includes('front')) {
      exists.src_f = fs
    }
    if (fs.name.includes('back')) {
      exists.src_b = fs
    }
    if (fs.name.includes('right_repeater')) {
      exists.src_r = fs
    }
    if (fs.name.includes('left_repeater')) {
      exists.src_l = fs
    }
  })
  return Object.values(videos) as OriginVideo[]
}

const DirectoryAccess: React.FC<React.PropsWithChildren<DirectoryAccessProps>> = (props) => {
  async function onSelectFile() {
    const dirHandle = await window.showDirectoryPicker()
    const files = await getDirFiles(dirHandle)
    const convert = convertFiles(files)
    props.onAccess(convert)
  }
  return (
    <Tooltip content={<>选择车载U盘中的<Body1Strong>TeslaCam</Body1Strong>目录，或者是<Body1Strong>TeslaCam</Body1Strong>文件目录的拷贝</>} relationship="label">
      <Button icon={<FolderAdd24Regular />} size="large" onClick={() => onSelectFile()} />
    </Tooltip>
  )
}

export default DirectoryAccess
