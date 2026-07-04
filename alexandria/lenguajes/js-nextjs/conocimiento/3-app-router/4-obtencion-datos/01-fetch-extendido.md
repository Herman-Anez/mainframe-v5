# Fetch Extendido y Caché en App Router

## El fetch potenciado de Next.js

En el App Router, Next.js extiende la API nativa `fetch` para proporcionar un sistema de **caché y revalidación automáticos** de peticiones. Esto significa que dentro de cualquier Server Component, `fetch` se comporta de manera mejorada, integrando las capacidades de renderizado estático y dinámico.

```tsx
// Server Component
export default async function Page() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

Por defecto, Next.js cachea la respuesta de `fetch` y la reutiliza en toda la aplicación durante el tiempo de vida de una renderización (deduplicación) e incluso entre peticiones en producción (caché persistente).

## Opciones de cacheo

La función `fetch` acepta una propiedad `next` que controla la estrategia de caché:

```ts
fetch(url, {
  next: {
    revalidate: 3600, // ISR: revalida cada hora
    tags: ['posts'],   // Etiqueta para revalidación bajo demanda
  },
  cache: 'force-cache', // Comportamiento por defecto
})
```

Además, acepta las mismas opciones de caché de la Web API:

| Opción `cache`         | Comportamiento                                                                 |
|------------------------|--------------------------------------------------------------------------------|
| `force-cache`          | Por defecto. Cachea la respuesta y la reutiliza. Equivale a `cache: 'force-cache'` sin `next.revalidate`. |
| `no-store`             | Desactiva la caché completamente. La página se convierte en dinámica (SSR). Equivale a `cache: 'no-store'`. |

## Deduplicación de peticiones

Si varios componentes en el mismo árbol de renderizado realizan el mismo `fetch` (misma URL y opciones), Next.js **deduplica** automáticamente: solo se envía una petición real, y el resultado se comparte. Esto evita llamadas redundantes sin necesidad de una capa de estado (como React Query).

```tsx
// Componente A
const user = await fetch('https://api.example.com/user/1')

// Componente B en el mismo árbol
const sameUser = await fetch('https://api.example.com/user/1')
// La segunda llamada no genera petición HTTP; se reutiliza el resultado.
```

Esta deduplicación funciona incluso sin configuraciones adicionales, y se aplica a peticiones con `cache: 'force-cache'` o `no-store`.

## Caché persistente (Data Cache)

En producción, las respuestas de `fetch` con `cache: 'force-cache'` y `revalidate` se almacenan en una caché global del servidor (Data Cache). Esta caché sobrevive a las renderizaciones y se comparte entre usuarios. Se invalida:

- Cuando se cumple el tiempo de `revalidate`.
- Manualmente usando `revalidateTag(tag)` o `revalidatePath(path)`.

## Cuándo usar cada opción

- **`force-cache` sin revalidate**: Datos que nunca cambian (contenido estático). La página se generará estáticamente (SSG).
- **`force-cache` con `revalidate: T`**: Datos que cambian esporádicamente (ISR). La página se genera estáticamente y se revalida en segundo plano.
- **`no-store`**: Datos personalizados por petición (sesión, cookies) o en tiempo real. La página se renderiza dinámicamente (SSR).

## Fetch y revalidación con tags

Las etiquetas (`tags`) permiten invalidar selectivamente la caché. Se asignan uno o varios tags al `fetch`:

```ts
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
})
```

Luego, desde un Server Action o Route Handler, se puede llamar a `revalidateTag('posts')` para purgar todas las peticiones asociadas a ese tag.

## Fetch en componentes de cliente

`fetch` extendido **solo funciona en Server Components**. En Client Components, `fetch` se comporta como la API estándar del navegador (sin caché del servidor, sin deduplicación). Para obtener datos en el cliente se recomienda usar bibliotecas como SWR o React Query.

## Obtención de datos en Layouts y Pages

Tanto layouts como páginas pueden usar `fetch` asíncrono. La diferencia principal es que los layouts pueden hacer fetching de datos que se comparten entre todas las páginas de ese segmento, mientras que las páginas obtienen datos específicos de la ruta.

```tsx
// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const user = await fetch('https://...').then(res => res.json())
  return <nav>{user.name}{children}</nav>
}
```

## Consideraciones sobre Edge Runtime

En el Edge Runtime, `fetch` también está disponible y se comporta de manera similar, pero la caché puede tener diferencias (dependiendo de la infraestructura de Vercel u otro proveedor). Se recomienda verificar la compatibilidad con `runtime: 'edge'`.

## Buenas prácticas

- Centraliza las URLs de API en constantes o funciones helper para facilitar cambios.
- Tipa las respuestas de `fetch` con TypeScript.
- Maneja errores de red y respuestas no exitosas.
- Utiliza `tags` para tener un control fino de la revalidación.
- Combina `fetch` con `generateStaticParams` para generar páginas estáticas con datos cacheados.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ El Layout Raíz](../3-layouts-plantillas/04-root-layout.md) | [🏠 Inicio](../../index.md) | [Estrategias de Revalidación en App Router ▶](02-revalidacion.md) |
