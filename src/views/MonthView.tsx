import { addMonths, isSameMonth, startOfMonth } from 'date-fns'
import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { MonthGrid, PriorityLegend } from '../components/MonthGrid'
import { TaskList } from '../components/TaskList'
import { ComposeSheet } from '../components/ComposeSheet'
import { EventSheet } from '../components/EventSheet'
import { TaskSheet } from '../components/TaskSheet'
import { tasksOnDay } from '../lib/calendar'
import { eventsOnDay } from '../lib/events'
import { fromDay, toDay, todayString } from '../lib/dates'
import type { CalendarEvent, EventInput, Task, TaskInput } from '../types'

type Sheet = { kind: 'new' } | { kind: 'edit'; task: Task } | { kind: 'event'; event: CalendarEvent } | null

export type TaskActions = {
  add: (input: TaskInput) => void
  update: (id: string, input: TaskInput) => void
  remove: (id: string) => void
  skip: (id: string, day: string) => void
}

export type EventActions = {
  add: (input: EventInput) => void
  update: (id: string, input: EventInput) => void
  remove: (id: string) => void
}

type Props = { tasks: Task[]; events: CalendarEvent[]; actions: TaskActions; eventActions: EventActions }

export function MonthView({ tasks, events, actions, eventActions }: Props) {
  const today = todayString()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(today)
  const [sheet, setSheet] = useState<Sheet>(null)

  const dayTasks = useMemo(() => tasksOnDay(tasks, selected), [tasks, selected])
  const dayEvents = useMemo(() => eventsOnDay(events, selected), [events, selected])

  function goToMonth(m: Date) {
    setMonth(m)
    // La lista siempre corresponde a un día visible: hoy en el mes actual, si no el día 1.
    setSelected(isSameMonth(m, new Date()) ? today : toDay(m))
  }

  function select(d: Date) {
    setSelected(toDay(d))
    if (!isSameMonth(d, month)) setMonth(startOfMonth(d))
  }

  function focusDay(day: string) {
    setSelected(day)
    if (!isSameMonth(fromDay(day), month)) setMonth(startOfMonth(fromDay(day)))
    setSheet(null)
  }

  function saveTask(input: TaskInput) {
    if (sheet?.kind === 'edit') actions.update(sheet.task.id, input)
    else actions.add(input)
    focusDay(input.date)
  }

  function saveEvent(input: EventInput) {
    if (sheet?.kind === 'event') eventActions.update(sheet.event.id, input)
    else eventActions.add(input)
    focusDay(input.date)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-10 pt-6 md:grid md:grid-cols-[1.2fr_1fr] md:gap-x-8 md:px-8 md:pt-10">
      <div className="flex flex-col gap-5 md:col-span-2">
        <Header month={month} onPrev={() => goToMonth(addMonths(month, -1))} onNext={() => goToMonth(addMonths(month, 1))} />
      </div>
      <div className="flex flex-col gap-3">
        <MonthGrid
          month={month} selected={selected} today={today} tasks={tasks} events={events}
          onSelect={select}
          onPrev={() => goToMonth(addMonths(month, -1))} onNext={() => goToMonth(addMonths(month, 1))}
        />
        <PriorityLegend />
      </div>
      <div className="mt-2 md:mt-0">
        <TaskList
          day={selected} isToday={selected === today} tasks={dayTasks} events={dayEvents}
          onOpenEvent={(event) => setSheet({ kind: 'event', event })}
          onAdd={() => setSheet({ kind: 'new' })}
          onOpen={(task) => setSheet({ kind: 'edit', task })}
          onComplete={(t) => (t.recurrence ? actions.skip(t.id, selected) : actions.remove(t.id))}
        />
      </div>

      {sheet?.kind === 'new' && (
        <ComposeSheet defaultDate={selected} onClose={() => setSheet(null)} onSaveTask={saveTask} onSaveEvent={saveEvent} />
      )}
      {sheet?.kind === 'edit' && (
        <TaskSheet
          key={sheet.task.id} task={sheet.task} defaultDate={selected}
          onClose={() => setSheet(null)} onSave={saveTask}
          onDelete={() => { actions.remove(sheet.task.id); setSheet(null) }}
        />
      )}
      {sheet?.kind === 'event' && (
        <EventSheet
          key={sheet.event.id} event={sheet.event} defaultDate={selected}
          onClose={() => setSheet(null)} onSave={saveEvent}
          onDelete={() => { eventActions.remove(sheet.event.id); setSheet(null) }}
        />
      )}
    </div>
  )
}
