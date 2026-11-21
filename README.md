# Cherry Perfumería

Boutique digital de fragancias construida con React, TypeScript, Tailwind, GSAP y Supabase.

## Desarrollo

```bash
npm install
npm run dev
```

Sin variables de entorno, la app abre en modo demo. El catálogo y el panel administrativo usan `localStorage`, y `/admin` permite probar CRUD, publicación e inventario sin credenciales.

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/202611200001_initial_schema.sql`.
3. Copia `.env.example` a `.env` y completa la URL y anon key.
4. Crea el primer usuario en Auth y cambia su fila de `profiles.role` a `admin` desde el SQL Editor.

La migración incluye RLS para catálogo público, datos privados por usuario y operaciones administrativas verificadas en PostgreSQL. Nunca uses la service role key en Vite.

## Verificación

```bash
npm run typecheck
npm test
npm run build
```
