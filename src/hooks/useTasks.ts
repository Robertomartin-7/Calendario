import { useEffect, useState } from 'react'
import { subscribeTasks } from '../firebase/db'
import type { Task } from '../types'

export function useTasks(uid: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(
    () => subscribeTasks(uid, setTasks, () => setError('No se pudieron cargar las tareas.')),
    [uid],
  )
  return { tasks, error }
}
