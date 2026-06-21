# Patrones de Composición Server/Client

El App Router introduce una nueva mentalidad para estructurar aplicaciones. Aquí se detallan los patrones esenciales para mezclar Server y Client Components de manera eficiente.

## 1. Server Components como base, Client Components en las hojas

La estrategia óptima: mantén la estructura principal (layouts, listas) como Server Components, y convierte solo los elementos interactivos (botones, formularios, animaciones) en Client Components.

```
<ServerLayout>
  <ServerSidebar>
    <ClientSearchBar />     ← Client Component para input
  </ServerSidebar>
  <ServerMainContent>
    <ClientLikeButton />    ← Client Component para interactividad
  </ServerMainContent>
</ServerLayout>
```

## 2. Pasar Server Components a Client Components vía `children`

Un Client Component **no puede importar** un Server Component directamente, pero **sí puede recibirlo como `children`** desde un Server Component padre. El Server Component renderiza el Client Component y le pasa contenido del servidor como `children`.

```tsx
// app/page.tsx (Server Component)
import ClientWrapper from './ClientWrapper'
import ServerContent from './ServerContent'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* Pasa un Server Component como children */}
    </ClientWrapper>
  )
}
```

```tsx
// app/ClientWrapper.tsx
'use client'
export default function ClientWrapper({ children }) {
  return <div className="client-border">{children}</div>
}
```

`ServerContent` se renderiza en el servidor y su resultado se inyecta en `children`. Así, el Client Component solo envuelve la parte ya renderizada.

## 3. Proveedores de contexto con envoltura Client

Para usar React Context (tema, autenticación, carrito), necesitas un Client Component proveedor. Se coloca en el layout sin convertir todo el layout a `'use client'`:

```tsx
// app/providers.tsx
'use client'
export function Providers({ children }) {
  return <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>
}
```

```tsx
// app/layout.tsx (Server Component)
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

## 4. Fetching en Server Component, pasar datos a Client Component

Obtén los datos en un Server Component y pásalos como props a un Client Component hijo. Las props deben ser serializables.

```tsx
// app/dashboard/page.tsx (Server Component)
import ClientChart from './ClientChart'

export default async function Dashboard() {
  const data = await fetch('https://...').then(res => res.json())
  return <ClientChart data={data} />
}
```

```tsx
// app/dashboard/ClientChart.tsx
'use client'
export default function ClientChart({ data }) {
  // usar data para renderizar un gráfico interactivo con recharts, por ejemplo
  return <AreaChart data={data} />
}
```

## 5. Streaming con Suspense y Server Components

Envuelve Server Components asíncronos en `<Suspense>` para mostrar fallbacks mientras se cargan. Esto se hace desde un Server Component padre.

```tsx
import { Suspense } from 'react'
import HeavyComponent from './HeavyComponent'

export default function Page() {
  return (
    <div>
      <h1>Título inmediato</h1>
      <Suspense fallback={<p>Cargando contenido pesado...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  )
}
```

## 6. Server Actions para mutaciones desde Client Components

Las Server Actions permiten ejecutar lógica del servidor desde un Client Component sin exponer endpoints. Se definen con `'use server'` y se invocan como funciones.

```tsx
// app/actions.ts
'use server'
export async function addTodo(formData: FormData) {
  // acceso directo a BD
}
```

```tsx
// app/TodoForm.tsx
'use client'
import { addTodo } from './actions'

export function TodoForm() {
  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">Añadir</button>
    </form>
  )
}
```

## 7. Mover el estado hacia abajo (Push state down)

Si una página tiene una pequeña parte con estado, crea un Client Component para esa parte y mantén el resto en el servidor.

```tsx
// app/products/page.tsx
import FilterPanel from './FilterPanel'  // Client Component

export default async function Products() {
  const products = await fetch('...').then(res => res.json())
  return (
    <div>
      <FilterPanel />
      <ProductList products={products} />
    </div>
  )
}
```

## 8. Uso de librerías de terceros que requieren `'use client'`

La mayoría de las librerías de UI stateful (modales, date pickers) necesitan un Client Component. Crea un wrapper.

```tsx
// app/components/ModalWrapper.tsx
'use client'
import { Dialog } from '@headlessui/react'
export function ModalWrapper({ children }) { ... }
```

Importa el wrapper en tu Server Component.

## 9. Compartir código entre servidor y cliente

A veces necesitas una función que se ejecute en ambos. Separa la lógica en archivos sin `'use client'` (para que pueda ser importada por ambos) y evita usar APIs del servidor o del cliente. Para utilidades puras es sencillo.

## 10. Error Boundaries con `error.js`

Los archivos `error.js` deben ser Client Components porque reciben el error y la función `reset`. Encapsulan la lógica de captura de errores en el cliente.

## Resumen visual de dependencias

```
Server Component (puede importar) → Client Component
Server Component → (puede pasar como children a) → Client Component
Client Component → NO puede importar directamente → Server Component
```

Estos patrones son la clave para construir aplicaciones robustas, rápidas y mantenibles.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componentes de Cliente en el App Router](02-client-components.md) | [🏠 Inicio](../index.md) | [Server Actions: Puente entre Cliente y Servidor ▶](04-server-actions.md) |
