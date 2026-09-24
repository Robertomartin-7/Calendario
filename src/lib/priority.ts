import type { Priority } from '../types'

export const PRIORITIES: Priority[] = ['alta', 'media', 'baja']
export const PRIORITY_RANK: Record<Priority, number> = { alta: 0, media: 1, baja: 2 }
export const PRIORITY_LABEL: Record<Priority, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' }

// Clases estáticas para que Tailwind las detecte.
export const PRIORITY_BG: Record<Priority, string> = {
  alta: 'bg-alta',
  media: 'bg-media',
  baja: 'bg-baja',
}
