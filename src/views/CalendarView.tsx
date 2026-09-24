import { format, startOfMonth } from 'date-fns'
import { useMemo, useState } from 'react'
import { BackgroundSheet } from '../components/BackgroundSheet'
import { ComposeSheet } from '../components/ComposeSheet'
import { EventSheet } from '../components/EventSheet'
import { Header } from '../components/Header'
import { MonthYearPicker } from '../components/MonthYearPicker'
import { TaskSheet } from '../components/TaskSheet'
import { ViewSwitch } from '../components/ViewSwitch'
import { useBackground, type BackgroundApi } from '../hooks/useBackground'
import { useSwipe } from '../hooks/useSwipe'
import { tasksOnDay } from '../lib/calendar'
import { fromDay, monthName, toDay, todayString, type DayString } from '../lib/dates'
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
  backgrounds: BackgroundApi
}

export function CalendarView({ tasks, events, actions, eventActions, headerText, onHeaderText, backgrounds }: Props) {
  const today = todayString()
  const [view, setView] = useState<View>('mes')
  // Un solo día seleccionado manda en las tres vistas; el mes y la semana salen de él.
  const [selected, setSelected] = useState<DayString>(today)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [picking, setPicking] = useState(false)
  const [choosingBg, setChoosingBg] = useState(false)

  const month = startOfMonth(fromDay(selected))
  const monthKey = format(month, 'yyyy-MM')
  const photo = useBackground(backgrounds, monthKey)
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
    <div
      className="relative isolate mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-10 pt-6 md:px-8 md:pt-10"
      data-photo={photo ? '' : undefined}
    >
      {photo && (
        <>
          <div key={monthKey} className="anim-photo fixed inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} aria-hidden />
          <div className="fixed inset-0 -z-10 bg-bg/60" aria-hidden />
        </>
      )}
      <Header
        headerText={headerText} onHeaderText={onHeaderText}
        title={viewTitle(view, selected)} onTitle={() => setPicking(true)}
        onPrev={() => step(-1)} onNext={() => step(1)} prevLabel={prevLabel} nextLabel={nextLabel}
      />
      <ViewSwitch view={view} onChange={setView} onToday={() => setSelected(today)} onBackground={() => setChoosingBg(true)} />

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
      {choosingBg && (
        <BackgroundSheet
          monthLabel={monthName(month)} current={photo} onClose={() => setChoosingBg(false)}
          onSave={(data) => backgrounds.save(monthKey, data)} onRemove={() => backgrounds.remove(monthKey)}
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
