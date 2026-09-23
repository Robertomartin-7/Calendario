import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { completeRedirect } from '../firebase/auth'
import { auth } from '../firebase/config'

/** user === undefined mientras se comprueba la sesión; null si no hay sesión. */
export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    completeRedirect().catch((e) => setError(e.code ?? 'error'))
    return onAuthStateChanged(auth, setUser)
  }, [])

  return { user, error }
}
