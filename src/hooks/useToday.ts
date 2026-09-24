import { useEffect, useState } from 'react'
import { todayString } from '../lib/dates'

/** "Hoy" siempre al día: se actualiza a medianoche y al volver a la app (la PWA puede quedar abierta días). */
export function useToday() {
  const [today, setToday] = useState(todayString)

  useEffect(() => {
    const refresh = () => setToday(todayString())
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = setTimeout(() => { refresh(); schedule() }, nextMidnight.getTime() - now.getTime())
    }
    schedule()
    const onVisible = () => document.visibilityState === 'visible' && refresh()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', refresh)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return today
}
