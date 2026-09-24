import { iconForDay, messageForDay } from '../lib/messages'
import type { DayString } from '../lib/dates'
import { DentalIcon } from './DentalIcons'

/** Estado vacío de un día: mensaje motivacional (distinto cada día) con un icono dental muy suave. */
export function EmptyDay({ day, className = '' }: { day: DayString; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-card bg-card px-6 py-9 text-center shadow-[0_1px_0_var(--color-line)] ${className}`}>
      <DentalIcon index={iconForDay(day)} className="text-baja" />
      <p className="max-w-[18rem] font-serif text-[19px] leading-snug text-ink-soft">{messageForDay(day)}</p>
    </div>
  )
}
