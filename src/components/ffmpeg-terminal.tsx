import React, { useState } from 'react'
import {
  Tooltip,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Textarea,
  Field, Input,
} from '@fluentui/react-components'
import { ClipboardCode24Regular } from '@fluentui/react-icons'
import { Video } from '../model'

interface FfmpegTerminalProps {
  video?: Video
}

const FfmpegTerminal: React.FC<FfmpegTerminalProps> = (props) => {
  const [ffmpegPath, setFfmpegPath] = useState(localStorage.getItem('ffmpegPath') ?? '')
  const [sourceRoot, setSourceRoot] = useState(localStorage.getItem('sourceRoot') ?? '')
  const [exportPath, setExportPath] = useState(localStorage.getItem('exportPath') ?? '')
  return props.video ? (
    <Dialog modalType="non-modal">
      <DialogTrigger>
        <Tooltip content={<>ffmpeg导出快捷命令</>} relationship="label">
          <Button
            icon={<ClipboardCode24Regular />}
            size="large"
          />
        </Tooltip>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>ffmpeg快捷导出命令</DialogTitle>
          <DialogContent>
            <Field label="原始文件根目录">
              <Input
                placeholder="请输入原始文件根目录（绝对路径）"
                value={sourceRoot}
                onInput={(e) => {
                  localStorage.setItem('sourceRoot', e.target.value)
                  setSourceRoot(e.target.value)
                }}
              />
            </Field>
            <Field label="ffmpeg路径">
              <Input
                placeholder="请输入ffmpeg路径（绝对路径）"
                value={ffmpegPath}
                onInput={(e) => {
                  localStorage.setItem('ffmpegPath', e.target.value)
                  setFfmpegPath(e.target.value)
                }}
              />
            </Field>
            <Field label="导出文件地址">
              <Input
                placeholder="导出文件地址（绝对路径）"
                value={exportPath}
                onInput={(e) => {
                  localStorage.setItem('exportPath', e.target.value)
                  setExportPath(e.target.value)
                }}
              />
            </Field>
            <Field label="命令行">
              <Textarea
                value={`${ffmpegPath} -y -i ${sourceRoot}${props.video.dir}${props.video.src_f_name} -vf "drawtext=fontsize=52:fontcolor=yellow:box=1:boxcolor=black@0.6:text='%{pts\\:gmtime\\:${props.video.time / 1000}}'" ${exportPath}/${props.video.src_f_name}`}
              />
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">关闭</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ) : null
}

export default FfmpegTerminal
