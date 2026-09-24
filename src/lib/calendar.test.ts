import { describe, expect, it } from 'vitest'
import type { Task } from '../types'
import { dotsFor, monthGrid, tasksOnDay } from './calendar'
import { fromDay, toDay } from './dates'

const task = (o: Partial<Task>): Task => ({
  id: 'x', title: 't', description: '', date: '2026-09-23', priority: 'media',
  recurrence: null, skippedDates: [], createdAt: 1, ...o,
})

describe('monthGrid', () => {
  it('septiembre 2026: 5 semanas de lunes 31 ago a domingo 4 oct', () => {
    const g = monthGrid(fromDay('2026-09-10'))
    expect(g).toHaveLength(35)
    expect(toDay(g[0])).toBe('2026-08-31')
    expect(toDay(g[34])).toBe('2026-10-04')
  })
  it('agosto 2026 necesita 6 semanas', () => {
    expect(monthGrid(fromDay('2026-08-01'))).toHaveLength(42)
  })
  it('febrero 2027 (empieza en lunes, 28 días) cabe en 4 semanas', () => {
    expect(monthGrid(fromDay('2027-02-01'))).toHaveLength(28)
  })
})

describe('tasksOnDay', () => {
  it('filtra por día y ordena de alta a baja', () => {
    const list = [
      task({ id: 'a', priority: 'baja' }),
      task({ id: 'b', priority: 'alta', createdAt: 2 }),
      task({ id: 'c', priority: 'media' }),
      task({ id: 'd', date: '2026-09-24' }),
    ]
    expect(tasksOnDay(list, '2026-09-23').map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })
  it('permite títulos repetidos', () => {
    const list = [task({ id: '1', title: 'Igual' }), task({ id: '2', title: 'Igual' })]
    expect(tasksOnDay(list, '2026-09-23')).toHaveLength(2)
  })
  it('una tarea con fecha final aparece en todos sus días', () => {
    const t = task({ date: '2026-09-22', endDate: '2026-09-24' })
    expect(tasksOnDay([t], '2026-09-21')).toHaveLength(0)
    expect(tasksOnDay([t], '2026-09-23')).toHaveLength(1)
    expect(tasksOnDay([t], '2026-09-24')).toHaveLength(1)
    expect(tasksOnDay([t], '2026-09-25')).toHaveLength(0)
  })
  it('las atrasadas se quedan en su día', () => {
    const t = task({ date: '2026-09-01' })
    expect(tasksOnDay([t], '2026-09-23')).toHaveLength(0)
    expect(tasksOnDay([t], '2026-09-01')).toHaveLength(1)
  })
})

describe('dotsFor', () => {
  it('máximo 3 puntos y "+" si hay más', () => {
    const ts = ['alta', 'alta', 'media', 'baja'].map((p) => task({ priority: p as Task['priority'] }))
    expect(dotsFor(ts)).toEqual({ priorities: ['alta', 'alta', 'media'], hasMore: true })
    expect(dotsFor(ts.slice(0, 3)).hasMore).toBe(false)
    expect(dotsFor([])).toEqual({ priorities: [], hasMore: false })
  })
})
