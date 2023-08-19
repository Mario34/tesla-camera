import { useRef } from 'react'

export function useDelayPlay() {
  const playTimerRef = useRef<NodeJS.Timer | null>(null)

  function delayPlay(videoRef: HTMLVideoElement) {
    videoRef.pause()
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current)
    }
    playTimerRef.current = setTimeout(() => {
      videoRef.play()
      playTimerRef.current = null
    }, 200)
  }

  return { delayPlay }
}

export function durationToMs(duration: string): number {
  const [hour, minute, second] = duration.split(':').map(str => +str)
  return (hour * 3600 + minute * 60 + second) * 1000
}
