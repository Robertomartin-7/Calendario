# Calendario de Marina — reglas del proyecto

App web personal (una sola usuaria) de tareas con vista de calendario mensual. iPhone (Safari) + Chromebook (Chrome), mismos datos. Toda la interfaz en español (es‑ES). Manda `docs/especificacion.md` en comportamiento y `docs/boceto-pantalla-principal.png` en lo visual (sin horas, con eventos, con selector Día|Semana|Mes).

## Stack
React + TypeScript + Vite + Tailwind v4 · date-fns (es) · Firebase Auth + Firestore + Hosting · vite-plugin-pwa · Vitest.

## Alcance
Tareas (título, descripción, prioridad, repetición, varios días) y eventos (nombre, fecha, repetición anual, emoji). Vistas Mes, Semana y Día. No añadir nada que no esté pedido; ante la duda, lo más simple.

## Fuera de alcance (NO implementar)
Compartir · avisos/notificaciones/recordatorios · horas · asignaturas/categorías · historial de hechas · lugar/enlace · adjuntos · duplicar · papelera · búsqueda/filtros · hábitos · cuenta atrás · importar/exportar · modo oscuro · modo offline como requisito.

## Reglas de datos
- Días como texto `"YYYY-MM-DD"` (sin hora ni zona horaria). Usar `src/lib/dates.ts`.
- Datos en `users/{uid}/{tasks,events,settings}`. Las repeticiones se calculan al vuelo; nunca guardar copias por ocurrencia.
- Completar una tarea la borra para siempre (sin confirmar ni deshacer). En series: añade la fecha a `skippedDates`.
- Títulos duplicados permitidos.

## Estilo
- Paleta y tokens en `src/styles/index.css` (`@theme`). Fuentes: Fraunces (títulos) y DM Sans. Nunca Times New Roman, Calibri, Arial ni Inter.
- Tarjetas blancas redondeadas sobre fondo pastel; zonas táctiles ≥ 44 px; transiciones 150–250 ms.
- iOS: `viewport-fit=cover`, safe-area, `100dvh`, campos de ≥ 16 px.

## Comandos
- `npm run dev` — servidor local (necesita `.env.local`, ver `.env.example`)
- `npm test` — Vitest (lógica de calendario y repetición)
- `npm run build` — tipos + build de producción
- `npm run emulators` — emuladores de Auth/Firestore (requiere Java 21+)
- `npm run deploy` — build + `firebase deploy`
- `node scripts-icons.mjs` — regenera iconos PWA desde `public/favicon.svg`

## Flujo
Trabajo por fases; al cerrar cada una: ejecutar, tests, commit y lista de pruebas para iPhone y Chromebook.
