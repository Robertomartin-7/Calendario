import { startOfMonth } from 'date-fns'
import { useMemo, useState } from 'react'
import { ComposeSheet } from '../components/ComposeSheet'
import { EventSheet } from '../components/EventSheet'
import { Header } from '../components/Header'
import { MonthYearPicker } from '../components/MonthYearPicker'
import { TaskSheet } from '../components/TaskSheet'
import { ViewSwitch } from '../components/ViewSwitch'
import { useSwipe } from '../hooks/useSwipe'
import { tasksOnDay } from '../lib/calendar'
import { fromDay, toDay, todayString, type DayString } from '../lib/dates'
import { eventsOnDay } from '../lib/events'
import { selectionForMonth, stepLabels, stepSelection, viewTitle, type View } from '../lib/navigation'
import type { CalendarEvent, EventInput, Task, TaskInput } from '../types'
import { DayView } from './DayView'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'

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

type Sheet = { kind: 'new' } | { kind: 'edit'; task: Task } | { kind: 'event'; event: CalendarEvent } | null

type Props = {
  tasks: Task[]
  events: CalendarEvent[]
  actions: TaskActions
  eventActions: EventActions
  headerText: string
  onHeaderText: (t: string) => void
}

export function CalendarView({ tasks, events, actions, eventActions, headerText, onHeaderText }: Props) {
  const today = todayString()
  const [view, setView] = useState<View>('mes')
  // Un solo día seleccionado manda en las tres vistas; el mes y la semana salen de él.
  const [selected, setSelected] = useState<DayString>(today)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [picking, setPicking] = useState(false)

  const month = startOfMonth(fromDay(selected))
  const dayTasks = useMemo(() => tasksOnDay(tasks, selected), [tasks, selected])
  const dayEvents = useMemo(() => eventsOnDay(events, selected), [events, selected])

  const step = (dir: 1 | -1) => setSelected(stepSelection(view, selected, dir, today))
  const swipe = useSwipe(() => step(1), () => step(-1))
  const [prevLabel, nextLabel] = stepLabels(view)

  function complete(t: Task, day: DayString = selected) {
    if (t.recurrence) actions.skip(t.id, day)
    else actions.remove(t.id)
  }

  function focusDay(day: DayString) {
    setSelected(day)
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

  const open = {
    onAdd: () => setSheet({ kind: 'new' }),
    onOpen: (task: Task) => setSheet({ kind: 'edit', task }),
    onOpenEvent: (event: CalendarEvent) => setSheet({ kind: 'event', event }),
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-10 pt-6 md:px-8 md:pt-10">
      <Header
        headerText={headerText} onHeaderText={onHeaderText}
        title={viewTitle(view, selected)} onTitle={() => setPicking(true)}
        onPrev={() => step(-1)} onNext={() => step(1)} prevLabel={prevLabel} nextLabel={nextLabel}
      />
      <ViewSwitch view={view} onChange={setView} onToday={() => setSelected(today)} />

      <div key={view} className="anim-fade" {...(view === 'mes' ? {} : swipe)}>
        {view === 'mes' && (
          <MonthView
            month={month} selected={selected} today={today} tasks={tasks} events={events}
            dayTasks={dayTasks} dayEvents={dayEvents}
            onSelect={(d) => setSelected(toDay(d))} onPrev={() => step(-1)} onNext={() => step(1)}
            onComplete={(t) => complete(t)} {...open}
          />
        )}
        {view === 'semana' && (
          <WeekView
            selected={selected} today={today} tasks={tasks} events={events}
            onSelect={setSelected} onComplete={complete} {...open}
          />
        )}
        {view === 'dia' && (
          <DayView
            day={selected} isToday={selected === today} tasks={dayTasks} events={dayEvents}
            onComplete={(t) => complete(t)} {...open}
          />
        )}
      </div>

      {picking && (
        <MonthYearPicker
          year={month.getFullYear()} month={month.getMonth()}
          onClose={() => setPicking(false)}
          onPick={(y, m) => { setSelected(selectionForMonth(new Date(y, m, 1), today)); setPicking(false) }}
        />
      )}
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
