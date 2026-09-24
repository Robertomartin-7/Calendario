import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { fromDay, type DayString } from '../lib/dates'
import { PRIORITY_BG, PRIORITY_LABEL } from '../lib/priority'
import type { Task } from '../types'

type Props = {
  day: DayString
  isToday: boolean
  tasks: Task[]
  onAdd: () => void
  onOpen: (t: Task) => void
  onComplete: (t: Task) => void
}

const LEAVE_MS = 200

export function TaskList({ day, isToday, tasks, onAdd, onOpen, onComplete }: Props) {
  const [leaving, setLeaving] = useState<Set<string>>(new Set())

  function complete(t: Task) {
    setLeaving((s) => new Set(s).add(t.id))
    setTimeout(() => {
      onComplete(t)
      setLeaving((s) => { const n = new Set(s); n.delete(t.id); return n })
    }, LEAVE_MS)
  }

  const count = tasks.length
  const dayLabel = format(fromDay(day), "EEEE d 'de' MMMM", { locale: es })

  return (
    <section aria-label="Por terminar">
      <div className="flex items-baseline justify-between gap-3 px-1 pb-3">
        <div>
          <h2 className="flex items-baseline gap-2 font-serif text-2xl font-semibold text-ink">
            Por terminar
            <span className="font-sans text-sm font-normal text-ink-soft">
              {count} {count === 1 ? 'tarea' : 'tareas'}
            </span>
          </h2>
          {!isToday && <p className="text-sm capitalize text-ink-soft">{dayLabel}</p>}
        </div>
        <button
          type="button" onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-ink transition-opacity duration-150 active:opacity-60"
        >
          <span className="text-xl leading-none" aria-hidden>+</span> Nueva
        </button>
      </div>

      <div className="rounded-card bg-card px-3 py-1 shadow-[0_1px_0_var(--color-line)]">
        {count === 0 ? (
          <p className="px-2 py-8 text-center text-ink-soft">
            {isToday ? 'Nada pendiente hoy. ¡Respira!' : 'Nada pendiente este día.'}
          </p>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                leaving.has(t.id) ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex min-h-[56px] items-center gap-1 border-b border-line last:border-b-0">
                  <button
                    type="button" onClick={() => complete(t)}
                    aria-label={`Marcar como hecha: ${t.title}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center"
                  >
                    <span className="h-6 w-6 rounded-full border-[1.5px] border-ink-faint transition-colors duration-150 hover:bg-baja/40" />
                  </button>
                  <button
                    type="button" onClick={() => onOpen(t)}
                    className="flex min-h-[44px] flex-1 items-center justify-between gap-3 text-left"
                  >
                    <span className="text-[16px] font-medium leading-snug text-ink">{t.title}</span>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold text-ink ${PRIORITY_BG[t.priority]}`}>
                      {PRIORITY_LABEL[t.priority]}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
