import { differenceInCalendarDays, differenceInCalendarMonths, getDate, getMonth } from 'date-fns'
import type { Task } from '../types'
import { fromDay, type DayString } from './dates'

/**
 * ¿La tarea está pendiente ese día? Las repeticiones se calculan al vuelo desde la regla:
 * - Sin repetición: cubre de `date` a `endDate` (o solo `date`).
 * - Con repetición: desde `date` hasta `until` (inclusive), cada `interval` unidades,
 *   salvo las fechas de `skippedDates` (ocurrencias ya completadas).
 *   Mensual y anual conservan el día del mes del inicio: si un mes no lo tiene (p. ej. el 31), se salta.
 */
export function occursOn(task: Task, day: DayString): boolean {
  const r = task.recurrence
  if (!r) return task.date <= day && day <= (task.endDate ?? task.date)
  if (day < task.date || day > r.until || task.skippedDates.includes(day)) return false

  const start = fromDay(task.date)
  const d = fromDay(day)
  const n = Math.max(1, Math.floor(r.interval))
  switch (r.freq) {
    case 'diaria':
      return differenceInCalendarDays(d, start) % n === 0
    case 'semanal':
      return differenceInCalendarDays(d, start) % (7 * n) === 0
    case 'mensual':
      return getDate(d) === getDate(start) && differenceInCalendarMonths(d, start) % n === 0
    case 'anual':
      return (
        getDate(d) === getDate(start) &&
        getMonth(d) === getMonth(start) &&
        (d.getFullYear() - start.getFullYear()) % n === 0
      )
  }
}
