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
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { TaskListSquareLtr24Regular } from '@fluentui/react-icons'
import { Tag } from '@fluentui/react-tags-preview'
import { type ExportTaskType, ExportStatusEnum } from '../model'
import cln from 'classnames'

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
                      <Tag
                        className={cln({
                          [styles.progressTag]: item.status === ExportStatusEnum.进行中,
                          [styles.completedTag]: item.status === ExportStatusEnum.导出成功,
                          [styles.failTag]: item.status === ExportStatusEnum.导出失败,
                        })}
                        size="small"
                      >{ExportStatusEnum[item.status]}
                      </Tag>
                      {item.exportDir}/{item.name}
                    </div>
                  </div>
                ))
              }
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

export default ExportTask
