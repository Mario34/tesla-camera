import React, { useState, useRef } from 'react'
import {
  makeStyles,
  shorthands,
  tokens,
  Slider,
} from '@fluentui/react-components'
import { Pause24Filled, Play24Filled } from '@fluentui/react-icons'
import MiniPlay from './mini-player'
import dayjs from 'dayjs'
import { useDelayPlay } from '../tool'

import { type Video, CameraEnum } from '../model'

const useStyles = makeStyles({
  root: {
    ...shorthands.padding(0, '20px'),
  },
  videoWrap: {
    position: 'relative',
  },
  video: {
    width: '1000px',
    height: '750px',
    backgroundColor: tokens.colorNeutralForegroundDisabled,
  },
  time: {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    minWidth: '280px',
    color: tokens.colorNeutralBackground1Hover,
    fontSize: '18px',
    fontWeight: 500,
    ...shorthands.padding('4px', '8px'),
    letterSpacing: '2px',
    backgroundColor: tokens.colorNeutralStencil1Alpha,
    ...shorthands.borderRadius('2px'),
  },
  controlWrap: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
  },
  slider: {
    width: '100%',
  },
  sliderTime: {
    minWidth: '40px',
    textAlign: 'center',
  },
  iconButton: {
    cursor: 'pointer',
    ':active': {
      color: tokens.colorNeutralForeground2,
    },
  },
  empty: {

  },
})

interface PlayerProps {
  video?: Video
}

function getSrc(camera: CameraEnum, video: Video): string {
  switch (camera) {
    case CameraEnum.前:
      return video.src_f
    case CameraEnum.后:
      return video.src_b
    case CameraEnum.左:
      return video.src_l
    case CameraEnum.右:
      return video.src_r
  }
}

function fmtTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.ceil(time % 60)
  return `${minutes}:${seconds}`
}

const Player: React.FC<React.PropsWithChildren<PlayerProps>> = (props) => {
  const styles = useStyles()
  const [currentCamera, setCurrentCamera] = useState(CameraEnum.前)
  const [currentTime, setCurrentTime] = useState(CameraEnum.前)
  const [paused, setPaused] = useState(true)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { delayPlay } = useDelayPlay()
  function onTimeupdate() {
    if (!videoRef.current) return
    if (videoRef.current.currentTime >= videoRef.current.duration) {
      setCurrentTime(0)
      videoRef.current.pause()
    } else {
      setCurrentTime(videoRef.current.currentTime)
    }
  }
  function play() {
    if (!videoRef.current) return
    videoRef.current.play()
    setPaused(false)
  }
  function pause() {
    if (!videoRef.current) return
    videoRef.current.pause()
    setPaused(true)
  }
  function onLoadedMetadata() {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }
  function onSeek(val: number) {
    if (!videoRef.current) return
    const prePaused = videoRef.current.paused
    videoRef.current.pause()
    setCurrentTime(val)
    videoRef.current.currentTime = val
    if (!prePaused) {
      delayPlay(videoRef.current)
    }
  }
  function onSelectCamera(val: CameraEnum, video: Video) {
    if (!videoRef.current) return
    setCurrentCamera(val)
    const prePaused = videoRef.current.paused
    videoRef.current.pause()
    videoRef.current.src = getSrc(val, video)
    videoRef.current.currentTime = currentTime
    if (!prePaused) {
      delayPlay(videoRef.current)
    }
  }
  return (
    <div className={styles.root}>
      {
        props.video ? (
          <>
            <div className={styles.videoWrap}>
              <video
                muted
                className={styles.video}
                ref={videoRef}
                onLoadedMetadata={onLoadedMetadata}
                onPause={() => setPaused(true)}
                onPlay={() => setPaused(false)}
                onTimeUpdate={onTimeupdate}
              >
                <source src={getSrc(currentCamera, props.video)} type="video/mp4" />
              </video>
              {
                [CameraEnum.前, CameraEnum.后, CameraEnum.左, CameraEnum.右].map(camera => (
                  <MiniPlay
                    camera={camera}
                    currentTime={currentTime}
                    isActive={currentCamera === camera}
                    key={camera}
                    paused={paused}
                    src={getSrc(camera, props.video!)}
                    onClick={() => onSelectCamera(camera, props.video!)}
                  />
                ))
              }
              <div className={styles.time}>
                {dayjs(props.video.time + currentTime * 1000).format('YYYY年MM月DD日 HH:mm:ss')}
              </div>
            </div>
            <div className={styles.controlWrap}>
              {
                paused
                  ? <Play24Filled
                      className={styles.iconButton}
                      onClick={play}
                    />
                  : <Pause24Filled
                      className={styles.iconButton}
                      onClick={pause}
                    />
              }
              <div className={styles.sliderTime}>{fmtTime(currentTime)}</div>
              <Slider
                className={styles.slider}
                max={duration}
                min={0}
                value={currentTime}
                onChange={(_, data) => onSeek(data.value)}
              />
              <div className={styles.sliderTime}>{fmtTime(duration)}</div>
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            暂无数据
          </div>
        )
      }

    </div>
  )
}

Player.defaultProps = {

}

export default Player
