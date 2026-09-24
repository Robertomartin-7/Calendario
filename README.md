# Calendario de Marina

App web personal de tareas con vista de calendario mensual, pensada para Marina (estudiante de higiene bucodental). Un solo usuario, mismas tareas en iPhone (Safari) y Chromebook (Chrome). Interfaz en español.

**Producción:** <https://calendario-marina.web.app> · **Reglas del proyecto:** `CLAUDE.md` · **Requisitos:** `docs/especificacion.md` · **Criterios de aceptación:** `docs/criterios-de-aceptacion.md`

## Qué hace
- **Vistas Mes (principal), Semana y Día**, con botón curvado para cambiar, botón **Hoy**, flechas, deslizar y selector de mes y año (tocar el título).
- **Tareas:** título, descripción opcional, prioridad (Alta/Media/Baja con puntos rojo, amarillo y verde), varios días y repetición (diaria, semanal, mensual, anual, «cada N», con fecha de fin). Se crean en 3 toques.
- **Completar = borrar para siempre**, sin historial ni deshacer. En una serie repetitiva solo cae esa ocurrencia; «Borrar toda la serie» está en la edición.
- **Eventos** (cumpleaños, etc.): nombre, fecha, repetición anual y emoticono opcional; salen destacados en la lista y con su emoticono en el calendario.
- **Extras:** texto de cabecera editable, foto de fondo distinta por mes, decoración dental sutil y mensajes motivacionales en los días sin tareas.
- **PWA instalable**, sesión persistente y sincronización en tiempo real entre dispositivos.

No incluye (por decisión): avisos o notificaciones, horas, categorías, historial, compartir, papelera, búsqueda, importar/exportar, modo oscuro ni vista imprimible.

## Instalación local
Requisitos: Node 20 o superior y npm.
```bash
npm install
cp .env.example .env.local   # rellena los valores de tu proyecto de Firebase (ver más abajo)
npm run dev                  # http://localhost:5173
npm test                     # tests de calendario, repetición, eventos, navegación…
npm run build                # comprobación de tipos + build de producción
```

## Crear el proyecto de Firebase (paso a paso)
1. Entra en <https://console.firebase.google.com> → **Agregar proyecto** (Google Analytics se puede desactivar).
2. **Compilación → Authentication → Comenzar** (este botón es imprescindible; sin él, el login falla con `CONFIGURATION_NOT_FOUND`). En *Método de acceso* activa **Google** y **Correo electrónico/contraseña**.
3. **Compilación → Firestore Database → Crear base de datos**: edición Standard, ID `(default)`, región europea (p. ej. `eur3`) y modo producción.
4. **Configuración del proyecto → General → Tus apps → Web (`</>`)**: registra la app (sin Hosting) y copia la configuración a `.env.local`.
5. En **Authentication → Configuración → Dominios autorizados** comprueba que está `<proyecto>.web.app` (se añade solo) y cualquier dominio propio.
6. Inicia sesión en la CLI y enlaza el proyecto:
   ```bash
   npx firebase login
   npx firebase use --add        # o edita .firebaserc
   ```
7. Publica las reglas de seguridad: `npx firebase deploy --only firestore:rules`.

Se usa solo la capa gratuita (plan Spark): Authentication, Firestore y Hosting. **No actives el plan Blaze.**

### Variables de entorno
Se leen de `.env.local` (ignorado por git). La plantilla es `.env.example`:

| Variable | De dónde sale |
|---|---|
| `VITE_FIREBASE_API_KEY`, `..._AUTH_DOMAIN`, `..._PROJECT_ID`, `..._STORAGE_BUCKET`, `..._MESSAGING_SENDER_ID`, `..._APP_ID` | Configuración del SDK web (paso 4) |
| `VITE_USE_EMULATORS` | `true` para usar los emuladores locales (requiere Java 21+); por defecto `false` |

La configuración web de Firebase no es un secreto (la protección real son las reglas de Firestore), pero se mantiene fuera del repositorio. **Las variables se incorporan al compilar**: tras cambiarlas hay que volver a ejecutar `npm run build`.

## Despliegue en Firebase Hosting
```bash
npm run deploy     # build + firebase deploy (Hosting y reglas)
```
Solo Hosting: `npm run build && npx firebase deploy --only hosting`. El service worker se actualiza solo: la primera vez que se abre la app tras un despliegue puede verse la versión anterior; al cerrar y reabrir aparece la nueva.

## Instalar la PWA
- **iPhone (Safari):** abre la URL → botón **Compartir** → **Añadir a pantalla de inicio**.
- **Chromebook (Chrome):** abre la URL → icono de instalar en la barra de direcciones (o menú ⋮ → **Instalar Calendario de Marina**).

La sesión se mantiene: se entra una sola vez por dispositivo. En iPhone conviene iniciar sesión desde la app instalada (o probar el login con Google antes de instalarla); si Google diera problemas, el correo y contraseña sirve como alternativa.

## Administrar los datos (Roberto)
No hay panel propio; todo se gestiona desde la consola de Firebase:
- **Authentication → Usuarios:** ver, deshabilitar o eliminar la cuenta de Marina, o restablecer su contraseña.
- **Firestore Database → Datos:** cada usuario tiene su árbol `users/{uid}/…`:

| Colección | Contenido |
|---|---|
| `tasks` | `title`, `description`, `date` («AAAA-MM-DD»), `endDate?`, `priority` (`alta`/`media`/`baja`), `recurrence` (`null` o `{freq, interval, until}`), `skippedDates` (ocurrencias completadas de una serie), `createdAt` |
| `events` | `name`, `date`, `repeatsYearly`, `emoji?` |
| `settings/main` | `headerText` (texto pequeño de la cabecera) |
| `backgrounds/AAAA-MM` | `data`: foto de fondo de ese mes (JPEG en base64) |

Los días se guardan como texto, sin hora ni zona horaria. Las repeticiones no se guardan por ocurrencia: se calculan desde la regla. Se puede crear, editar o borrar cualquier documento a mano.

**Seguridad:** `firestore.rules` permite leer y escribir solo a quien tenga `uid` igual al del documento. Cualquier otra petición recibe `PERMISSION_DENIED`.

## Estructura
```
src/
  firebase/   config, auth y acceso a Firestore (db.ts)
  lib/        lógica pura y probada: calendar, recurrence, events, navigation, messages, image, dates
  hooks/      useAuth, useTasks, useEvents, useSettings, useBackground, useToday, useSwipe
  components/ Header, MonthGrid, TaskList, TaskRow, EventCard, hojas (TaskSheet, EventSheet…), etc.
  views/      CalendarView (estado y hojas), MonthView, WeekView, DayView
  styles/     index.css (paleta y tokens con @theme de Tailwind)
docs/         especificación, boceto y criterios de aceptación
```

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm test` | Tests (Vitest) |
| `npm run build` | Tipos + build de producción |
| `npm run emulators` | Emuladores de Auth y Firestore (Java 21+) |
| `npm run deploy` | Build + despliegue |
| `node scripts-icons.mjs` | Regenera los iconos PWA desde `public/favicon.svg` |

## Problemas frecuentes
- **«No se pudo iniciar sesión (auth/configuration-not-found)»**: falta pulsar *Comenzar* en Authentication.
- **`auth/unauthorized-domain`**: añade el dominio en *Authentication → Configuración → Dominios autorizados*.
- **Pantalla «Falta configurar Firebase»**: falta `.env.local` (o hay que recompilar tras crearlo).
- **No se ve un cambio recién desplegado**: cierra y vuelve a abrir la app (service worker).
- **Los emuladores no arrancan**: necesitan Java 21 o superior.
