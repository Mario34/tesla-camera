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
  Field,
  Input,
  Radio,
  RadioGroup,
} from '@fluentui/react-components'
import { ClipboardCode24Regular } from '@fluentui/react-icons'
import { Video } from '../model'

interface FfmpegTerminalProps {
  video?: Video
}

type CameraType = 'f' | 'b' | 'l' | 'r'

function copyText(text: string) {
  const id = 'copy-input'
  let inputElm = document.getElementById('copy-input') as HTMLInputElement
  if (!inputElm) {
    inputElm = document.createElement('input')
    inputElm.setAttribute('id', id)
    inputElm.setAttribute('style', 'position: fixed; top: -100vh; left: -100vw; optical: 0;')
  } else {
    document.body.append(inputElm)
  }
  inputElm.value = text
  inputElm.select()
  inputElm.setSelectionRange(0, 99999)
  navigator.clipboard.writeText(inputElm.value)
}

const FfmpegTerminal: React.FC<FfmpegTerminalProps> = (props) => {
  const [ffmpegPath, setFfmpegPath] = useState(localStorage.getItem('ffmpegPath') ?? '')
  const [sourceRoot, setSourceRoot] = useState(localStorage.getItem('sourceRoot') ?? '')
  const [exportPath, setExportPath] = useState(localStorage.getItem('exportPath') ?? '')
  const [camera, setCamera] = useState<CameraType>(localStorage.getItem('camera') as CameraType ?? 'f')
  const getFileName = (camera: CameraType) => {
    switch (camera) {
      case 'f':
        return props.video?.src_f_name
      case 'l':
        return props.video?.src_l_name
      case 'r':
        return props.video?.src_r_name
      case 'b':
        return props.video?.src_b_name
      default:
        return props.video?.src_f_name
    }
  }
  const terminal = props.video ? `${ffmpegPath} -y -i ${sourceRoot}${props.video.dir}${getFileName(camera)} -vf "drawtext=fontsize=52:fontcolor=yellow:box=1:boxcolor=black@0.6:text='%{pts\\:localtime\\:${props.video?.time / 1000}}'" ${exportPath}/${getFileName(camera)}` : ''
  return props.video ? (
    <Dialog modalType="non-modal">
      <DialogTrigger>
        <Tooltip content={<>ffmpeg快捷命令</>} relationship="label">
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
            <Field label="相机视角">
              <RadioGroup
                layout="horizontal"
                value={camera}
                onChange={(_, data) => setCamera(data.value)}
              >
                <Radio label="前" value="f" />
                <Radio label="后" value="b" />
                <Radio label="左" value="l" />
                <Radio label="右" value="r" />
              </RadioGroup>
            </Field>
            <Field label="原始文件根目录">
              <Input
                placeholder="请输入原始文件根目录（path/../TeslaCam）"
                value={sourceRoot}
                onInput={(e) => {
                  localStorage.setItem('sourceRoot', e.target.value)
                  setSourceRoot(e.target.value)
                }}
              />
            </Field>
            <Field label="ffmpeg路径">
              <Input
                placeholder="请输入ffmpeg路径（path/../ffmpeg）"
                value={ffmpegPath}
                onInput={(e) => {
                  localStorage.setItem('ffmpegPath', e.target.value)
                  setFfmpegPath(e.target.value)
                }}
              />
            </Field>
            <Field label="导出文件地址">
              <Input
                placeholder="导出文件地址（path/../export）"
                value={exportPath}
                onInput={(e) => {
                  localStorage.setItem('exportPath', e.target.value)
                  setExportPath(e.target.value)
                }}
              />
            </Field>
            <Field label="命令行">
              <Textarea value={terminal} />
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">关闭</Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={() => copyText(terminal)}>复制</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  ) : null
}

export default FfmpegTerminal
