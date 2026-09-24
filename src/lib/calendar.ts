import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'
import type { Task } from '../types'
import type { DayString } from './dates'
import { PRIORITY_RANK } from './priority'

/** Días visibles del mes: de lunes a domingo, solo las semanas necesarias (5 o 6). */
export function monthGrid(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })
}

const byPriorityThenCreated = (a: Task, b: Task) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.createdAt - b.createdAt

/** Tareas pendientes de un día, de prioridad alta a baja. */
export function tasksOnDay(tasks: Task[], day: DayString): Task[] {
  return tasks
    .filter((t) => t.date <= day && day <= (t.endDate ?? t.date))
    .sort(byPriorityThenCreated)
}

export const MAX_DOTS = 3

/** Puntos de un día: como mucho 3, de alta a baja, y si hay más, un "+". */
export function dotsFor(dayTasks: Task[]) {
  return {
    priorities: dayTasks.slice(0, MAX_DOTS).map((t) => t.priority),
    hasMore: dayTasks.length > MAX_DOTS,
  }
}
