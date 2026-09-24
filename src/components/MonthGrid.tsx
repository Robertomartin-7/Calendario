import { isSameMonth } from 'date-fns'
import { dotsFor, monthGrid, tasksOnDay } from '../lib/calendar'
import { toDay, type DayString } from '../lib/dates'
import { PRIORITIES, PRIORITY_BG, PRIORITY_LABEL } from '../lib/priority'
import type { CalendarEvent, Task } from '../types'
import { eventsOnDay } from '../lib/events'
import { useSwipe } from '../hooks/useSwipe'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

type Props = {
  month: Date
  selected: DayString
  today: DayString
  tasks: Task[]
  events: CalendarEvent[]
  onSelect: (day: Date) => void
  onPrev: () => void
  onNext: () => void
}

export function MonthGrid({ month, selected, today, tasks, events, onSelect, onPrev, onNext }: Props) {
  const swipe = useSwipe(onNext, onPrev)
  const days = monthGrid(month)

  return (
    <section className="rounded-card bg-card p-3 shadow-[0_1px_0_var(--color-line)]" {...swipe}>
      <div className="grid grid-cols-7 pb-1 text-center text-xs font-medium text-ink-soft" aria-hidden>
        {WEEKDAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>

      <div key={toDay(month)} className="anim-fade grid grid-cols-7" role="grid" aria-label="Calendario del mes">
        {days.map((d) => {
          const key = toDay(d)
          const { priorities, hasMore } = dotsFor(tasksOnDay(tasks, key))
          const dayEvents = eventsOnDay(events, key)
          const inMonth = isSameMonth(d, month)
          const isToday = key === today
          const isSelected = key === selected
          return (
            <button
              key={key} type="button" role="gridcell"
              onClick={() => onSelect(d)}
              aria-label={`${d.getDate()} de ${d.toLocaleDateString('es-ES', { month: 'long' })}${priorities.length ? `, ${priorities.length}${hasMore ? ' o más' : ''} tareas` : ''}${dayEvents.length ? `, evento: ${dayEvents.map((e) => e.name).join(', ')}` : ''}`}
              aria-selected={isSelected}
              className={`flex min-h-[52px] flex-col items-center justify-start gap-1 rounded-2xl pt-1 transition-colors duration-150 ${
                isSelected && !isToday ? 'bg-ink/[0.07]' : ''
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[15px] ${
                  isToday ? 'bg-ink font-semibold text-white' : inMonth ? 'font-medium text-ink' : 'text-ink-faint/70'
                } ${isSelected && isToday ? 'ring-2 ring-ink/25 ring-offset-2' : ''}`}
              >
                {d.getDate()}
              </span>
              <span className="flex h-3.5 items-center gap-[3px]" aria-hidden>
                {dayEvents.length > 0 && (
                  dayEvents[0].emoji
                    ? <span className="text-[11px] leading-none">{dayEvents[0].emoji}</span>
                    : <span className="h-[6px] w-[6px] rotate-45 rounded-[1px] bg-event-deep" />
                )}
                {priorities.map((p, i) => (
                  <span key={i} className={`h-[7px] w-[7px] rounded-full ${PRIORITY_BG[p]}`} />
                ))}
                {hasMore && <span className="text-[10px] font-semibold leading-none text-ink-soft">+</span>}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function PriorityLegend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[13px] text-ink-soft">
      <span>Prioridad</span>
      {PRIORITIES.map((p) => (
        <span key={p} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${PRIORITY_BG[p]}`} /> {PRIORITY_LABEL[p]}
        </span>
      ))}
    </p>
  )
}
