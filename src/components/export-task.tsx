import React from 'react'
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  Badge,
  ProgressBar,
  DialogActions,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { TaskListSquareLtr24Regular, VideoClipMultiple24Regular } from '@fluentui/react-icons'
import { type ExportTaskType, ExportStatusEnum } from '../model'

interface ExportTaskProps {
  tasks?: ExportTaskType[]
}

const useStyles = makeStyles({
  root: {},
  badgeBox: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '0',
    left: '100%',
    transform: 'translate(-40%, -40%)',
  },
  task: {
    marginBottom: '10px',
  },
  taskItem: {
    fontSize: '12px',
    whiteSpace: 'break-spaces',
    wordBreak: 'break-all',
    display: 'flex',
    lineHeight: '24px',
    columnGap: '4px',
    alignItems: 'center',
  },
  taskIcon: {
    height: '24px',
    width: '24px',
    flexShrink: '0',
  },
  taskLog: {
    fontSize: '12px',
  },
  taskCompletedLog: {
    fontSize: '12px',
  },
  failTag: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    marginRight: '10px',
  },
  progressTag: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    marginRight: '10px',
  },
  completedTag: {
    backgroundColor: tokens.colorPaletteLightGreenBackground2,
    marginRight: '10px',
  },
})

const ExportTask: React.FC<ExportTaskProps> = (props) => {
  const styles = useStyles()
  const inProgressTask = props.tasks?.filter(item => item.status === ExportStatusEnum.进行中) ?? []
  return (
    <>
      <Dialog modalType="modal">
        <DialogTrigger>
          <div className={styles.badgeBox}>
            <Button
              icon={<TaskListSquareLtr24Regular />}
              size="large"
            />
            {
              inProgressTask.length > 0 ? (
                <Badge
                  appearance="filled"
                  className={styles.badge}
                  color="severe"
                >
                  {inProgressTask.length > 99 ? '99+' : inProgressTask.length}
                </Badge>
              ) : null
            }
          </div>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>任务列表</DialogTitle>
            <DialogContent>
              {
                props.tasks?.map(item => (
                  <div
                    className={styles.task}
                    key={item.path}
                  >
                    <div className={styles.taskItem}>
                      <VideoClipMultiple24Regular className={styles.taskIcon} />
                      {item.exportDir}/{item.name}
                    </div>
                    <div>
                      <Field
                        validationMessage={
                          item.status === ExportStatusEnum.进行中
                            ? `正在导出，请等待 ${Math.floor((100 * item.progress) / item.duration)}%`
                            : ExportStatusEnum[item.status] ?? ''
                        }
                        validationState="none"
                      >
                        <ProgressBar
                          color={item.status === ExportStatusEnum.导出成功 ? 'success' : 'brand'}
                          max={100}
                          shape="rounded"
                          value={item.status === ExportStatusEnum.导出成功 ? 100 : (100 * item.progress) / item.duration}
                        />
                      </Field>
                    </div>
                  </div>
                ))
              }
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">关闭</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

export default ExportTask
