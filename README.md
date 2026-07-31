# BAILA MORENA — Proyecto completo (Next.js + Supabase)

Esta es la versión completa del sitio: base de datos real en la nube, fotos y videos
que se suben de verdad (a Supabase Storage), y un login real para el panel de admin.

## Qué ya está hecho

- ✅ Base de datos creada en Supabase (tablas + seguridad).
- ✅ Proyecto Next.js conectado a esa base de datos.
- ✅ Sitio público (`/`) que lee todo el contenido desde Supabase.
- ✅ Panel de admin (`/admin`) con login real, protegido para que solo vos puedas editar.
- ✅ Carga de fotos con guardado automático en la nube (flyer, mapa de mesas, hasta 6 fotos por edición de galería, miniaturas de video).

## Paso 1 — Probarlo en tu compu (opcional pero recomendado)

Necesitás tener [Node.js](https://nodejs.org) instalado (versión 18 o superior).

1. Abrí una terminal en esta carpeta.
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Creá un archivo llamado `.env.local` en esta misma carpeta con el contenido que aparece en `env-example.txt`.
4. Corré el proyecto:
   ```bash
   npm run dev
   ```
5. Abrí http://localhost:3000 para ver el sitio, y http://localhost:3000/admin para el panel de admin (te va a pedir el email y contraseña que creaste en Supabase → Authentication → Users).

## Paso 2 — Subir a GitHub

1. Creá un repositorio nuevo en github.com/new (ej: `baila-morena-app`).
2. En la terminal, dentro de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Primer deploy — versión completa con Supabase"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/baila-morena-app.git
   git push -u origin main
   ```

   *(El archivo `.env.local` con tus claves NO se sube a GitHub — está protegido automáticamente por el `.gitignore`. Es intencional, así nadie más lo ve.)*

## Paso 3 — Deploy en Vercel

1. Entrá a vercel.com, logueate con GitHub.
2. **"Add New... → Project"** → elegí el repo `baila-morena-app`.
3. Antes de tocar "Deploy", abrí **"Environment Variables"** y agregá las dos variables de `env-example.txt`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Tocá **Deploy**.
5. En un par de minutos tenés tu link público, con todo funcionando: sitio + admin + base de datos.

## Cómo se actualiza después

Con esta versión, **no hace falta que vuelvas a hacer `git push` para cambiar contenido** (textos, fotos, precios, FAQ, etc.) — eso se edita directo desde `/admin` y queda guardado al toque en la base de datos.

Sí vas a necesitar hacer `git push` si en el futuro pedís cambios de **diseño** (colores, estructura, secciones nuevas) — esos sí son cambios de código.

## Estructura del proyecto

```
src/
  app/
    page.tsx              → sitio público
    admin/
      login/page.tsx      → login del admin
      dashboard/page.tsx  → panel de administración
    globals.css            → todos los estilos
  components/
    PublicSite.tsx         → toda la interfaz del sitio público
    AdminDashboard.tsx      → toda la interfaz del panel admin
  lib/
    supabase/               → conexión con Supabase (cliente, servidor, sesión)
    queries.ts               → funciones que leen los datos del sitio
    uploadImage.ts            → sube y comprime fotos a Supabase Storage
    types.ts                   → tipos de datos
supabase-schema.sql            → el script SQL que ya corriste en Supabase
```

## Si algo no funciona

- **"No se pudo iniciar sesión"** → verificá que el usuario existe en Supabase → Authentication → Users, y que el email/contraseña son correctos.
- **Las fotos no se suben** → verificá que el bucket `media` existe en Supabase → Storage y que está marcado como "Public bucket".
- **El sitio no muestra nada** → revisá que las dos variables de entorno estén bien cargadas en Vercel (Settings → Environment Variables) y que coincidan exactamente con las de tu proyecto de Supabase.
