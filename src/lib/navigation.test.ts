import { describe, expect, it } from 'vitest'
import { toDay } from './dates'
import { selectionForMonth, stepSelection, viewTitle, weekDays } from './navigation'
import { fromDay } from './dates'

const TODAY = '2026-09-24'

describe('weekDays', () => {
  it('lunes a domingo, incluso si el día es domingo', () => {
    expect(weekDays('2026-09-24').map(toDay)).toEqual([
      '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27',
    ])
    expect(toDay(weekDays('2026-09-27')[0])).toBe('2026-09-21')
    expect(toDay(weekDays('2026-09-28')[0])).toBe('2026-09-28')
  })
})

describe('stepSelection', () => {
  it('día: ±1, cruzando de mes', () => {
    expect(stepSelection('dia', '2026-09-30', 1, TODAY)).toBe('2026-10-01')
    expect(stepSelection('dia', '2026-10-01', -1, TODAY)).toBe('2026-09-30')
  })
  it('semana: ±7', () => {
    expect(stepSelection('semana', '2026-09-24', 1, TODAY)).toBe('2026-10-01')
    expect(stepSelection('semana', '2026-09-24', -1, TODAY)).toBe('2026-09-17')
  })
  it('mes: el día 1 del otro mes, y hoy si vuelve al mes actual', () => {
    expect(stepSelection('mes', '2026-09-24', 1, TODAY)).toBe('2026-10-01')
    expect(stepSelection('mes', '2026-10-01', -1, TODAY)).toBe(TODAY)
    expect(stepSelection('mes', '2026-01-15', -1, TODAY)).toBe('2025-12-01')
  })
})

describe('selectionForMonth', () => {
  it('hoy en el mes actual', () => {
    expect(selectionForMonth(fromDay('2026-09-01'), TODAY)).toBe(TODAY)
    expect(selectionForMonth(fromDay('2027-03-15'), TODAY)).toBe('2027-03-01')
  })
})

describe('viewTitle', () => {
  it('mes', () => expect(viewTitle('mes', TODAY)).toEqual({ main: 'Septiembre', year: '2026' }))
  it('día', () => expect(viewTitle('dia', '2026-05-15')).toEqual({ main: '15 de mayo', year: '2026' }))
  it('semana en un mismo mes', () => expect(viewTitle('semana', TODAY).main).toMatch(/^21 – 27 sep/))
  it('semana entre dos meses', () => {
    const t = viewTitle('semana', '2026-09-30')
    expect(t.main).toContain('28 sep')
    expect(t.main).toContain('4 oct')
  })
})
