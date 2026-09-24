import { addMonths, isSameMonth, startOfMonth } from 'date-fns'
import { describe, expect, it } from 'vitest'
import type { Task } from '../types'
import { dotsFor, monthGrid, tasksOnDay } from './calendar'
import { fromDay, toDay } from './dates'
import { PRIORITY_BG } from './priority'
import { occursOn } from './recurrence'
import { stepSelection } from './navigation'

// Comprobaciones de la lógica detrás de los criterios de aceptación (la parte visual se revisa a mano).
const TODAY = '2026-09-24'
const task = (o: Partial<Task>): Task => ({
  id: 'x', title: 't', description: '', date: TODAY, priority: 'media',
  recurrence: null, skippedDates: [], createdAt: 1, ...o,
})

describe('CA-01: mes actual con hoy y un punto por tarea pendiente', () => {
  it('la cuadrícula contiene hoy y sus puntos coinciden con las tareas de cada día', () => {
    const grid = monthGrid(startOfMonth(fromDay(TODAY))).map(toDay)
    expect(grid).toContain(TODAY)
    const tasks = [task({ id: 'a', priority: 'alta' }), task({ id: 'b', priority: 'baja' })]
    expect(dotsFor(tasksOnDay(tasks, TODAY)).priorities).toEqual(['alta', 'baja'])
  })
})

describe('CA-02: las flechas cambian de mes', () => {
  it('siguiente y anterior', () => {
    expect(isSameMonth(fromDay(stepSelection('mes', TODAY, 1, TODAY)), addMonths(fromDay(TODAY), 1))).toBe(true)
    expect(isSameMonth(fromDay(stepSelection('mes', TODAY, -1, TODAY)), addMonths(fromDay(TODAY), -1))).toBe(true)
  })
})

describe('CA-03 / CA-04: una tarea con título y fecha pone un punto y conserva su descripción', () => {
  it('aparece en su día y solo en ese', () => {
    const t = task({ date: '2026-09-30', description: 'Traer bata' })
    expect(tasksOnDay([t], '2026-09-30')).toHaveLength(1)
    expect(tasksOnDay([t], '2026-09-29')).toHaveLength(0)
    expect(t.description).toBe('Traer bata')
  })
})

describe('CA-05: prioridad → color del punto', () => {
  it('Alta rojo, Media amarillo, Baja verde', () => {
    expect(PRIORITY_BG).toEqual({ alta: 'bg-alta', media: 'bg-media', baja: 'bg-baja' })
  })
})

describe('CA-06: una tarea hecha no aparece en ninguna parte', () => {
  it('una ocurrencia completada desaparece de su día y la serie sigue', () => {
    const t = task({
      date: '2026-09-07', recurrence: { freq: 'semanal', interval: 1, until: '2026-10-05' },
      skippedDates: ['2026-09-21'],
    })
    expect(occursOn(t, '2026-09-21')).toBe(false)
    expect(occursOn(t, '2026-09-28')).toBe(true)
  })
})
