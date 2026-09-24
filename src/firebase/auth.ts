import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { auth } from './config'

// Redirect (no popup): es lo más fiable en Safari de iPhone y en la PWA instalada.
export const signInWithGoogle = () => signInWithRedirect(auth, new GoogleAuthProvider())
export const completeRedirect = () => getRedirectResult(auth)
export const signInEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)
export const registerEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)
export const logOut = () => signOut(auth)

export function authErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'El correo no es válido.'
    case 'auth/missing-password':
    case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/email-already-in-use': return 'Ya existe una cuenta con ese correo.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'Correo o contraseña incorrectos.'
    case 'auth/too-many-requests': return 'Demasiados intentos. Prueba en unos minutos.'
    case 'auth/network-request-failed': return 'Sin conexión. Revisa internet.'
    default: return `No se pudo iniciar sesión (${code || 'error'}). Inténtalo de nuevo.`
  }
}
