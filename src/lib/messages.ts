import { differenceInCalendarDays } from 'date-fns'
import { fromDay, type DayString } from './dates'

/** Mensajes para los días sin nada pendiente. */
export const MESSAGES: string[] = [
  'Nada pendiente hoy. ¡Respira!',
  'Hoy no toca nada, y eso también es un logro.',
  'Descansar también es avanzar.',
  'Tu única misión de hoy: sonreír.',
  'Lo estás haciendo mejor de lo que crees.',
  'Cuida de ti como cuidas de tus pacientes.',
  'Un día tranquilo también forma parte del plan.',
  'Poquito a poco, se llega muy lejos.',
  'Hoy la agenda respira. Tú también.',
  'Nada que hacer y mucho que disfrutar.',
  'Eres más capaz de lo que piensas.',
  'Un día libre: perfecto para hacer algo que te guste.',
  'Todo a su tiempo. Hoy, el tiempo es para ti.',
  'Sonríe, que hoy vas sobrada de tiempo.',
  'Menos listas y más vida.',
  'Cada día libre es un regalo. Ábrelo con calma.',
  'Respira hondo: ya has llegado hasta aquí.',
  'Hoy manda la calma.',
  'Tu mejor versión también descansa.',
  'Un buen día empieza con una buena sonrisa.',
  'Hoy no hay prisa, y lo bueno se hace esperar.',
  'Un día en blanco. ¿Qué vas a dibujar en él?',
  'Sé amable contigo misma. Hoy toca.',
  'Tu futuro yo te dará las gracias por este descanso.',
  'Los grandes profesionales también se toman un respiro.',
  'Hoy, brilla sin prisas.',
  'Lo que hoy no está en la lista también cuenta.',
  'Estudiar es sembrar; hoy toca regar con calma.',
  'Confía en el proceso. Vas por buen camino.',
]

// 7 y el número de mensajes no comparten divisores: días seguidos nunca repiten mensaje.
const STEP = 7
const EPOCH = new Date(2000, 0, 1)

const dayNumber = (day: DayString) => differenceInCalendarDays(fromDay(day), EPOCH)
const mod = (n: number, m: number) => ((n % m) + m) % m

/** Mensaje fijo para cada día: siempre el mismo ese día, y distinto del día siguiente. */
export const messageForDay = (day: DayString): string => MESSAGES[mod(dayNumber(day) * STEP, MESSAGES.length)]

/** Icono de decoración (0 = diente, 1 = cepillo, 2 = sonrisa) que rota por días. */
export const iconForDay = (day: DayString): 0 | 1 | 2 => mod(dayNumber(day), 3) as 0 | 1 | 2
