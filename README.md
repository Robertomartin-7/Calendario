# Calendario de Marina

App web personal de tareas con vista de calendario mensual (React + TypeScript + Vite + Tailwind, Firebase, PWA). Interfaz en español.
Reglas del proyecto en `CLAUDE.md`; requisitos en `docs/especificacion.md`.

## Instalación local
Requisitos: Node 20+ y npm.
```bash
npm install
cp .env.example .env.local   # rellena con los valores de tu proyecto de Firebase
npm run dev                  # http://localhost:5173
npm test
```

## Crear el proyecto de Firebase (paso a paso)
1. Entra en <https://console.firebase.google.com> → **Agregar proyecto** (puedes desactivar Google Analytics).
2. **Compilación → Authentication → Comenzar**. En *Método de acceso* activa **Google** y **Correo electrónico/contraseña**.
3. **Compilación → Firestore Database → Crear base de datos** (modo producción; elige una región europea, p. ej. `eur3`).
4. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra la app y copia la configuración del SDK a `.env.local` (mismos nombres que en `.env.example`).
5. **Authentication → Configuración → Dominios autorizados**: añade el dominio de Hosting (`<proyecto>.web.app` se añade solo; añade también cualquier dominio propio).
6. Instala e inicia sesión en la CLI y enlaza el proyecto:
   ```bash
   npx firebase login
   npx firebase use --add     # elige tu proyecto
   ```
7. Publica las reglas de seguridad: `npx firebase deploy --only firestore:rules`.

Los secretos no se suben: `.env.local` está en `.gitignore`. (La configuración web de Firebase no es secreta, pero se mantiene fuera del repo por orden.)

## Despliegue en Firebase Hosting
```bash
npm run deploy    # build + firebase deploy (Hosting y reglas)
```
> Inicio de sesión con Google en Safari: mantén `VITE_FIREBASE_AUTH_DOMAIN` igual al dominio de Hosting para evitar los bloqueos de cookies de terceros.

## Instalar la PWA
- **iPhone (Safari):** abre la URL → botón **Compartir** → **Añadir a pantalla de inicio**.
- **Chromebook (Chrome):** abre la URL → icono de instalar en la barra de direcciones (o menú ⋮ → **Instalar Calendario de Marina**).

## Emuladores (opcional)
`npm run emulators` y `VITE_USE_EMULATORS=true` en `.env.local`. Requiere **Java 21 o superior**.

## Administrar los datos (Roberto)
No hay panel propio. En la consola de Firebase:
- **Authentication → Usuarios:** ver o eliminar la cuenta de Marina.
- **Firestore Database → Datos:** `users/{uid}/tasks`, `events` y `settings/main`. Se puede editar, crear o borrar documentos a mano.

## Scripts
`dev` · `build` · `test` · `emulators` · `deploy` · `node scripts-icons.mjs` (regenera iconos PWA).
