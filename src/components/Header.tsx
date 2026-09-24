import { monthName } from '../lib/dates'

function Arrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick}
      aria-label={dir === 'prev' ? 'Mes anterior' : 'Mes siguiente'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card transition-transform duration-150 active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

export function Header({ month, onPrev, onNext }: { month: Date; onPrev: () => void; onNext: () => void }) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">Higiene bucodental</p>
        <h1 className="font-serif text-[1.75rem] min-[400px]:text-[2rem] md:text-[2.4rem] font-semibold leading-tight text-ink">
          {monthName(month)} <span className="font-normal text-ink-soft/70">{month.getFullYear()}</span>
        </h1>
      </div>
      <div className="flex shrink-0 gap-2.5 pb-1">
        <Arrow dir="prev" onClick={onPrev} />
        <Arrow dir="next" onClick={onNext} />
      </div>
    </header>
  )
}
