# Especificación de requisitos — Calendario mensual de tareas

Transcripción resumida de la especificación original (PDF, 23‑sep‑2026, @Roberto). Cliente: Marina Álvarez Garcia (estudiante de higiene bucodental, uso individual). Desarrollador: Roberto Martín Carmona.

## 1. Alcance
Sustituye los calendarios de papel: ver el mes de un vistazo y apuntar/quitar tareas rápido.
**Fuera de alcance:** compartir, avisos/notificaciones/recordatorios, horas, clasificar por asignatura u horario, guardar tareas hechas, lugar y enlace.
**No solicitado:** adjuntos, duplicar, papelera, búsqueda y filtros, hábitos, cuenta atrás, importar/exportar, modo oscuro.

## 2. Requisitos funcionales
| ID | El sistema deberá… | Prio |
|---|---|---|
| RF-01 | Mostrar el mes en cuadrícula, semana de lunes a domingo (L M X J V S D), días de otros meses atenuados | Must |
| RF-02 | Mostrar en cada día un punto de color por cada tarea pendiente, según prioridad | Must |
| RF-03 | Navegar entre meses con flechas, deslizando y con selector de mes y año | Must |
| RF-04 | Botón "Hoy" que vuelva al mes actual y resaltar hoy | Should |
| RF-05 | Vistas Día, Semana y Mes con botón sencillo y curvado; Mes principal | Should |
| RF-06 | Vista Día: día elegido (p. ej. 15 de mayo) con todas sus tareas en grande, con título y descripción | Should |
| RF-07 | Crear tarea con título y fecha, sin hora, en 3 toques o menos, aunque exista otra con el mismo título | Must |
| RF-08 | Descripción u observaciones (sin lugar ni enlace) | Must |
| RF-09 | Prioridad Alta, Media o Baja con semáforo pastel | Must |
| RF-10 | Eliminar la tarea para siempre al marcarla como hecha, sin historial ni deshacer | Must |
| RF-11 | Tarea repetitiva (semanal, cada dos semanas u otra) con fecha de inicio y de fin | Must |
| RF-12 | Editar y borrar tareas | Should |
| RF-13 | Tareas que abarquen varios días | Should |
| RF-14 | Lista "Por terminar" junto al calendario con contador y "+ Nueva"; solo tareas y eventos del día pulsado, solo título | Should |
| RF-15 | Cuenta con inicio de sesión lo más sencillo posible | Must |
| RF-16 | Sincronizar entre iPhone y Chromebook | Must |
| RF-17 | Acceso de administración para Roberto | Should |
| RF-18 | Foto de fondo distinta cada mes | Could |
| RF-19 | Decoración de temática dental | Could |
| RF-20 | Vista imprimible del mes (se descarta si complica) | Could |
| RF-21 | Cambiar el texto de la cabecera (por defecto "Higiene bucodental") | Could |
| RF-22 | Eventos (cumpleaños…) con nombre y fecha; se elige si se repiten y un emoticono opcional que sale en el día, se repita o no | Should |
| RF-23 | Eventos en la lista del día, destacados, más decorados, en pastel | Should |

## 3–4. No funcionales y restricciones
RNF‑01 máx. 3 toques · RNF‑02 comprensible a la primera · RNF‑03 sin esperas (propuesta < 2 s) · RNF‑04 iPhone 17 Pro Max Safari y Chromebook Chrome · RNF‑05 interfaz en español · RNF‑06 sin internet no es primordial · RNF‑07/08/09 sin exigencias de seguridad, fiabilidad ni accesibilidad · RES‑02 una sola entrega · RES‑04 sin historial de tareas hechas · RES‑07 un único usuario.

## 5. Interfaz y estilo
Minimalista, pocas pantallas, tonos pastel, semáforo pastel, tipografía sencilla pero no común (ni Times New Roman ni Calibri), animaciones suaves, foto de fondo mensual y decoración dental opcionales.
Pantalla principal: cabecera (texto editable, mes y año, flechas), cuadrícula con hoy resaltado y puntos, píldora Día/Semana/Mes, leyenda Alta/Media/Baja, lista "Por terminar" con contador, "+ Nueva" y círculo por tarea; eventos destacados.

## 6. Criterios de aceptación
- **CA-01** Al abrir se ve el mes actual con hoy resaltado y un punto por cada tarea pendiente de cada día.
- **CA-02** Las flechas muestran el mes anterior o siguiente.
- **CA-03** Crear tarea con título y fecha cuesta ≤ 3 toques y aparece un punto en ese día.
- **CA-04** La descripción guardada se muestra al abrir la tarea.
- **CA-05** Prioridad Alta/Media/Baja → punto rojo/amarillo/verde.
- **CA-06** Marcar como hecha elimina la tarea y no aparece en ninguna parte.
- **CA-07** Tarea semanal con inicio y fin aparece cada semana entre esas fechas y no fuera.
- **CA-08** Tarea creada en el iPhone aparece en el Chromebook con la misma cuenta.

## 7. Dudas resueltas (resumen)
Se permiten títulos repetidos · "Por terminar" = solo el día pulsado, solo títulos · atrasadas sin aviso, siguen en su día · vista Día con descripciones · cabecera editable · acceso a vistas con botón píldora · completar elimina para siempre (sin deshacer) · eventos aparte de las tareas, en la lista, destacados, emoticono opcional en cualquier evento · en Mes, pulsar un día actualiza la lista de abajo con títulos; la vista Día muestra título y descripción.
