# Criterios de aceptación — resultado

Revisión final (Fase 7). «Automático» = cubierto por tests (`npm test`, `src/lib/acceptance.test.ts` y el resto). «Pantalla» = comprobado en el navegador con la interfaz real.

| ID | Criterio | Resultado | Cómo se comprobó |
|---|---|---|---|
| CA-01 | Al abrir: mes actual, hoy resaltado y un punto por tarea pendiente | **Pasa** | Automático (cuadrícula y puntos) y pantalla (hoy en círculo oscuro) |
| CA-02 | Las flechas muestran el mes anterior y el siguiente | **Pasa** | Automático (navegación) y pantalla (Septiembre ⇄ Octubre) |
| CA-03 | Crear tarea con título y fecha en ≤ 3 toques y aparece el punto | **Pasa** | Pantalla: «+ Nueva», escribir título, «Guardar» = 3 acciones; el punto aparece en el día |
| CA-04 | La descripción guardada se ve al abrir la tarea | **Pasa** | Pantalla (edición y vista Día) |
| CA-05 | Alta/Media/Baja = punto rojo/amarillo/verde | **Pasa** | Automático (mapa de colores) y pantalla |
| CA-06 | Marcar como hecha elimina la tarea y no aparece en ninguna parte | **Pasa** | Pantalla (desaparece de calendario y listas) y automático (ocurrencias de series) |
| CA-07 | Tarea semanal con inicio y fin: cada semana entre esas fechas y no fuera | **Pasa** | Automático (`recurrence.test.ts`, incluido el día de fin inclusive) |
| CA-08 | Tarea creada en un dispositivo aparece en el otro con la misma cuenta | **Pasa** | Pruebas de Roberto en iPhone y Chromebook al cerrar las fases 2 a 6 (sincronización en tiempo real con Firestore) |

## Criterios «Extra» del encargo
- Al pulsar un día en Mes, la lista muestra solo los títulos de sus tareas y eventos: **pasa** (pantalla).
- La vista Día muestra título y descripción: **pasa** (pantalla).
- Un evento con emoticono lo muestra en su día y en la lista, destacado: **pasa** (pantalla).
- Se pueden tener títulos repetidos: **pasa** (test de `tasksOnDay`).

## Otros controles
- Reglas de Firestore: una petición sin sesión a `users/{uid}/tasks` devuelve `PERMISSION_DENIED` (comprobado contra producción).
- Consola del navegador sin errores en la pasada de humo.
- iOS: safe-area, `100dvh` y campos de 16 px en el código; el comportamiento real (sin zoom, teclado) lo valida Roberto en el iPhone.
- Rendimiento: 273 KB de JavaScript comprimido; con sesión iniciada y la caché de Firestore el mes se pinta al abrir. La medida de < 2 s en el iPhone real queda para la prueba manual.
