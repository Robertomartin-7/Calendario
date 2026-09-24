import type { DayString } from './lib/dates'

export type Priority = 'alta' | 'media' | 'baja'

export type Recurrence = {
  freq: 'diaria' | 'semanal' | 'mensual' | 'anual'
  interval: number
  until: DayString
}

export type Task = {
  id: string
  title: string
  description: string
  date: DayString
  endDate?: DayString
  priority: Priority
  recurrence: Recurrence | null
  skippedDates: DayString[]
  createdAt: number
}

/** Campos que edita la usuaria (el resto los pone la capa de datos). */
export type TaskInput = Pick<Task, 'title' | 'description' | 'date' | 'priority' | 'recurrence'> & {
  endDate?: DayString
}
