import { describe, expect, it } from 'vitest'
import type { Recurrence, Task } from '../types'
import { fromDay, toDay } from './dates'
import { occursOn } from './recurrence'
import { eachDayOfInterval } from 'date-fns'

const task = (date: string, recurrence: Recurrence | null, o: Partial<Task> = {}): Task => ({
  id: 'x', title: 't', description: '', date, priority: 'media',
  recurrence, skippedDates: [], createdAt: 1, ...o,
})

const days = (t: Task, from: string, to: string) =>
  eachDayOfInterval({ start: fromDay(from), end: fromDay(to) }).map(toDay).filter((d) => occursOn(t, d))

describe('sin repetición', () => {
  it('un solo día', () => {
    const t = task('2026-09-23', null)
    expect(days(t, '2026-09-20', '2026-09-26')).toEqual(['2026-09-23'])
  })
  it('varios días: todos, inclusive', () => {
    const t = task('2026-09-22', null, { endDate: '2026-09-24' })
    expect(days(t, '2026-09-20', '2026-09-26')).toEqual(['2026-09-22', '2026-09-23', '2026-09-24'])
  })
})

describe('semanal (CA-07)', () => {
  const t = task('2026-09-07', { freq: 'semanal', interval: 1, until: '2026-10-05' })
  it('aparece cada semana entre inicio y fin, y no fuera', () => {
    expect(days(t, '2026-08-01', '2026-11-30')).toEqual([
      '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28', '2026-10-05',
    ])
  })
  it('cada 2 semanas', () => {
    const t2 = task('2026-09-07', { freq: 'semanal', interval: 2, until: '2026-10-31' })
    expect(days(t2, '2026-09-01', '2026-11-30')).toEqual(['2026-09-07', '2026-09-21', '2026-10-05', '2026-10-19'])
  })
})

describe('diaria', () => {
  it('cada 3 días, con fin inclusivo', () => {
    const t = task('2026-09-01', { freq: 'diaria', interval: 3, until: '2026-09-10' })
    expect(days(t, '2026-08-25', '2026-09-30')).toEqual(['2026-09-01', '2026-09-04', '2026-09-07', '2026-09-10'])
  })
  it('cruza el cambio de hora sin desfases', () => {
    const t = task('2026-10-24', { freq: 'diaria', interval: 1, until: '2026-10-27' })
    expect(days(t, '2026-10-20', '2026-10-30')).toEqual(['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27'])
  })
})

describe('mensual', () => {
  it('mismo día del mes; el 31 salta los meses que no lo tienen', () => {
    const t = task('2026-01-31', { freq: 'mensual', interval: 1, until: '2026-06-30' })
    expect(days(t, '2026-01-01', '2026-12-31')).toEqual(['2026-01-31', '2026-03-31', '2026-05-31'])
  })
  it('cada 2 meses', () => {
    const t = task('2026-01-15', { freq: 'mensual', interval: 2, until: '2026-12-31' })
    expect(days(t, '2026-01-01', '2026-12-31')).toEqual([
      '2026-01-15', '2026-03-15', '2026-05-15', '2026-07-15', '2026-09-15', '2026-11-15',
    ])
  })
})

describe('anual', () => {
  it('cada año en la misma fecha', () => {
    const t = task('2026-03-10', { freq: 'anual', interval: 1, until: '2028-12-31' })
    expect(days(t, '2026-01-01', '2029-12-31')).toEqual(['2026-03-10', '2027-03-10', '2028-03-10'])
  })
  it('29 de febrero solo en bisiestos', () => {
    const t = task('2028-02-29', { freq: 'anual', interval: 1, until: '2036-12-31' })
    expect(days(t, '2028-01-01', '2036-12-31')).toEqual(['2028-02-29', '2032-02-29', '2036-02-29'])
  })
})

describe('ocurrencias completadas', () => {
  it('skippedDates quita solo esa ocurrencia y la serie continúa', () => {
    const t = task('2026-09-07', { freq: 'semanal', interval: 1, until: '2026-09-28' }, { skippedDates: ['2026-09-14'] })
    expect(days(t, '2026-09-01', '2026-09-30')).toEqual(['2026-09-07', '2026-09-21', '2026-09-28'])
  })
})
