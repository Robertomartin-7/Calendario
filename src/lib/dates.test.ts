import { describe, expect, it } from 'vitest'
import { fromDay, monthName, toDay } from './dates'

describe('dates', () => {
  it('ida y vuelta sin desfase de zona horaria', () => {
    expect(toDay(fromDay('2026-03-29'))).toBe('2026-03-29')
    expect(toDay(fromDay('2026-10-25'))).toBe('2026-10-25')
  })
  it('mes en español con mayúscula', () => {
    expect(monthName(fromDay('2026-09-23'))).toBe('Septiembre')
  })
})
