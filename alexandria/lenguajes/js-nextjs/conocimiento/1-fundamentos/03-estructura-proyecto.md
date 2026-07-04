# Estructura proyecto

## Organización típica de un proyecto Next.js

Al crear un proyecto con `create-next-app`, se obtiene una estructura básica que puede adaptarse según las necesidades. A continuación se desglosa cada carpeta y archivo importante, tanto para Pages Router como para App Router.

## Carpeta raíz

```
mi-app/
├── app/                    # App Router (si se eligió)
├── pages/                  # Pages Router (si existe)
├── public/                 # Archivos estáticos
├── styles/                 # Hojas de estilo globales
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades, lógica de negocio
├── hooks/                  # Custom hooks
├── types/                  # Tipos TypeScript
├── next.config.js          # Configuración principal de Next.js
├── package.json
├── tsconfig.json           # Configuración de TypeScript
├── .env.local              # Variables de entorno locales
├── .env.production
└── middleware.ts           # Middleware global (App Router)
```

## Directorios clave en detalle

### `public/`

Contiene archivos servidos estáticamente, como imágenes, fuentes, `robots.txt`, `sitemap.xml`. Se accede a ellos desde la raíz del dominio: `/logo.png` → `public/logo.png`. Next.js no procesa estos archivos; los sirve directamente.

### `pages/` (Pages Router)

Cada archivo `.js`, `.tsx` se convierte en una ruta. Archivos especiales:

- `_app.tsx` – Componente que envuelve todas las páginas.
- `_document.tsx` – Personaliza el HTML base.
- `_error.tsx` – Página de error genérica.
- `404.tsx` – Página de error 404.
- `api/` – API Routes.

### `app/` (App Router)

Estructura basada en carpetas con archivos especiales:

- `layout.tsx` – Layout persistente.
- `page.tsx` – Contenido de la ruta.
- `loading.tsx` – Pantalla de carga.
- `error.tsx` – Boundary de error.
- `not-found.tsx` – 404 a nivel de segmento.
- `template.tsx` – Layout que se recrea en cada navegación.
- `route.ts` – Route Handler (API).
- `default.tsx` – Fallback para slots paralelos.

Subcarpetas como `(groups)` para agrupación sin afectar la URL, `@slots` para rutas paralelas, y `[param]` para dinámicas.

### `styles/`

Puede contener:

- Archivos CSS globales (importados en `_app.tsx` o `layout.tsx`).
- Módulos CSS (`.module.css`) para estilos con alcance local.
- Archivos de preprocesadores (Sass, Less).

### `components/`

Componentes React reutilizables, tanto de servidor como de cliente. Se recomienda organizarlos por dominio o tipo (UI, layout, etc.).

### `lib/` o `utils/`

Funciones compartidas, clientes de API, definiciones de caché, configuración de bases de datos. Es común tener un archivo `lib/data.ts` que contenga todas las funciones de obtención de datos para Server Components.

### `hooks/`

Custom hooks de React (solo para Client Components). Por ejemplo, `useUser`, `useLocalStorage`.

### `types/`

Definiciones de tipos TypeScript globales (`*.d.ts`), interfaces compartidas.

### `middleware.ts`

Archivo en la raíz del proyecto (solo App Router). Define una función que se ejecuta antes de cada petición. Ideal para redirecciones, autenticación, feature flags.

## Archivos de configuración importantes

### `next.config.js` / `next.config.mjs`

Configuración central de Next.js. Permite:

- `reactStrictMode`: Modo estricto de React.
- `images`: Dominios remotos para optimización.
- `rewrites`, `redirects`: Modificación de rutas.
- `headers`: Cabeceras HTTP personalizadas.
- `env`: Variables de entorno públicas.
- `output`: Modo de salida (`standalone` para Docker, `export` para estático).
- `experimental`: Características experimentales como PPR, Server Actions, etc.

### `tsconfig.json`

Configuración de TypeScript. Next.js proporciona una configuración base que se puede extender. Incluye alias de rutas (`@/` → `./src/` o `./`).

### `.env*`

Archivos de entorno:

- `.env` – Cargado siempre.
- `.env.local` – Sobreescribe en desarrollo local.
- `.env.production` / `.env.development` – Por entorno.
- Variables que deben exponerse al cliente deben empezar con `NEXT_PUBLIC_`.

## Organización modular avanzada

Para proyectos grandes, se puede adoptar una estructura basada en módulos (feature‑based):

```
src/
├── app/                    # App Router
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── dashboard/
│   └── ...
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── styles/
└── lib/
```

## Convenciones de nomenclatura

- Componentes: `PascalCase` (ej. `UserProfile.tsx`).
- Utilidades y hooks: `camelCase` (ej. `useAuth.ts`, `formatDate.ts`).
- Rutas: `kebab-case` para segmentos de URL (ej. `app/user-profile/`), aunque los archivos especiales usan nombres reservados.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ React fundamentos](02-react-fundamentos.md) | [🏠 Inicio](../index.md) | [Pages vs app router ▶](04-pages-vs-app-router.md) |
