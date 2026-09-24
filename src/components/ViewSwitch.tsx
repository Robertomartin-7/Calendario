import type { View } from '../lib/navigation'

const OPTIONS: { value: View; label: string }[] = [
  { value: 'dia', label: 'Día' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
]

/** Botón curvado Día | Semana | Mes, y el botón "Hoy". */
export function ViewSwitch({ view, onChange, onToday, onBackground }: {
  view: View
  onChange: (v: View) => void
  onToday: () => void
  onBackground: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div role="tablist" aria-label="Vista" className="flex rounded-full bg-card p-1 shadow-[0_1px_0_var(--color-line)]">
        {OPTIONS.map((o) => (
          <button
            key={o.value} type="button" role="tab" aria-selected={view === o.value} onClick={() => onChange(o.value)}
            className={`min-h-[40px] rounded-full px-4 text-[15px] font-medium transition-colors duration-200 ${
              view === o.value ? 'bg-ink text-white' : 'text-ink-soft'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button" onClick={onBackground} aria-label="Foto de fondo del mes"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-transform duration-150 active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 9" />
          </svg>
        </button>
        <button
          type="button" onClick={onToday}
          className="rounded-full border border-line bg-card px-5 text-[15px] font-medium text-ink transition-transform duration-150 active:scale-95"
        >
          Hoy
        </button>
      </div>
    </div>
  )
}
