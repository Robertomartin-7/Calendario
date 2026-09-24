import { useState } from 'react'
import { PRIORITY_BG, PRIORITY_LABEL } from '../lib/priority'
import type { Task } from '../types'

const LEAVE_MS = 200

type Variant = 'compact' | 'large' | 'week'

type Props = {
  task: Task
  variant?: Variant
  onOpen: (t: Task) => void
  onComplete: (t: Task) => void
}

const Chip = ({ p }: { p: Task['priority'] }) => (
  <span className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold text-ink ${PRIORITY_BG[p]}`}>
    {PRIORITY_LABEL[p]}
  </span>
)

/** Tarea con círculo para completar. Al completarla se desvanece y se elimina. */
export function TaskRow({ task, variant = 'compact', onOpen, onComplete }: Props) {
  const [leaving, setLeaving] = useState(false)

  function complete() {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => onComplete(task), LEAVE_MS)
  }

  const circle = (
    <button
      type="button" onClick={complete} aria-label={`Marcar como hecha: ${task.title}`}
      className={`flex shrink-0 items-center justify-center ${variant === 'week' ? 'h-11 w-9' : 'h-11 w-11'}`}
    >
      <span
        className={`rounded-full border-[1.5px] border-ink-faint transition-colors duration-150 hover:bg-baja/40 ${
          variant === 'large' ? 'h-7 w-7' : variant === 'week' ? 'h-5 w-5' : 'h-6 w-6'
        }`}
      />
    </button>
  )

  let inner
  if (variant === 'large') {
    inner = (
      <div className="pb-3">
        <div className="flex gap-2 rounded-card bg-card p-3 pr-4 shadow-[0_1px_0_var(--color-line)]">
          {circle}
          <button type="button" onClick={() => onOpen(task)} className="min-h-[44px] flex-1 text-left">
            <span className="flex items-start justify-between gap-3">
              <span className="pt-2 text-xl font-medium leading-snug text-ink">{task.title}</span>
              <span className="pt-2"><Chip p={task.priority} /></span>
            </span>
            {task.description && (
              <span className="mt-1 block whitespace-pre-line pb-2 text-[15px] leading-relaxed text-ink-soft">
                {task.description}
              </span>
            )}
          </button>
        </div>
      </div>
    )
  } else if (variant === 'week') {
    inner = (
      <div className="flex items-start">
        {circle}
        <button type="button" onClick={() => onOpen(task)} className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 text-left">
          <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_BG[task.priority]}`} aria-label={`Prioridad ${PRIORITY_LABEL[task.priority]}`} />
          <span className="break-words text-[15px] leading-snug text-ink">{task.title}</span>
        </button>
      </div>
    )
  } else {
    inner = (
      <div className="flex min-h-[56px] items-center gap-1 border-b border-line last:border-b-0">
        {circle}
        <button type="button" onClick={() => onOpen(task)} className="flex min-h-[44px] flex-1 items-center justify-between gap-3 text-left">
          <span className="text-[16px] font-medium leading-snug text-ink">{task.title}</span>
          <Chip p={task.priority} />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
        leaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
      }`}
    >
      <div className="overflow-hidden">{inner}</div>
    </div>
  )
}
