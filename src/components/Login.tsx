import { useState, type FormEvent } from 'react'
import { Tooth } from './DentalIcons'
import { authErrorMessage, registerEmail, signInEmail, signInWithGoogle } from '../firebase/auth'

export function Login({ initialError }: { initialError?: string | null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(
    initialError ? authErrorMessage(initialError) : null,
  )
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await (creating ? registerEmail : signInEmail)(email.trim(), password)
    } catch (err) {
      setError(authErrorMessage((err as { code?: string }).code ?? ''))
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <header>
        <Tooth className="mb-3 text-baja" />
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
          Higiene bucodental
        </p>
        <h1 className="font-serif text-4xl font-semibold text-ink">Mi calendario</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-card bg-card p-5 shadow-[0_1px_0_var(--color-line)]">
        <button
          type="button"
          onClick={() => { setError(null); signInWithGoogle().catch((e) => setError(authErrorMessage(e.code))) }}
          className="rounded-full bg-ink px-5 font-medium text-white transition-opacity duration-200 active:opacity-80"
        >
          Entrar con Google
        </button>

        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="h-px flex-1 bg-line" /> o con correo <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email" inputMode="email" autoComplete="email" required
            placeholder="Correo" aria-label="Correo"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 rounded-2xl border border-line bg-bg px-4"
          />
          <input
            type="password" required autoComplete={creating ? 'new-password' : 'current-password'}
            placeholder="Contraseña" aria-label="Contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-2xl border border-line bg-bg px-4"
          />
          {error && <p role="alert" className="text-sm text-[#b04a4a]">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="rounded-full border border-ink px-5 font-medium transition-opacity duration-200 disabled:opacity-50"
          >
            {creating ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <button
          type="button" onClick={() => setCreating((c) => !c)}
          className="text-sm text-ink-soft underline underline-offset-4"
        >
          {creating ? 'Ya tengo cuenta' : 'Crear una cuenta con correo'}
        </button>
      </div>
    </main>
  )
}
