import { useMemo } from 'react'
import { addEvent, addTask, removeEvent, removeTask, skipOccurrence, updateEvent, updateTask } from './firebase/db'
import type { EventInput, TaskInput } from './types'
import { useEvents } from './hooks/useEvents'
import { Login } from './components/Login'
import { isConfigured } from './firebase/config'
import { logOut } from './firebase/auth'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import { MonthView } from './views/MonthView'

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
  return <Signed uid={user.uid} email={user.email} />
}

function Signed({ uid, email }: { uid: string; email: string | null }) {
  const { tasks, error: tasksError } = useTasks(uid)
  const { events, error: eventsError } = useEvents(uid)
  const error = tasksError ?? eventsError
  const actions = useMemo(
    () => ({
      add: (i: TaskInput) => addTask(uid, i),
      update: (id: string, i: TaskInput) => updateTask(uid, id, i),
      remove: (id: string) => removeTask(uid, id),
      skip: (id: string, day: string) => skipOccurrence(uid, id, day),
    }),
    [uid],
  )
  const eventActions = useMemo(
    () => ({
      add: (i: EventInput) => addEvent(uid, i),
      update: (id: string, i: EventInput) => updateEvent(uid, id, i),
      remove: (id: string) => removeEvent(uid, id),
    }),
    [uid],
  )
  return (
    <>
      {error && <p role="alert" className="bg-alta/40 px-4 py-2 text-center text-sm">{error}</p>}
      <MonthView tasks={tasks} events={events} actions={actions} eventActions={eventActions} />
      <footer className="pb-8 text-center text-xs text-ink-faint">
        {email} ·{' '}
        <button onClick={logOut} className="min-h-0 min-w-0 underline underline-offset-2">Cerrar sesión</button>
      </footer>
    </>
  )
}
