import { useEffect, useState } from 'react'

export type BackgroundApi = {
  subscribe: (monthKey: string, cb: (dataUrl: string | null) => void) => () => void
  save: (monthKey: string, dataUrl: string) => Promise<void>
  remove: (monthKey: string) => Promise<void>
}

/** Foto de fondo del mes (data URL) o null si no hay. */
export function useBackground(api: BackgroundApi, monthKey: string) {
  const [photo, setPhoto] = useState<string | null>(null)
  useEffect(() => {
    const unsub = api.subscribe(monthKey, setPhoto)
    return () => { unsub(); setPhoto(null) }
  }, [api, monthKey])
  return photo
}
