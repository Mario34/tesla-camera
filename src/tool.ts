import { useRef } from 'react'

export function useDelayPlay() {
  const playTimerRef = useRef<number | null>(null)

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
