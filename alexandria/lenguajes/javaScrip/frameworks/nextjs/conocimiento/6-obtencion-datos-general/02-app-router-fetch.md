# Obtención de datos en el App Router

En el App Router, la obtención de datos se integra directamente en los **Server Components** mediante `async/await` y el `fetch` nativo extendido por Next.js.

## 1. Fetch extendido

Next.js amplía la API `fetch` para cachear y deduplicar automáticamente las peticiones en el servidor.

```tsx
// Server Component
export default async function Page() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return <pre>{JSON.stringify(data)}</pre>
}
```

Por defecto, el fetch usa `cache: 'force-cache'`, cacheando la respuesta de forma persistente (equivalente a SSG). La caché se comparte entre peticiones.

### Opciones de cacheo en `fetch`

```tsx
const res = await fetch(url, {
  cache: 'force-cache',            // Por defecto. Cache persistente.
  next: { revalidate: 3600 },      // ISR: revalidar cada 3600s
})

const res = await fetch(url, {
  cache: 'no-store',               // Desactiva la caché → SSR
})
```

También se pueden asignar **etiquetas** para revalidación bajo demanda:

```tsx
const res = await fetch(url, { next: { tags: ['products'] } })
```

## 2. Componentes asíncronos

Los layouts y páginas pueden ser funciones `async` que esperan datos directamente:

```tsx
export default async function DashboardLayout({ children }) {
  const user = await getUser()
  return <div>{user.name}{children}</div>
}
```

## 3. Deduplicación de peticiones

Si varios componentes en el mismo renderizado hacen fetch a la misma URL, Next.js **deduplica** automáticamente, realizando una sola petición real.

## 4. Generación estática con `generateStaticParams`

Reemplaza a `getStaticPaths`. Se exporta desde la página dinámica.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('...').then(res => res.json())
  return posts.map(post => ({ slug: post.slug }))
}
```

- Por defecto, `dynamicParams = true` permite generar rutas no incluidas bajo demanda.
- Si `dynamicParams = false`, devuelve 404.

## 5. Fetching paralelo y secuencial

- **Secuencial**: un `await` tras otro.
- **Paralelo**: iniciar todas las promesas y luego esperarlas con `Promise.all`.

```tsx
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
])
```

## 6. Streaming y Suspense

Se puede envolver un componente asíncrono con `<Suspense>` para mostrar un fallback mientras se esperan los datos, permitiendo que el resto de la página se envíe mediante streaming.

```tsx
import { Suspense } from 'react'
import HeavyComponent from './HeavyComponent'

export default function Page() {
  return (
    <div>
      <h1>Título inmediato</h1>
      <Suspense fallback={<p>Cargando...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  )
}
```

## 7. Uso en Client Components

`fetch` extendido no está disponible en el cliente. Para obtener datos en Client Components se emplean librerías como `swr`, `react-query` o `useEffect` con fetch nativo.

## 8. Revalidación de datos

Además del `revalidate` en el fetch o en el segmento, se puede revalidar bajo demanda con `revalidateTag` y `revalidatePath` (ver `cacheo.md`).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Métodos de obtención de datos en el Pages Router](01-pages-metodos.md) | [🏠 Inicio](../index.md) | [Sistema de caché en Next.js ▶](03-cacheo.md) |
