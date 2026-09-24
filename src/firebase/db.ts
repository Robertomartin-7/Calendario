import {
  addDoc, arrayUnion, collection, deleteDoc, deleteField, doc, onSnapshot, setDoc, updateDoc,
} from 'firebase/firestore'
import type { CalendarEvent, EventInput, Task, TaskInput } from '../types'
import { db } from './config'

const tasksCol = (uid: string) => collection(db, 'users', uid, 'tasks')

export function subscribeTasks(uid: string, onData: (t: Task[]) => void, onError: (e: Error) => void) {
  return onSnapshot(
    tasksCol(uid),
    (snap) => onData(snap.docs.map((d) => ({ ...(d.data() as Omit<Task, 'id'>), id: d.id }))),
    onError,
  )
}

// No se espera a la confirmación del servidor: la caché local ya actualiza la pantalla.
export function addTask(uid: string, input: TaskInput) {
  const { endDate, ...rest } = input
  void addDoc(tasksCol(uid), {
    ...rest,
    ...(endDate ? { endDate } : {}),
    skippedDates: [],
    createdAt: Date.now(),
  })
}
export function updateTask(uid: string, id: string, input: TaskInput) {
  const { endDate, ...rest } = input
  void updateDoc(doc(db, 'users', uid, 'tasks', id), { ...rest, endDate: endDate ?? deleteField() })
}
/** Completar una ocurrencia de una serie: se añade su fecha a skippedDates y la serie continúa. */
export function skipOccurrence(uid: string, id: string, day: string) {
  void updateDoc(doc(db, 'users', uid, 'tasks', id), { skippedDates: arrayUnion(day) })
}
export function removeTask(uid: string, id: string) {
  void deleteDoc(doc(db, 'users', uid, 'tasks', id))
}

const eventsCol = (uid: string) => collection(db, 'users', uid, 'events')

export function subscribeEvents(uid: string, onData: (e: CalendarEvent[]) => void, onError: (e: Error) => void) {
  return onSnapshot(
    eventsCol(uid),
    (snap) => onData(snap.docs.map((d) => ({ ...(d.data() as Omit<CalendarEvent, 'id'>), id: d.id }))),
    onError,
  )
}
export function addEvent(uid: string, input: EventInput) {
  const { emoji, ...rest } = input
  void addDoc(eventsCol(uid), { ...rest, ...(emoji ? { emoji } : {}) })
}
export function updateEvent(uid: string, id: string, input: EventInput) {
  const { emoji, ...rest } = input
  void updateDoc(doc(db, 'users', uid, 'events', id), { ...rest, emoji: emoji ?? deleteField() })
}
export function removeEvent(uid: string, id: string) {
  void deleteDoc(doc(db, 'users', uid, 'events', id))
}

const settingsDoc = (uid: string) => doc(db, 'users', uid, 'settings', 'main')

export function subscribeSettings(uid: string, onData: (s: { headerText?: string }) => void) {
  return onSnapshot(settingsDoc(uid), (snap) => onData((snap.data() as { headerText?: string }) ?? {}), () => {})
}
export function saveHeaderText(uid: string, headerText: string) {
  void setDoc(settingsDoc(uid), { headerText }, { merge: true })
}

// Una foto por mes, en su propio documento (users/{uid}/backgrounds/AAAA-MM), para no engordar los ajustes.
const bgDoc = (uid: string, key: string) => doc(db, 'users', uid, 'backgrounds', key)

export function subscribeBackground(uid: string, key: string, onData: (dataUrl: string | null) => void) {
  return onSnapshot(bgDoc(uid, key), (snap) => onData((snap.data()?.data as string | undefined) ?? null), () => onData(null))
}
export const saveBackground = (uid: string, key: string, data: string) => setDoc(bgDoc(uid, key), { data })
export const removeBackground = (uid: string, key: string) => deleteDoc(bgDoc(uid, key))
