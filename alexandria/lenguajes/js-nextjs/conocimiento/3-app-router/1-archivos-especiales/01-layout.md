# El Layout Persistente

## Concepto

Un **layout** es un componente que envuelve un segmento de ruta y a todas sus páginas y layouts hijos. Se define en un archivo `layout.js` (o `.tsx`) y es el reemplazo del patrón per-page layout del Pages Router. Su principal característica: **conserva el estado entre navegaciones** dentro del mismo segmento. Next.js lo renderiza en el servidor por defecto (Server Component), pero puede convertirse en Client Component con `'use client'` si se necesita interactividad.

## Archivo obligatorio

- Todo App Router debe tener un **Root Layout** en `app/layout.js`. Define la estructura HTML base: etiquetas `<html>`, `<body>`, metadatos globales y proveedores de contexto.
- Los layouts anidados son opcionales y se definen en subcarpetas. Cada uno envuelve a su `children` y se monta sobre los layouts superiores.

## Props

Un layout recibe dos props:

- `children` (ReactNode): El contenido del segmento (página o layouts anidados).
- `params` (objeto): Los parámetros de ruta dinámica de ese segmento (no incluye los segmentos padre, solo los que están en la misma carpeta).

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { team: string } // si la carpeta es [team]
}) {
  return <section>{children}</section>
}
```

El root layout no recibe `params` porque no está asociado a una ruta dinámica; es el layout base.

## Jerarquía y anidamiento

Los layouts se apilan de afuera hacia adentro según la profundidad del sistema de archivos:

```
app/
  layout.js        → Root Layout
  dashboard/
    layout.js      → Dashboard Layout
    settings/
      layout.js    → Settings Layout
      page.js
```

En `/dashboard/settings` el árbol resultante es:
```
<RootLayout>
  <DashboardLayout>
    <SettingsLayout>
      <SettingsPage />
    </SettingsLayout>
  </DashboardLayout>
</RootLayout>
```

Al navegar de `dashboard/analytics` a `dashboard/settings`, el Dashboard Layout **no se desmonta**, solo cambia el contenido interior.

## Root Layout

Requisitos del `app/layout.js`:
- Debe definir las etiquetas `<html>` y `<body>`.
- Puede contener metadatos estáticos exportando `metadata` o usando `generateMetadata`.
- En él se importan los estilos globales (CSS, Tailwind, etc.).
- Es un Server Component por defecto. Si se necesita estado, se puede incluir un Client Component como proveedor.

```tsx
// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Mi App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

## Layouts y Contextos (Providers)

Los layouts son Server Components, por lo que no pueden usar `createContext` ni hooks. Para compartir estado global (temas, autenticación), se crea un componente Client Component que actúa como proveedor y se inserta en el layout.

```tsx
// app/providers.tsx
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
```

Luego en el root layout:

```tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

Así, el layout se mantiene como Server Component y la parte interactiva se aísla.

## Persistencia del estado

El estado de React (useState, useRef, etc.) dentro de un layout se conserva al cambiar de página dentro del mismo segmento de layout. Si se quiere reiniciar el estado en cada navegación, se debe usar `template.js` en lugar de `layout.js`.

## Datos en el layout

Al ser un Server Component, un layout puede ser asíncrono y obtener datos directamente con `fetch`.

```tsx
export default async function DashboardLayout({ children }) {
  const user = await getUser()
  return (
    <div>
      <nav>{user.name}</nav>
      <main>{children}</main>
    </div>
  )
}
```

Si se necesita revalidación, se configura en el `fetch` con `next: { revalidate: 3600 }`. Los layouts pueden exportar `revalidate` o `dynamic` para controlar su comportamiento.

## Limitaciones

- Un layout **no puede recibir `searchParams`** (parámetros de consulta). Solo las páginas pueden. Si un layout necesita datos de la query, debe obtenerlos a través de un Client Component con `useSearchParams`.
- No se puede pasar `params` de un layout padre a uno hijo a través de props; cada layout accede a sus propios `params`. Si un layout necesita información de un parámetro más arriba, debe recrear la lógica o usar `headers()`/`cookies()` (que son dinámicos).
- No puede tener tanto `layout.js` como `template.js` en el mismo segmento? En realidad sí pueden coexistir: el template envuelve al contenido y el layout envuelve al template. La jerarquía es `Layout > Template > Page`. Más detalles en `template.md`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Buenas prácticas](../../2-pages-router/6-navigation/08-buenas-practicas.md) | [🏠 Inicio](../../index.md) | [La Página ▶](02-page.md) |
