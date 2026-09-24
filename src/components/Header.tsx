import { useState } from 'react'

export const DEFAULT_HEADER = 'Higiene bucodental'

function Arrow({ dir, label, onClick }: { dir: 'prev' | 'next'; label: string; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card transition-transform duration-150 active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

/** Texto pequeño de la cabecera: decoración que Marina puede cambiar tocándolo. */
function HeaderText({ text, onChange }: { text: string; onChange: (t: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)

  function finish() {
    setEditing(false)
    const next = draft.trim()
    onChange(next || DEFAULT_HEADER)
  }

  if (editing) {
    return (
      <input
        autoFocus value={draft} maxLength={40} aria-label="Texto de la cabecera"
        onChange={(e) => setDraft(e.target.value)} onBlur={finish} onFocus={(e) => e.currentTarget.select()}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setDraft(text); setEditing(false) } }}
        className="w-full rounded-xl border border-line bg-card px-3 py-1.5"
      />
    )
  }
  return (
    <button
      type="button" onClick={() => { setDraft(text); setEditing(true) }} aria-label={`Cambiar texto de la cabecera: ${text}`}
      className="-my-3 min-h-[44px] py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-soft"
    >
      {text}
    </button>
  )
}

type Props = {
  headerText: string
  onHeaderText: (t: string) => void
  title: { main: string; year: string }
  onTitle: () => void
  onPrev: () => void
  onNext: () => void
  prevLabel: string
  nextLabel: string
}

export function Header({ headerText, onHeaderText, title, onTitle, onPrev, onNext, prevLabel, nextLabel }: Props) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <HeaderText text={headerText} onChange={onHeaderText} />
        <h1 className="font-serif text-[1.75rem] font-semibold leading-tight text-ink min-[400px]:text-[2rem] md:text-[2.4rem]">
          <button
            type="button" onClick={onTitle} aria-label={`${title.main} ${title.year}. Elegir mes y año`}
            className="min-h-0 min-w-0 text-left"
          >
            {title.main} <span className="font-normal text-ink-soft/70">{title.year}</span>
          </button>
        </h1>
      </div>
      <div className="flex shrink-0 gap-2.5 pb-1">
        <Arrow dir="prev" label={prevLabel} onClick={onPrev} />
        <Arrow dir="next" label={nextLabel} onClick={onNext} />
      </div>
    </header>
  )
}
