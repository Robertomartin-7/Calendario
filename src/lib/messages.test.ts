import { describe, expect, it } from 'vitest'
import { addDays } from 'date-fns'
import { fromDay, toDay } from './dates'
import { MESSAGES, iconForDay, messageForDay } from './messages'

describe('mensajes motivacionales', () => {
  it('no hay mensajes vacíos ni repetidos', () => {
    expect(MESSAGES.every((m) => m.trim().length > 0)).toBe(true)
    expect(new Set(MESSAGES).size).toBe(MESSAGES.length)
  })
  it('un mismo día siempre da el mismo mensaje', () => {
    expect(messageForDay('2026-09-24')).toBe(messageForDay('2026-09-24'))
  })
  it('días seguidos nunca repiten mensaje, durante años', () => {
    let d = fromDay('2025-01-01')
    for (let i = 0; i < 1500; i++) {
      const next = addDays(d, 1)
      expect(messageForDay(toDay(d))).not.toBe(messageForDay(toDay(next)))
      d = next
    }
  })
  it('funciona con fechas anteriores al año 2000', () => {
    expect(MESSAGES).toContain(messageForDay('1990-05-05'))
    expect([0, 1, 2]).toContain(iconForDay('1990-05-05'))
  })
})
