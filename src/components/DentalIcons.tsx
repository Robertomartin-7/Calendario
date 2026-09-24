/** Iconos de línea de temática dental, sutiles, para estados vacíos y huecos. */
type P = { className?: string }
const base = { width: 44, height: 44, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

export const Tooth = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 8c-4.4 0-7.5 3.2-7.5 8 0 4 1.7 6.6 2.7 10.3 1 3.8 1.2 9 3.2 13.8.8 1.9 2.8 1.9 3.6.1 1.4-3.4 1.8-8.2 3.8-8.2h.4c2 0 2.4 4.8 3.8 8.2.8 1.8 2.8 1.8 3.6-.1 2-4.8 2.2-10 3.2-13.8C34.8 22.6 36.5 20 36.5 16c0-4.8-3.1-8-7.5-8-3 0-4 1.4-6 1.4S17 8 14 8z" transform="translate(1 0)" />
  </svg>
)

export const Toothbrush = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 42L28 20" strokeWidth="4" />
    <rect x="27" y="7" width="9" height="19" rx="3" transform="rotate(45 31.5 16.5)" />
    <path d="M33 10l2 2M37 14l2 2M29 14l2 2" />
  </svg>
)

export const Smile = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="24" cy="24" r="17" />
    <path d="M16 27c2 4.5 5 6.5 8 6.5s6-2 8-6.5" />
    <circle cx="18" cy="19" r="1.2" fill="currentColor" />
    <circle cx="30" cy="19" r="1.2" fill="currentColor" />
  </svg>
)

const ICONS = [Tooth, Toothbrush, Smile]
export const DentalIcon = ({ index, className }: { index: 0 | 1 | 2; className?: string }) => {
  const Icon = ICONS[index]
  return <Icon className={className} />
}
