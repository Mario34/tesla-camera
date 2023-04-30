import React, { useRef, useEffect } from 'react'
import { makeStyles, tokens, shorthands } from '@fluentui/react-components'
import cls from 'classnames'
import { CameraEnum } from '../model'

interface MiniPlayProps {
  currentTime: number
  src: string
  camera: number
  isActive: boolean
  paused: boolean
  onClick: () => void
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    height: '120px',
    width: '160px',
    cursor: 'pointer',
    backgroundColor: tokens.colorSubtleBackgroundInvertedSelected,
    ...shorthands.borderRadius('6px'),
    ...shorthands.overflow('hidden'),
    '&.c0': {
      top: '30px',
      left: '30px',
    },
    '&.c1': {
      top: '30px',
      right: '30px',
    },
    '&.c2': {
      bottom: '30px',
      left: '30px',
    },
    '&.c3': {
      bottom: '30px',
      right: '30px',
    },
  },
  video: {
    height: '100%',
    width: '100%',
    '&.is-hidden': {
      opacity: 0,
    },
  },
  name: {
    position: 'absolute',
    bottom: '6px',
    left: '6px',
    color: tokens.colorNeutralBackground1Hover,
    fontWeight: '500',
  },
})

const MiniPlay: React.FC<MiniPlayProps> = (props) => {
  const styles = useStyles()
  const videoRef = useRef<HTMLVideoElement>(null)
  const playTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (!videoRef.current) return
    if (props.paused && !videoRef.current.paused) {
      videoRef.current.pause()
    }
    if (!props.paused && videoRef.current.paused) {
      videoRef.current.currentTime = props.currentTime
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current)
      }
      playTimerRef.current = setTimeout(() => {
        videoRef.current?.play()
        playTimerRef.current = null
      }, 200)
    }
  }, [props.paused])
  useEffect(() => {
    if (!videoRef.current) return
    if (props.paused) {
      videoRef.current.currentTime = props.currentTime
    }
  }, [props.currentTime])
  return (
    <div
      className={cls(styles.root, `c${props.camera}`)}
      onClick={props.onClick}
    >
      <span className={styles.name}>{CameraEnum[props.camera]}</span>
      <video
        muted
        className={cls(styles.video, { 'is-hidden': props.isActive })}
        ref={videoRef}
        src={props.src}
      >
        <source src={props.src} type="video/mp4" />
      </video>
    </div>
  )
}

MiniPlay.defaultProps = {
  currentTime: 0,
  camera: 0,
  isActive: false,
  paused: false,
}

export default MiniPlay
