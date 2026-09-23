import { Login } from './components/Login'
import { isConfigured } from './firebase/config'
import { logOut } from './firebase/auth'
import { useAuth } from './hooks/useAuth'
import { monthName, todayString, fromDay } from './lib/dates'

function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center gap-3 px-6">
      <h1 className="font-serif text-3xl font-semibold">Falta configurar Firebase</h1>
      <p className="text-ink-soft">
        Copia <code>.env.example</code> a <code>.env.local</code> y rellena los valores. Los pasos están en el README.
      </p>
    </main>
  )
}

export default function App() {
  if (!isConfigured) return <SetupNotice />
  return <Authed />
}

function Authed() {
  const { user, error } = useAuth()
  if (user === undefined) return <div className="min-h-[100dvh]" aria-busy="true" />
  if (user === null) return <Login initialError={error} />

  // Marcador de la Fase 1: la vista Mes llega en la Fase 2.
  const today = fromDay(todayString())
  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">Higiene bucodental</p>
      <h1 className="font-serif text-4xl font-semibold">
        {monthName(today)} <span className="text-ink-soft/70 font-normal">{today.getFullYear()}</span>
      </h1>
      <p className="mt-6 text-ink-soft">Sesión iniciada como {user.email}.</p>
      <button onClick={logOut} className="mt-4 rounded-full border border-ink px-5 text-sm">
        Cerrar sesión
      </button>
    </main>
  )
}
