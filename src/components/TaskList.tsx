import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { fromDay, type DayString } from '../lib/dates'
import type { CalendarEvent, Task } from '../types'
import { EventCard } from './EventCard'
import { TaskRow } from './TaskRow'

type Props = {
  day: DayString
  isToday: boolean
  tasks: Task[]
  events: CalendarEvent[]
  onOpenEvent: (e: CalendarEvent) => void
  onAdd: () => void
  onOpen: (t: Task) => void
  onComplete: (t: Task) => void
}

export function NewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-ink transition-opacity duration-150 active:opacity-60"
    >
      <span className="text-xl leading-none" aria-hidden>+</span> Nueva
    </button>
  )
}

export function TaskList({ day, isToday, tasks, events, onOpenEvent, onAdd, onOpen, onComplete }: Props) {
  const count = tasks.length + events.length
  const unit = events.length > 0 ? (count === 1 ? 'elemento' : 'elementos') : count === 1 ? 'tarea' : 'tareas'
  const rawLabel = format(fromDay(day), "EEEE d 'de' MMMM", { locale: es })
  const dayLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)

  return (
    <section aria-label="Por terminar">
      <div className="flex items-baseline justify-between gap-3 px-1 pb-3">
        <div>
          <h2 className="flex items-baseline gap-2 whitespace-nowrap font-serif text-2xl font-semibold text-ink">
            Por terminar
            <span className="font-sans text-sm font-normal text-ink-soft">{count} {unit}</span>
          </h2>
          {!isToday && <p className="text-sm text-ink-soft">{dayLabel}</p>}
        </div>
        <NewButton onClick={onAdd} />
      </div>

      <div className="flex flex-col gap-3">
        {events.map((e) => <EventCard key={e.id} event={e} onOpen={onOpenEvent} />)}

        {count === 0 && (
          <p className="rounded-card bg-card px-2 py-8 text-center text-ink-soft shadow-[0_1px_0_var(--color-line)]">
            {isToday ? 'Nada pendiente hoy. ¡Respira!' : 'Nada pendiente este día.'}
          </p>
        )}

        {tasks.length > 0 && (
          <div className="rounded-card bg-card px-3 py-1 shadow-[0_1px_0_var(--color-line)]">
            {tasks.map((t) => <TaskRow key={t.id} task={t} onOpen={onOpen} onComplete={onComplete} />)}
          </div>
        )}
      </div>
    </section>
  )
}
