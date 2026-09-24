import { useEffect, useState } from 'react'
import { subscribeEvents } from '../firebase/db'
import type { CalendarEvent } from '../types'

export function useEvents(uid: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(
    () => subscribeEvents(uid, setEvents, () => setError('No se pudieron cargar los eventos.')),
    [uid],
  )
  return { events, error }
}
