import { useState } from 'react'
import type { DayString } from '../lib/dates'
import type { EventInput, TaskInput } from '../types'
import { EventSheet } from './EventSheet'
import { KindSwitch } from './Sheet'
import { TaskSheet } from './TaskSheet'

/** "+ Nueva": hoja con dos opciones, Tarea (por defecto) y Evento. */
export function ComposeSheet({ defaultDate, onClose, onSaveTask, onSaveEvent }: {
  defaultDate: DayString
  onClose: () => void
  onSaveTask: (i: TaskInput) => void
  onSaveEvent: (i: EventInput) => void
}) {
  const [kind, setKind] = useState<'tarea' | 'evento'>('tarea')
  const switcher = <KindSwitch kind={kind} onChange={setKind} />
  return kind === 'tarea'
    ? <TaskSheet key="t" switcher={switcher} defaultDate={defaultDate} onClose={onClose} onSave={onSaveTask} />
    : <EventSheet key="e" switcher={switcher} defaultDate={defaultDate} onClose={onClose} onSave={onSaveEvent} />
}
