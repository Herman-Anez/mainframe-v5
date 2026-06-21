# Partial Prerendering (PPR)

## 1. Concepto

El **Partial Prerendering (PPR)** es una característica experimental que permite que una misma ruta combine **contenido estático** (pre‑renderizado en el build) y **contenido dinámico** (renderizado por petición) de manera transparente. Con PPR, la shell estática de la página se sirve inmediatamente desde el CDN, mientras que los huecos dinámicos se rellenan mediante streaming cuando se recibe la petición. Así se obtiene lo mejor de SSG y SSR en una sola página.

## 2. ¿Cómo funciona?

PPR se apoya en **Suspense boundaries**. Next.js identifica los componentes estáticos que pueden pre‑renderizarse (aquellos que no dependen de funciones dinámicas) y los componentes dinámicos envueltos en `<Suspense>`. Durante la construcción, la shell estática se genera y se guarda en la Full Route Cache.

En cada petición:

- La shell estática se envía instantáneamente (desde la caché de CDN o del servidor).
- Los componentes suspendidos se renderizan dinámicamente en ese momento, y su HTML se envía mediante streaming al cliente.
- El resultado final es una página que combina la velocidad del estático con la personalización del SSR.

## 3. Configuración

Es una funcionalidad experimental. Para activarla en Next.js (15+):

```javascript
// next.config.js
module.exports = {
  experimental: {
    ppr: 'incremental', // o true
  },
}
```

- `'incremental'` permite habilitar PPR por ruta, añadiendo `export const experimental_ppr = true` en el layout o página deseada.
- `true` lo activa para todas las rutas (salvo que se desactive explícitamente).

Luego, en un layout (o página) se puede activar:

```tsx
// app/layout.tsx
export const experimental_ppr = true

export default function RootLayout({ children }) {
  // ...
}
```

## 4. Ejemplo práctico

Supongamos una página de producto con una shell estática (nombre de tienda, navegación) y una sección dinámica (inventario en tiempo real).

```tsx
// app/producto/[id]/page.tsx
import { Suspense } from 'react'

export default function ProductoPage({ params }) {
  return (
    <div>
      <h1>Tienda online</h1> {/* Estático, se incluye en la shell */}
      <Suspense fallback={<p>Cargando inventario...</p>}>
        <Inventario productId={params.id} />
      </Suspense>
    </div>
  )
}

async function Inventario({ productId }) {
  const stock = await fetch(`https://.../stock/${productId}`, { cache: 'no-store' })
  return <p>Stock: {stock.available}</p>
}
```

Sin PPR, toda la página sería dinámica al usar `cache: 'no-store'`. Con PPR, la shell (`<h1>`) se pre‑renderiza y se cachea; solo `Inventario` se solicita en cada visita.

## 5. Beneficios

- **TTFB extremadamente bajo**: el primer chunk de HTML llega casi instantáneamente.
- **Rendimiento predecible**: la parte estática nunca se regenera; la parte dinámica puede ser tan lenta como sea necesario sin bloquear el shell.
- **Escalabilidad**: la shell se sirve desde CDN; el servidor solo procesa el componente dinámico.

## 6. Consideraciones y limitaciones

- **Experimental**: puede haber cambios en la API. Prueba exhaustivamente antes de usar en producción.
- Los componentes estáticos no deben usar funciones dinámicas (`cookies()`, `headers()`, `noStore()`). Si lo hacen, se convierten en dinámicos y el PPR deja de tener efecto (la shell no se pre‑renderizaría).
- La navegación cliente‑servidor se mantiene: si el usuario navega a otra página con PPR, se enviará la shell cacheada de la nueva ruta.
- La revalidación de la shell estática sigue las reglas normales de ISR (si la página tiene `revalidate`, la shell se regenerará según ese intervalo).
- Todos los componentes dinámicos deben estar bajo un `<Suspense>`. Si no hay límite, la página entera se vuelve dinámica.

## 7. Combinación con `generateStaticParams`

PPR funciona de maravilla con `generateStaticParams`. Las rutas pre‑renderizadas tendrán su shell estática lista, pero incluso las no generadas (con `dynamicParams: true`) se beneficiarán: al primer acceso se generará la shell bajo demanda y luego se cacheará.

## 8. Debugging

En desarrollo, PPR se puede emular. En producción, observa las cabeceras de respuesta: la shell se envía con un `Link` header? Next.js no expone un header específico, pero puedes ver los chunks en las herramientas de red.

## 9. Futuro

PPR es la piedra angular del "Static first, dynamic when needed". Se volverá estable y la configuración pasará a ser `ppr: true` (sin experimental). Todas las aplicaciones podrán beneficiarse de forma predeterminada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Turbopack: el nuevo bundler de Next.js](01-turbopack.md) | [🏠 Inicio](../index.md) | [Dynamic IO (Experimental) ▶](03-dynamic-io.md) |
