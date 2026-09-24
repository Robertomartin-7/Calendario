import type { CalendarEvent } from '../types'

/** Evento destacado: tarjeta pastel propia, emoticono grande y sin círculo de completar. */
export function EventCard({ event, onOpen }: { event: CalendarEvent; onOpen: (e: CalendarEvent) => void }) {
  return (
    <button
      type="button" onClick={() => onOpen(event)}
      className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-event-deep/30 bg-event/70 p-3 text-left transition-transform duration-150 active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[28px] leading-none" aria-hidden>
        {event.emoji ?? '✦'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-[18px] font-semibold leading-snug text-ink">{event.name}</span>
        <span className="block text-xs text-ink-soft">Evento{event.repeatsYearly ? ' · cada año' : ''}</span>
      </span>
      <span className="pointer-events-none absolute right-3 top-1.5 text-xs tracking-widest text-event-deep" aria-hidden>✦ ✦</span>
    </button>
  )
}
