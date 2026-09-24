import {
  addDays, addMonths, eachDayOfInterval, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { fromDay, monthName, toDay, type DayString } from './dates'

export type View = 'dia' | 'semana' | 'mes'

/** Los 7 días (lunes a domingo) de la semana del día dado. */
export function weekDays(day: DayString): Date[] {
  const d = fromDay(day)
  return eachDayOfInterval({
    start: startOfWeek(d, { weekStartsOn: 1 }),
    end: endOfWeek(d, { weekStartsOn: 1 }),
  })
}

/** Día seleccionado al cambiar de mes: hoy si es el mes actual; si no, el día 1. */
export function selectionForMonth(month: Date, today: DayString): DayString {
  return isSameMonth(month, fromDay(today)) ? today : toDay(startOfMonth(month))
}

/** Anterior (-1) o siguiente (1) según la vista: un día, una semana o un mes. */
export function stepSelection(view: View, selected: DayString, dir: 1 | -1, today: DayString): DayString {
  const d = fromDay(selected)
  if (view === 'dia') return toDay(addDays(d, dir))
  if (view === 'semana') return toDay(addDays(d, 7 * dir))
  return selectionForMonth(addMonths(startOfMonth(d), dir), today)
}

const STEP_LABEL: Record<View, [string, string]> = {
  dia: ['Día anterior', 'Día siguiente'],
  semana: ['Semana anterior', 'Semana siguiente'],
  mes: ['Mes anterior', 'Mes siguiente'],
}
export const stepLabels = (view: View) => STEP_LABEL[view]

/** Título de la cabecera: parte principal y año (en tono más claro). */
export function viewTitle(view: View, selected: DayString): { main: string; year: string } {
  const d = fromDay(selected)
  if (view === 'mes') return { main: monthName(d), year: String(d.getFullYear()) }
  if (view === 'dia') return { main: format(d, "d 'de' MMMM", { locale: es }), year: String(d.getFullYear()) }
  const days = weekDays(selected)
  const first = days[0]
  const last = days[6]
  const main = isSameMonth(first, last)
    ? `${first.getDate()} – ${format(last, 'd MMM', { locale: es })}`
    : `${format(first, 'd MMM', { locale: es })} – ${format(last, 'd MMM', { locale: es })}`
  return { main, year: String(first.getFullYear()) }
}
