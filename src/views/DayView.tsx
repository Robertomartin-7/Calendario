import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EventCard } from '../components/EventCard'
import { TaskRow } from '../components/TaskRow'
import { NewButton } from '../components/TaskList'
import { fromDay, type DayString } from '../lib/dates'
import type { CalendarEvent, Task } from '../types'

type Props = {
  day: DayString
  isToday: boolean
  tasks: Task[]
  events: CalendarEvent[]
  onAdd: () => void
  onOpen: (t: Task) => void
  onOpenEvent: (e: CalendarEvent) => void
  onComplete: (t: Task) => void
}

/** Vista Día: todas las tareas en grande, con título y descripción, y los eventos destacados. */
export function DayView({ day, isToday, tasks, events, onAdd, onOpen, onOpenEvent, onComplete }: Props) {
  const weekday = format(fromDay(day), 'EEEE', { locale: es })
  return (
    <section className="mx-auto w-full max-w-2xl" aria-label="Día">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
          {isToday && <span className="ml-2 font-sans text-sm font-normal text-ink-soft">Hoy</span>}
        </h2>
        <NewButton onClick={onAdd} />
      </div>

      <div className="flex flex-col gap-3">
        {events.map((e) => <EventCard key={e.id} event={e} onOpen={onOpenEvent} />)}
      </div>
      <div className={events.length ? 'mt-3' : ''}>
        {tasks.map((t) => <TaskRow key={t.id} task={t} variant="large" onOpen={onOpen} onComplete={onComplete} />)}
      </div>

      {tasks.length + events.length === 0 && (
        <p className="rounded-card bg-card px-4 py-12 text-center text-ink-soft shadow-[0_1px_0_var(--color-line)]">
          Nada pendiente este día. ¡Disfrútalo!
        </p>
      )}
    </section>
  )
}
