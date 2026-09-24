import { useState } from 'react'
import { monthName } from '../lib/dates'
import { Sheet } from './Sheet'

/** Selector de mes y año: año con flechas y los 12 meses. */
export function MonthYearPicker({ year, month, onPick, onClose }: {
  year: number
  month: number
  onPick: (year: number, month: number) => void
  onClose: () => void
}) {
  const [y, setY] = useState(year)
  const Arrow = ({ d }: { d: 1 | -1 }) => (
    <button
      type="button" onClick={() => setY((v) => v + d)} aria-label={d < 0 ? 'Año anterior' : 'Año siguiente'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={d < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )

  return (
    <Sheet
      label="Elegir mes y año" onClose={onClose} onSubmit={(e) => e.preventDefault()}
      header={
        <div className="flex items-center gap-3">
          <Arrow d={-1} />
          <h2 className="min-w-16 text-center font-serif text-2xl font-semibold text-ink">{y}</h2>
          <Arrow d={1} />
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, m) => (
          <button
            key={m} type="button" onClick={() => onPick(y, m)} aria-pressed={y === year && m === month}
            className={`min-h-12 rounded-2xl text-[15px] font-medium transition-colors duration-150 ${
              y === year && m === month ? 'bg-ink text-white' : 'bg-bg text-ink'
            }`}
          >
            {monthName(new Date(y, m, 1))}
          </button>
        ))}
      </div>
    </Sheet>
  )
}
