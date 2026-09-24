import { useRef, type TouchEvent } from 'react'

/** Deslizar en horizontal: izquierda → onLeft, derecha → onRight. */
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  return {
    onTouchStart: (e: TouchEvent) => {
      const t = e.touches[0]
      start.current = { x: t.clientX, y: t.clientY }
    },
    onTouchEnd: (e: TouchEvent) => {
      const s = start.current
      start.current = null
      if (!s) return
      const t = e.changedTouches[0]
      const dx = t.clientX - s.x
      const dy = t.clientY - s.y
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
      if (dx < 0) onLeft()
      else onRight()
    },
  }
}
