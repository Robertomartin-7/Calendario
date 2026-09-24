import { useRef, useState } from 'react'
import { resizeImage } from '../lib/image'
import { Sheet } from './Sheet'

/** Elegir o quitar la foto de fondo del mes. */
export function BackgroundSheet({ monthLabel, current, onSave, onRemove, onClose }: {
  monthLabel: string
  current: string | null
  onSave: (dataUrl: string) => Promise<void>
  onRemove: () => Promise<void>
  onClose: () => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(job: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await job()
      onClose()
    } catch {
      setError('No se pudo guardar la foto. Prueba con otra.')
      setBusy(false)
    }
  }

  async function pick(file: File | undefined) {
    if (!file) return
    await run(async () => onSave(await resizeImage(file)))
  }

  return (
    <Sheet
      label={`Fondo de ${monthLabel}`} onClose={onClose} onSubmit={(e) => e.preventDefault()}
      header={<h2 className="font-serif text-2xl font-semibold text-ink">Fondo de {monthLabel}</h2>}
    >
      {current ? (
        <img src={current} alt={`Fondo actual de ${monthLabel}`} className="aspect-[16/10] w-full rounded-2xl object-cover" />
      ) : (
        <p className="rounded-2xl bg-bg px-4 py-6 text-center text-ink-soft">Este mes aún no tiene foto de fondo.</p>
      )}

      <input
        ref={input} type="file" accept="image/*" hidden
        onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = '' }}
      />
      {error && <p role="alert" className="text-sm text-[#b04a4a]">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        {current && (
          <button type="button" disabled={busy} onClick={() => void run(onRemove)} className="rounded-full px-3 text-sm text-ink-soft disabled:opacity-40">
            Quitar foto
          </button>
        )}
        <button
          type="button" disabled={busy} onClick={() => input.current?.click()}
          className="ml-auto rounded-full bg-ink px-6 font-medium text-white transition-opacity duration-150 disabled:opacity-40"
        >
          {busy ? 'Guardando…' : current ? 'Cambiar foto' : 'Elegir foto'}
        </button>
      </div>
    </Sheet>
  )
}
