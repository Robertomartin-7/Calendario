import { useState, type FormEvent, type ReactNode } from 'react'
import { firstGrapheme } from '../lib/events'
import type { DayString } from '../lib/dates'
import type { CalendarEvent, EventInput } from '../types'
import { Sheet } from './Sheet'

const SUGGESTIONS = ['🎂', '🎉', '🎓', '📚', '🦷', '❤️']

type Props = {
  event?: CalendarEvent
  defaultDate: DayString
  onClose: () => void
  onSave: (input: EventInput) => void
  onDelete?: () => void
  switcher?: ReactNode
}

export function EventSheet({ event, defaultDate, onClose, onSave, onDelete, switcher }: Props) {
  const [name, setName] = useState(event?.name ?? '')
  const [date, setDate] = useState(event?.date ?? defaultDate)
  const [yearly, setYearly] = useState(event?.repeatsYearly ?? false)
  const [emoji, setEmoji] = useState(event?.emoji ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canSave = name.trim() !== '' && date !== ''

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!canSave) return
    onSave({ name: name.trim(), date, repeatsYearly: yearly, emoji: emoji || undefined })
  }

  return (
    <Sheet
      label={event ? 'Editar evento' : 'Nuevo evento'} onClose={onClose} onSubmit={submit}
      header={switcher ?? <h2 className="font-serif text-2xl font-semibold text-ink">Evento</h2>}
    >
      <input
        autoFocus value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Ej.: Cumple de Ana" aria-label="Nombre" maxLength={80}
        className="min-h-12 rounded-2xl border border-line bg-bg px-4"
      />

      <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
        Fecha
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)} required
          className="min-h-11 rounded-2xl border border-line bg-bg px-3 text-ink"
        />
      </label>

      <label className="flex min-h-11 items-center justify-between gap-3 text-[15px] text-ink">
        Se repite cada año
        <button
          type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((v) => !v)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${yearly ? 'bg-baja' : 'bg-line'}`}
        >
          <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${yearly ? 'translate-x-6' : ''}`} />
        </button>
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm text-ink-soft">
          Emoticono (opcional)
          <input
            value={emoji} onChange={(e) => setEmoji(firstGrapheme(e.target.value))}
            placeholder="🙂" aria-label="Emoticono"
            className="min-h-11 w-20 rounded-2xl border border-line bg-bg px-3 text-center text-2xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s} type="button" onClick={() => setEmoji(emoji === s ? '' : s)} aria-label={`Emoticono ${s}`}
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl transition-colors duration-150 ${
                emoji === s ? 'border-transparent bg-event' : 'border-line'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        {event && onDelete && (
          confirmDelete ? (
            <span className="flex items-center gap-2 text-sm">
              ¿Borrar evento?
              <button type="button" onClick={onDelete} className="rounded-full bg-alta px-4 font-medium text-ink">Sí</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full border border-line px-4">No</button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-full px-3 text-sm text-ink-soft">
              Borrar
            </button>
          )
        )}
        <button
          type="submit" disabled={!canSave}
          className="ml-auto rounded-full bg-ink px-7 font-medium text-white transition-opacity duration-150 disabled:opacity-40"
        >
          Guardar
        </button>
      </div>
    </Sheet>
  )
}
