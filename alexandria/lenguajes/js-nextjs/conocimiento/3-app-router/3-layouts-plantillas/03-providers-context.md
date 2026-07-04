# Proveedores de Contexto en Layouts

## El problema

Los layouts del App Router son **Server Components** por defecto. No pueden usar `createContext`, `useState`, `useReducer` ni hooks. Para compartir estado global (tema, autenticación, carrito) se necesita un Client Component que actúe como proveedor.

## Solución: Componente proveedor Client

Crea un componente con `'use client'` que envuelva a sus hijos con los contextos deseados, y luego insértalo en el layout (que sigue siendo Server Component).

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
```

En el root layout:

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

De este modo, el Root Layout permanece como Server Component (puede usar metadatos, fuentes, etc.) y toda la interactividad se encapsula en `<Providers>`.

## Ubicación del proveedor

- **Root Layout**: si el estado debe ser accesible en toda la aplicación (tema, autenticación global).
- **Layout anidado**: si el contexto solo atañe a una sección (por ejemplo, un carrito de compras solo en la tienda). Se puede colocar un proveedor en un layout intermedio.

```tsx
// app/(shop)/layout.tsx
import { CartProvider } from '@/contexts/CartContext'

export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
```

## Pasar datos del servidor al contexto

A veces se necesita inicializar el contexto con datos del servidor (por ejemplo, sesión del usuario). Se puede hacer de dos formas:

1. **Leer los datos en un Server Component padre y pasarlos como prop al Client Provider**.
   ```tsx
   // app/layout.tsx (Server Component)
   import { getSession } from '@/lib/auth'
   import { Providers } from './providers'
   
   export default async function RootLayout({ children }) {
     const session = await getSession()
     return (
       <html>
         <body>
           <Providers session={session}>{children}</Providers>
         </body>
       </html>
     )
   }
   ```
   ```tsx
   // providers.tsx
   'use client'
   export function Providers({ children, session }) {
     return <SessionProvider value={session}>{children}</SessionProvider>
   }
   ```
   El objeto `session` se serializa y pasa al cliente.

2. **Usar `fetch` en el cliente** dentro del proveedor (con `useEffect`), pero esto puede causar un flash de contenido no autenticado.

## Múltiples contextos y orden

El orden de los proveedores anidados importa: el más externo envuelve a los internos. Generalmente se colocan los más fundamentales afuera (tema, autenticación).

## React Server Components y límites

- Un Client Component **no puede importar** un Server Component como hijo directo; pero **sí puede recibirlo como `children`** (pasado desde un padre Server Component). Por eso el patrón funciona: `<Providers>{children}</Providers>` es un Server Component que pasa contenido de servidor (páginas, layouts) a través de `children` al Client Component.
- No puedes usar hooks dentro de Server Components; toda la lógica de estado debe estar en los Client Components.

## Buenas prácticas

- Mantén los proveedores ligeros para no incrementar el JavaScript del cliente.
- Si un contexto solo se necesita en una pequeña parte de la app, no lo incluyas en el root layout; colócalo en un layout más profundo.
- Tipa adecuadamente los valores de contexto con TypeScript.

## Ejemplo avanzado: Tema con cookies

Para temas que dependen de cookies (ej. `next-themes`), el proveedor ya es un Client Component y maneja la hidratación automáticamente. Se integra sin problemas en `Providers`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Layouts vs. Templates](02-layout-vs-template.md) | [🏠 Inicio](../../index.md) | [El Layout Raíz ▶](04-root-layout.md) |
