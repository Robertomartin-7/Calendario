import { MonthGrid, PriorityLegend } from '../components/MonthGrid'
import { TaskList } from '../components/TaskList'
import type { DayString } from '../lib/dates'
import type { CalendarEvent, Task } from '../types'

type Props = {
  month: Date
  selected: DayString
  today: DayString
  tasks: Task[]
  events: CalendarEvent[]
  dayTasks: Task[]
  dayEvents: CalendarEvent[]
  onSelect: (day: Date) => void
  onPrev: () => void
  onNext: () => void
  onAdd: () => void
  onOpen: (t: Task) => void
  onOpenEvent: (e: CalendarEvent) => void
  onComplete: (t: Task) => void
}

/** Vista Mes: cuadrícula con leyenda y, debajo (o al lado en escritorio), la lista del día. */
export function MonthView(p: Props) {
  return (
    <div className="flex flex-col gap-5 md:grid md:grid-cols-[1.2fr_1fr] md:gap-x-8">
      <div className="flex flex-col gap-3">
        <MonthGrid
          month={p.month} selected={p.selected} today={p.today} tasks={p.tasks} events={p.events}
          onSelect={p.onSelect} onPrev={p.onPrev} onNext={p.onNext}
        />
        <PriorityLegend />
      </div>
      <div className="mt-2 md:mt-0">
        <TaskList
          day={p.selected} isToday={p.selected === p.today} tasks={p.dayTasks} events={p.dayEvents}
          onOpenEvent={p.onOpenEvent} onAdd={p.onAdd} onOpen={p.onOpen} onComplete={p.onComplete}
        />
      </div>
    </div>
  )
}
