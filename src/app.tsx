import { useState } from 'react'
import Player from './components/player'
import DirectoryAccess from './components/directory-access'
import cln from 'classnames'

import { TypeEnum, type OriginVideo, type ModelState } from './model'

import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
  MenuList,
  MenuItemRadio,
  Divider,
  tokens,
  Spinner,
} from '@fluentui/react-components'

import { Record24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  aside: {
    width: '350px',
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
  },
  menuItem: {
    ...shorthands.padding('6px'),
  },
  menuItemIsActive: {
    color: 'red',
  },
  content: {
    height: '100vh',
    ...shorthands.overflow('hidden', 'auto'),
    flexGrow: 1,
    backgroundColor: tokens.colorSubtleBackgroundHover,
  },
  header: {
    ...shorthands.padding('20px'),
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
  const [videoLoading, setVideoLoading] = useState(false)
  const [state, setState] = useState<ModelState>({
    type: TypeEnum.所有,
    list: [],
  })
  function onFileSystemAccess(videos: OriginVideo[]) {
    setState({
      ...state,
      list: videos,
    })
  }
  async function onSelectVideo(value: string) {
    if (state.current) {
      const {
        src_f, src_b, src_l, src_r,
      } = state.current
      URL.revokeObjectURL(src_f)
      URL.revokeObjectURL(src_b)
      URL.revokeObjectURL(src_l)
      URL.revokeObjectURL(src_r)
    }
    const origin = state.list.find(({ time }) => String(time) === value)
    if (!origin) return
    setVideoLoading(true)
    console.log(origin)
    try {
      setState({
        ...state,
        current: {
          ...origin,
          src_f: URL.createObjectURL(await origin.src_f.getFile()),
          src_b: URL.createObjectURL(await origin.src_b.getFile()),
          src_l: URL.createObjectURL(await origin.src_l.getFile()),
          src_r: URL.createObjectURL(await origin.src_r.getFile()),
        },
      })
    } finally {
      setVideoLoading(false)
    }
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
              <TabList selectedValue={filterType} onTabSelect={(_, data) => setFilterType(data.value as TypeEnum)}>
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
            <MenuList
              onCheckedValueChange={(_, data) => onSelectVideo(data.checkedItems[0])}
            >
              {
                videoList.map(({ title, time }) => (
                  <div className={cln(styles.menuItem, { [styles.menuItemIsActive]: true })} key={time}>
                    <MenuItemRadio icon={<Record24Regular />} name="video" value={String(time)}>{title}</MenuItemRadio>
                  </div>
                ))
              }
              {!videoList.length && <div className={styles.empty}>暂无数据</div>}
            </MenuList>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <DirectoryAccess onAccess={onFileSystemAccess} />
          </div>
          <div className={styles.player}>
            {
              videoLoading
                ? <Spinner appearance="primary" label="视频加载中" />
                : <Player key={state.current?.time} video={state.current} />
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
