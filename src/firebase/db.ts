import {
  addDoc, arrayUnion, collection, deleteDoc, deleteField, doc, onSnapshot, updateDoc,
} from 'firebase/firestore'
import type { Task, TaskInput } from '../types'
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
