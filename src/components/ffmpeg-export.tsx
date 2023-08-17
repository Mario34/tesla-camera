import React, { useRef, useState } from 'react'
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
  Field,
  Radio,
  RadioGroup,
  useId,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { ResizeVideo24Filled } from '@fluentui/react-icons'
import { type TauriVideo, type ExportTaskType, ExportStatusEnum } from '../model'
import { open } from '@tauri-apps/api/dialog'
import { Command } from '@tauri-apps/api/shell'
import ExportTask from './export-task'

interface FfmpegExportProps {
  video: TauriVideo
}

type CameraType = 'f' | 'b' | 'l' | 'r'

const useStyles = makeStyles({
  root: {},
  currentExportDir: {
    color: tokens.colorNeutralForeground3,
  },
})

const getFile = (camera: CameraType, video: TauriVideo) => {
  switch (camera) {
    case 'f':
      return {
        name: video.src_f_name,
        path: video.src_f_path,
      }
    case 'l':
      return {
        name: video.src_l_name,
        path: video.src_l_path,
      }
    case 'r':
      return {
        name: video.src_r_name,
        path: video.src_r_path,
      }
    case 'b':
      return {
        name: video.src_b_name,
        path: video.src_b_path,
      }
    default:
      return {
        name: video.src_f_name,
        path: video.src_f_path,
      }
  }
}

const doTask = async (
  camera: CameraType,
  video: TauriVideo,
  exportDir: string,
  log: (arg: {
    path: string
    name: string
    exportDir: string
    status: number
    log: string
  }) => void,
) => {
  const { path: filePath, name: fileName } = getFile(camera, video)
  const command = Command.sidecar(
    'binaries/ffmpeg',
    [
      '-y',
      '-i', filePath,
      '-vf', `drawtext=fontsize=52:fontcolor=white:box=1:boxborderw=10:x=10:y=10:boxcolor=black@0.4:text='%{pts\\:localtime\\:${video.time / 1000}}'`,
      `${exportDir}/${fileName}`,
    ],
  )
  command.on('close', () => {
    log({
      name: fileName,
      path: filePath,
      exportDir,
      status: ExportStatusEnum.导出成功,
      log: 'success',
    })
  })
  command.on('error', error => {
    log({
      name: fileName,
      path: filePath,
      exportDir,
      status: ExportStatusEnum.导出失败,
      log: error,
    })
  })
  command.stdout.on('data', line => {
    log({
      name: fileName,
      path: filePath,
      exportDir,
      status: ExportStatusEnum.进行中,
      log: line,
    })
  })
  command.stderr.on('data', line => {
    log({
      name: fileName,
      path: filePath,
      exportDir,
      status: ExportStatusEnum.进行中,
      log: line,
    })
  })
  const child = await command.spawn()
  log({
    name: fileName,
    path: filePath,
    exportDir,
    status: ExportStatusEnum.进行中,
    log: `pid: ${child.pid}`,
  })
}

const FfmpegExport: React.FC<FfmpegExportProps> = (props) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [tasks, setTasks] = useState<ExportTaskType[]>([])
  const tempTasks = useRef(tasks)
  const [exportDir, setExportDir] = useState(localStorage.getItem('exportDir') ?? '')
  const [camera, setCamera] = useState<CameraType>(localStorage.getItem('camera') as CameraType ?? 'f')
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)
  const styles = useStyles()
  const selectExportDir = async () => {
    const exportDir = await open({
      directory: true,
      multiple: false,
      recursive: true,
    })
    if (!exportDir) {
      return
    }
    localStorage.setItem('exportDir', exportDir as string)
    setExportDir(exportDir as string)
  }
  const onConfirm = async () => {
    if (!exportDir) {
      dispatchToast(
        <Toast>
          <ToastTitle>
            提示
          </ToastTitle>
          <ToastBody>
            请选择导出文件目录
          </ToastBody>
        </Toast>,
        { intent: 'warning' },
      )
      return
    }
    const { path: filePath } = getFile(camera, props.video)
    const existsTask = tasks.find(item => item.path === filePath)
    if (existsTask) {
      dispatchToast(
        <Toast>
          <ToastTitle>
            提示
          </ToastTitle>
          <ToastBody>
            导出任务已存在
          </ToastBody>
        </Toast>,
        { intent: 'warning' },
      )
      return
    }
    setDialogIsOpen(false)
    doTask(
      camera,
      props.video,
      exportDir,
      ({
        path, status, log, exportDir, name,
      }) => {
        const temp = [...tempTasks.current]
        const existsIndex = temp.findIndex(item => item.path === path)
        if (existsIndex > -1) {
          temp.splice(existsIndex, 1, {
            name,
            path: filePath,
            exportDir,
            status,
            log: [log],
          })
        } else {
          temp.push({
            name,
            path: filePath,
            exportDir,
            status,
            log: [log],
          })
        }
        if (status === ExportStatusEnum.导出成功) {
          dispatchToast(
            <Toast>
              <ToastTitle>
                提示
              </ToastTitle>
              <ToastBody>
                {exportDir}/{name} 导出成功
              </ToastBody>
            </Toast>,
            { intent: 'success' },
          )
        }
        if (status === ExportStatusEnum.导出失败) {
          dispatchToast(
            <Toast>
              <ToastTitle>
                提示
              </ToastTitle>
              <ToastBody>
                {exportDir} 导出失败
              </ToastBody>
            </Toast>,
            { intent: 'error' },
          )
        }
        tempTasks.current = temp
        setTasks(temp)
      },
    )
    dispatchToast(
      <Toast>
        <ToastTitle>
          提示
        </ToastTitle>
        <ToastBody>
          导出任务已开始，请耐心等待
        </ToastBody>
      </Toast>,
      { intent: 'info' },
    )
  }
  return (
    <>
      {
        props.video ? (
          <>
            <Dialog
              modalType="modal"
              open={dialogIsOpen}
              onOpenChange={(_, data) => {
                if (data.type === 'backdropClick') {
                  setDialogIsOpen(data.open)
                }
              }}
            >
              <DialogTrigger>
                <Tooltip content={<>导出带有时间码的视频</>} relationship="label">
                  <Button
                    icon={<ResizeVideo24Filled />}
                    size="large"
                    onClick={() => setDialogIsOpen(true)}
                  />
                </Tooltip>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>导出视频</DialogTitle>
                  <DialogContent>
                    <Field label="相机视角">
                      <RadioGroup
                        layout="horizontal"
                        value={camera}
                        onChange={(_, data) => setCamera(data.value as CameraType)}
                      >
                        <Radio label="前" value="f" />
                        <Radio label="后" value="b" />
                        <Radio label="左" value="l" />
                        <Radio label="右" value="r" />
                      </RadioGroup>
                    </Field>
                    <Field label="导出文件目录">
                      <div className={styles.currentExportDir}>
                        当前选择：{exportDir}
                        <Button
                          appearance="transparent"
                          size="small"
                          onClick={() => selectExportDir()}
                        >选择目录
                        </Button>
                      </div>
                    </Field>
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button
                        appearance="primary"
                        onClick={() => onConfirm()}
                      >确认导出
                      </Button>
                    </DialogTrigger>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
            <Toaster toasterId={toasterId} />
          </>
        ) : null
      }
      {tasks.length > 0 ? <ExportTask tasks={tasks} /> : null}
    </>
  )
}

export default FfmpegExport
