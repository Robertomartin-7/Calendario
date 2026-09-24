import { useEffect, useState, type FormEvent } from 'react'
import { PRIORITIES, PRIORITY_BG, PRIORITY_LABEL } from '../lib/priority'
import type { DayString } from '../lib/dates'
import type { Priority, Task, TaskInput } from '../types'

type Props = {
  task?: Task
  defaultDate: DayString
  onClose: () => void
  onSave: (input: TaskInput) => void
  onDelete?: () => void
}

export function TaskSheet({ task, defaultDate, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [date, setDate] = useState(task?.date ?? defaultDate)
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'media')
  const [description, setDescription] = useState(task?.description ?? '')
  const [showDesc, setShowDesc] = useState(Boolean(task?.description))
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    onSave({ title: title.trim(), description: description.trim(), date, priority })
  }

  return (
    <div
      className="anim-fade fixed inset-0 z-20 flex items-end justify-center bg-ink/30 md:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={submit} role="dialog" aria-modal="true" aria-label={task ? 'Editar tarea' : 'Nueva tarea'}
        className="anim-sheet flex max-h-[92dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-[1.75rem] bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-[1.75rem]"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">{task ? 'Tarea' : 'Nueva tarea'}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <input
          autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué hay que hacer?" aria-label="Título" maxLength={120}
          className="min-h-12 rounded-2xl border border-line bg-bg px-4"
        />

        <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
          Fecha
          <input
            type="date" value={date} onChange={(e) => setDate(e.target.value)} required
            className="min-h-11 rounded-2xl border border-line bg-bg px-3 text-ink"
          />
        </label>

        <div role="radiogroup" aria-label="Prioridad" className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p} type="button" role="radio" aria-checked={priority === p}
              onClick={() => setPriority(p)}
              className={`flex items-center justify-center gap-2 rounded-full border text-[15px] font-medium transition-colors duration-150 ${
                priority === p ? `${PRIORITY_BG[p]} border-transparent text-ink` : 'border-line text-ink-soft'
              }`}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>

        {showDesc ? (
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción" aria-label="Descripción" rows={3}
            className="rounded-2xl border border-line bg-bg px-4 py-3"
          />
        ) : (
          <button type="button" onClick={() => setShowDesc(true)} className="self-start text-sm text-ink-soft underline underline-offset-4">
            + Añadir descripción
          </button>
        )}

        <div className="flex items-center gap-3 pt-1">
          {task && onDelete && (
            confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                ¿Borrar?
                <button type="button" onClick={onDelete} className="rounded-full bg-alta px-4 font-medium text-ink">Sí</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full border border-line px-4">No</button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-full px-3 text-sm text-ink-soft">
                Borrar
              </button>
            )
          )}
          <button
            type="submit" disabled={!title.trim() || !date}
            className="ml-auto rounded-full bg-ink px-7 font-medium text-white transition-opacity duration-150 disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
