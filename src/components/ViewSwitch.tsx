import type { View } from '../lib/navigation'

const OPTIONS: { value: View; label: string }[] = [
  { value: 'dia', label: 'Día' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mes' },
]

/** Botón curvado Día | Semana | Mes, y el botón "Hoy". */
export function ViewSwitch({ view, onChange, onToday }: { view: View; onChange: (v: View) => void; onToday: () => void }) {
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
      <button
        type="button" onClick={onToday}
        className="rounded-full border border-line bg-card px-5 text-[15px] font-medium text-ink transition-transform duration-150 active:scale-95"
      >
        Hoy
      </button>
    </div>
  )
}
