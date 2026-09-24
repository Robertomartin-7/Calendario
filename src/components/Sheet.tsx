import { useEffect, type FormEvent, type ReactNode } from 'react'

/** Hoja modal: desde abajo en móvil, centrada en escritorio. Se cierra con Escape o tocando fuera. */
export function Sheet({ label, header, onClose, onSubmit, children }: {
  label: string
  header: ReactNode
  onClose: () => void
  onSubmit: (e: FormEvent) => void
  children: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="anim-fade fixed inset-0 z-20 flex items-end justify-center bg-ink/30 md:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={onSubmit} role="dialog" aria-modal="true" aria-label={label}
        className="anim-sheet flex max-h-[92dvh] w-full max-w-md flex-col gap-3.5 overflow-y-auto rounded-t-[1.75rem] bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-[1.75rem]"
      >
        <div className="flex items-center justify-between gap-2">
          {header}
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {children}
      </form>
    </div>
  )
}

/** Selector Tarea | Evento (solo al crear). */
export function KindSwitch({ kind, onChange }: { kind: 'tarea' | 'evento'; onChange: (k: 'tarea' | 'evento') => void }) {
  return (
    <div role="tablist" aria-label="Tipo" className="flex rounded-full bg-bg p-1">
      {(['tarea', 'evento'] as const).map((k) => (
        <button
          key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => onChange(k)}
          className={`min-h-[40px] rounded-full px-5 text-[15px] font-medium capitalize transition-colors duration-150 ${
            kind === k ? 'bg-card text-ink shadow-sm' : 'text-ink-soft'
          }`}
        >
          {k}
        </button>
      ))}
    </div>
  )
}
