import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TaskRow } from '../components/TaskRow'
import { NewButton } from '../components/TaskList'
import { tasksOnDay } from '../lib/calendar'
import { toDay, type DayString } from '../lib/dates'
import { eventsOnDay } from '../lib/events'
import { weekDays } from '../lib/navigation'
import type { CalendarEvent, Task } from '../types'

type Props = {
  selected: DayString
  today: DayString
  tasks: Task[]
  events: CalendarEvent[]
  onSelect: (day: DayString) => void
  onAdd: () => void
  onOpen: (t: Task) => void
  onOpenEvent: (e: CalendarEvent) => void
  onComplete: (t: Task, day: DayString) => void
}

/** Vista Semana: los 7 días, de lunes a domingo, con sus tareas y eventos (solo títulos). */
export function WeekView({ selected, today, tasks, events, onSelect, onAdd, onOpen, onOpenEvent, onComplete }: Props) {
  return (
    <section aria-label="Semana">
      <div className="flex justify-end pb-2"><NewButton onClick={onAdd} /></div>
      <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-4">
        {weekDays(selected).map((d) => {
          const key = toDay(d)
          const dayTasks = tasksOnDay(tasks, key)
          const dayEvents = eventsOnDay(events, key)
          const isToday = key === today
          const isSelected = key === selected
          return (
            <div
              key={key}
              className={`rounded-card bg-card p-2 shadow-[0_1px_0_var(--color-line)] transition-shadow duration-150 ${
                isSelected ? 'ring-2 ring-ink/15' : ''
              }`}
            >
              <button
                type="button" onClick={() => onSelect(key)} aria-pressed={isSelected}
                className="flex min-h-[44px] w-full items-center gap-2 px-1 text-left"
              >
                <span
                  className={`flex h-8 min-w-8 items-center justify-center rounded-full px-1 text-[15px] font-medium ${
                    isToday ? 'bg-ink text-white' : 'text-ink'
                  }`}
                >
                  {d.getDate()}
                </span>
                <span className="text-sm capitalize text-ink-soft">{format(d, 'EEEE', { locale: es })}</span>
              </button>

              {dayEvents.map((e) => (
                <button
                  key={e.id} type="button" onClick={() => onOpenEvent(e)}
                  className="mb-1 flex min-h-[44px] w-full items-center gap-2 rounded-2xl bg-event/70 px-3 text-left"
                >
                  <span className="text-lg leading-none" aria-hidden>{e.emoji ?? '✦'}</span>
                  <span className="font-serif text-[15px] font-semibold leading-snug text-ink">{e.name}</span>
                </button>
              ))}

              {dayTasks.map((t) => (
                <TaskRow key={t.id} task={t} variant="week" onOpen={onOpen} onComplete={(task) => onComplete(task, key)} />
              ))}

              {dayTasks.length + dayEvents.length === 0 && (
                <p className="px-2 pb-2 text-sm text-ink-faint">Libre</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
