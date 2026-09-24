import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '../types'
import { eventsOnDay, firstGrapheme } from './events'

const ev = (o: Partial<CalendarEvent>): CalendarEvent => ({
  id: 'e', name: 'Cumple de Ana', date: '2026-10-03', repeatsYearly: false, ...o,
})

describe('eventsOnDay', () => {
  it('un evento sin repetición solo sale su día', () => {
    const e = ev({})
    expect(eventsOnDay([e], '2026-10-03')).toHaveLength(1)
    expect(eventsOnDay([e], '2027-10-03')).toHaveLength(0)
    expect(eventsOnDay([e], '2026-10-04')).toHaveLength(0)
  })
  it('un evento anual sale cada año desde su fecha, no antes', () => {
    const e = ev({ repeatsYearly: true, emoji: '🎂' })
    expect(eventsOnDay([e], '2026-10-03')).toHaveLength(1)
    expect(eventsOnDay([e], '2031-10-03')).toHaveLength(1)
    expect(eventsOnDay([e], '2025-10-03')).toHaveLength(0)
    expect(eventsOnDay([e], '2027-10-04')).toHaveLength(0)
  })
  it('29 de febrero solo en años bisiestos', () => {
    const e = ev({ date: '2028-02-29', repeatsYearly: true })
    expect(eventsOnDay([e], '2032-02-29')).toHaveLength(1)
    expect(eventsOnDay([e], '2029-02-28')).toHaveLength(0)
  })
  it('ordena por nombre y admite nombres repetidos', () => {
    const list = [ev({ id: '1', name: 'Zoe' }), ev({ id: '2', name: 'Ana' }), ev({ id: '3', name: 'Ana' })]
    expect(eventsOnDay(list, '2026-10-03').map((e) => e.name)).toEqual(['Ana', 'Ana', 'Zoe'])
  })
})

describe('firstGrapheme', () => {
  it('conserva un emoji completo y recorta el resto', () => {
    expect(firstGrapheme('🎂🎉')).toBe('🎂')
    expect(firstGrapheme('👩🏽‍⚕️ hola')).toBe('👩🏽‍⚕️')
    expect(firstGrapheme('  ')).toBe('')
  })
})
