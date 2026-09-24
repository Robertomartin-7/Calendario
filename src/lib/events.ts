import { getDate, getMonth } from 'date-fns'
import type { CalendarEvent } from '../types'
import { fromDay, type DayString } from './dates'

/** Eventos de un día. Los anuales se repiten cada año desde su fecha (29 feb: solo en bisiestos). */
export function eventsOnDay(events: CalendarEvent[], day: DayString): CalendarEvent[] {
  return events
    .filter((e) => {
      if (!e.repeatsYearly) return e.date === day
      if (day < e.date) return false
      const start = fromDay(e.date)
      const d = fromDay(day)
      return getDate(d) === getDate(start) && getMonth(d) === getMonth(start)
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/** Solo el primer carácter visible (emoji con modificadores incluido). */
export function firstGrapheme(text: string): string {
  const t = text.trim()
  if (!t) return ''
  const seg = new Intl.Segmenter('es', { granularity: 'grapheme' })
  return [...seg.segment(t)][0]?.segment ?? ''
}
