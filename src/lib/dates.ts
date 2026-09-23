import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

/** Los días se guardan como "YYYY-MM-DD", sin hora ni zona horaria. */
export type DayString = string

export const toDay = (d: Date): DayString => format(d, 'yyyy-MM-dd')
export const fromDay = (s: DayString): Date => parse(s, 'yyyy-MM-dd', new Date(2000, 0, 1))
export const todayString = (): DayString => toDay(new Date())

/** "Septiembre" con la primera en mayúscula (date-fns da minúsculas en es). */
export const monthName = (d: Date): string => {
  const m = format(d, 'LLLL', { locale: es })
  return m.charAt(0).toUpperCase() + m.slice(1)
}
