import { useState, useEffect } from 'react'
import Player from './components/player'
import DirectoryAccess from './components/directory-access'
import FfmpegTerminal from './components/ffmpeg-terminal'
import cln from 'classnames'
import { TypeEnum, type ModelState, type OriginVideo } from './model'
import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
  Divider,
  tokens,
  Tooltip,
  Button,
  Caption1Stronger,
  Badge,
} from '@fluentui/react-components'
import {
  Record24Regular, Code24Filled, BookQuestionMark24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  aside: {
    width: '320px',
    height: '100vh',
    backgroundColor: tokens.colorNeutralStroke3,
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'column',
  },
  empty: {
    textAlign: 'center',
  },
  tabWrap: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('10px'),
    rowGap: '20px',
    flexShrink: 0,
  },
  menuWrap: {
    ...shorthands.padding('20px'),
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    rowGap: '14px',
    flexDirection: 'column',
  },
  menuItem: {
    ...shorthands.padding('6px', '16px'),
    ...shorthands.borderRadius('4px'),
    ...shorthands.transition('all', '120ms'),
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    columnGap: '12px',
    color: tokens.colorNeutralForeground1,
    ':hover': {
      color: tokens.colorCompoundBrandStrokePressed,
    },
  },
  menuItemIsActive: {
    color: tokens.colorPaletteRedBorderActive,
    ':hover': {
      color: tokens.colorPaletteRedBorderActive,
    },
  },
  content: {
    height: '100vh',
    ...shorthands.overflow('hidden', 'auto'),
    flexGrow: 1,
    backgroundColor: tokens.colorSubtleBackgroundHover,
  },
  header: {
    ...shorthands.padding('20px'),
    display: 'flex',
    ...shorthands.gap('10px'),
  },
  link: {
    color: 'inherit',
    '&:active': {
      color: 'inherit',
    },
  },
  player: {
    flexGrow: 1,
    minHeight: '1px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
})

const tabs = [
  {
    name: '所有',
    value: TypeEnum.所有,
  },
  {
    name: '事件',
    value: TypeEnum.事件,
  },
  {
    name: '哨兵',
    value: TypeEnum.哨兵,
  },
  {
    name: '记录仪',
    value: TypeEnum.行车记录仪,
  },
]

function App() {
  const styles = useStyles()
  const [filterType, setFilterType] = useState(TypeEnum.所有)
  const [state, setState] = useState<ModelState>({
    type: TypeEnum.所有,
    list: [],
    events: [],
  })
  useEffect(() => {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.code == 'Space') {
        e.preventDefault()
      }
    }
    return () => {
      document.onkeydown = null
    }
  }, [])
  function onFileSystemAccess(videos: OriginVideo[]) {
    setState({
      ...state,
      list: videos,
    })
  }
  async function onSelectVideo(value: number) {
    if (state.current) {
      const {
        src_f, src_b, src_l, src_r,
      } = state.current
      URL.revokeObjectURL(src_f)
      URL.revokeObjectURL(src_b)
      URL.revokeObjectURL(src_l)
      URL.revokeObjectURL(src_r)
    }
    const origin = state.list.find(({ time }) => time === value)
    if (!origin) return
    const [
      src_f_file,
      src_b_file,
      src_l_file,
      src_r_file,
    ] = [
      await origin.src_f.getFile(),
      await origin.src_b.getFile(),
      await origin.src_l.getFile(),
      await origin.src_r.getFile(),
    ]
    setState({
      ...state,
      current: {
        ...origin,
        src_f: URL.createObjectURL(src_f_file),
        src_f_name: src_f_file.name,
        src_b: URL.createObjectURL(src_b_file),
        src_b_name: src_b_file.name,
        src_l: URL.createObjectURL(src_l_file),
        src_l_name: src_l_file.name,
        src_r: URL.createObjectURL(src_r_file),
        src_r_name: src_r_file.name,
      },
    })
  }
  const videoList = state.list
    .filter(({ type }) => type === filterType || filterType === TypeEnum.所有)
    .sort((a, b) => b.time - a.time)
  return (
    <>
      <div className={styles.root}>
        <div className={styles.aside}>
          <div>
            <div className={styles.tabWrap}>
              <TabList
                selectedValue={filterType}
                onTabSelect={(_, data) => setFilterType(data.value as TypeEnum)}
              >
                {
                  tabs.map(({ name, value }) => (
                    <Tab key={value} value={value}>{name}</Tab>
                  ))
                }
              </TabList>
            </div>
            <Divider />
          </div>
          <div className={styles.menuWrap}>
            {
              videoList.map((item) => (
                <div
                  className={cln(styles.menuItem, { [styles.menuItemIsActive]: item.time === state.current?.time })}
                  key={item.time}
                  onClick={() => onSelectVideo(item.time)}
                  onKeyDown={(e) => {
                    e.preventDefault()
                  }}
                  onKeyUp={(e) => {
                    e.preventDefault()
                  }}
                >
                  <Record24Regular />
                  {item.title}
                  {item.event ? <Badge color="danger" size="extra-small" /> : null}
                </div>
              ))
            }
            {!videoList.length && <div className={styles.empty}>暂无数据</div>}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <DirectoryAccess onAccess={onFileSystemAccess} />
            <Tooltip
              content={<>查看源代码 (本项目<Caption1Stronger>不会上传</Caption1Stronger>您的隐私视频，并且接受公开的代码审查)</>}
              relationship="label"
            >
              <Button
                icon={
                  <a
                    className={styles.link}
                    href="https://github.com/Mario34/tesla-camera"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Code24Filled />
                  </a>
                }
                size="large"
              />
            </Tooltip>
            <Tooltip content={<>问题反馈</>} relationship="label">
              <Button
                icon={
                  <a
                    className={styles.link}
                    href="https://github.com/Mario34/tesla-camera/issues/new?assignees=Mario34&labels=&template=%E6%84%8F%E8%A7%81%E6%88%96%E5%8F%8D%E9%A6%88.md&title=%E6%84%8F%E8%A7%81%E6%88%96%E5%8F%8D%E9%A6%88"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <BookQuestionMark24Regular />
                  </a>
                }
                size="large"
              />
            </Tooltip>
            <FfmpegTerminal video={state.current} />
          </div>
          <div className={styles.player}>
            <Player key={state.current?.time} video={state.current} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
