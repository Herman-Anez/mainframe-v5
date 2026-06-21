# Streaming y Suspense en el App Router

## ¿Qué es el Streaming?

El **streaming** es una técnica que permite al servidor enviar HTML en **trozos** a medida que se generan, en lugar de esperar a que toda la página esté renderizada. El navegador puede ir pintando partes de la interfaz mientras el resto se sigue procesando. Esto mejora métricas como el **Time to First Byte (TTFB)** y el **Largest Contentful Paint (LCP)**, ya que el usuario ve contenido antes.

Next.js App Router implementa streaming de forma nativa gracias a **React Suspense** y a la arquitectura de Server Components.

## Cómo funciona en Next.js

- Los layouts se renderizan en el servidor y se envían **inmediatamente** como shell estático de la página.
- El contenido de las páginas o de los componentes envueltos en `<Suspense>` se procesa de forma asíncrona.
- Cuando el contenido asíncrono se resuelve (por ejemplo, termina un `fetch`), el servidor envía el trozo de HTML correspondiente junto con un pequeño script que React usa para hidratar ese fragmento en el cliente.
- Todo esto ocurre sin recargar la página completa; el HTML se inserta progresivamente.

## Suspense en el App Router

React Suspense es el mecanismo subyacente que posibilita el streaming. Un límite de Suspense (`<Suspense fallback={...}>`) define una porción de la interfaz que se puede cargar de forma diferida. Mientras la data no está lista, se muestra el `fallback`.

Next.js integra Suspense de tres maneras:

1. **`loading.js` automático** – Cada segmento puede tener un archivo `loading.js` que actúa como fallback para la página o layout.
2. **Suspense manual** – Dentro de cualquier Server Component, se puede envolver contenido con `<Suspense>` para una granularidad fina.
3. **Suspense implícito en layouts** – Los layouts no se envuelven en Suspense; siempre se envían en el primer chunk. El contenido (`children`) puede ser asíncrono y se maneja con el límite del segmento.

## `loading.js` como Suspense boundary

El archivo `loading.js` define automáticamente un límite de Suspense alrededor de la página (o del contenido del layout anidado). Es la forma más sencilla de mostrar un esqueleto de carga.

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <div className="spinner">Cargando dashboard...</div>
}
```

Mientras `app/dashboard/page.tsx` espera datos asíncronos, el usuario ve el spinner. El layout que envuelve ese segmento se muestra desde el primer momento.

## Suspense manual dentro de páginas

Permite una experiencia de carga más granular. Por ejemplo, una página puede tener un contenido principal que se carga rápido y una sección de comentarios que tarda más.

```tsx
// app/blog/[slug]/page.tsx
import { Suspense } from 'react'
import Comments from './Comments'

export default function BlogPost({ params }) {
  return (
    <article>
      <h1>{/* título desde datos cacheados */}</h1>
      <p>{/* contenido principal */}</p>
      <Suspense fallback={<p>Cargando comentarios...</p>}>
        <Comments postId={params.slug} />
      </Suspense>
    </article>
  )
}
```

`Comments` es un Server Component que hace su propia obtención de datos. Mientras se resuelve, se muestra el fallback. El resto de la página ya se ha enviado al cliente.

## Beneficios del streaming

- **Mejor percepción de velocidad**: el shell de la aplicación (cabecera, navegación) aparece instantáneamente.
- **No bloqueo por datos lentos**: una petición lenta no retrasa toda la página.
- **Optimización para SEO**: los motores de búsqueda reciben el HTML completo progresivamente; aunque es streaming, el contenido final está presente.
- **Hidratación progresiva**: React hidrata los componentes conforme llegan, lo que puede mejorar el Time to Interactive.

## Requisitos y limitaciones

- Solo funciona en Server Components y con el App Router (no disponible en Pages Router).
- Los componentes suspendidos deben ser asíncronos; un Client Component no puede suspenderse por sí mismo (aunque puede ser hijo de un `<Suspense>` que dependa de un Server Component).
- Los fallbacks deben ser componentes ligeros y rápidos de renderizar.
- El streaming requiere un servidor que soporte HTTP/1.1 o superiores con transferencia de chunks (Node.js y Edge lo permiten).

## Suspense y Layouts

Los layouts **no se suspenden**, se envían siempre completos. Si un layout necesita datos asíncronos y queremos evitar un bloqueo, debemos envolver la parte pesada en un `<Suspense>` dentro del layout, pero el layout en sí se renderizará vacío en esa zona hasta que los datos lleguen.

```tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react'
import DashboardNav from './DashboardNav'

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Suspense fallback={<nav>Cargando menú...</nav>}>
        <DashboardNav />
      </Suspense>
      <main>{children}</main>
    </div>
  )
}
```

## Streaming con Edge Runtime

El Edge Runtime ofrece una latencia inicial más baja, lo que complementa perfectamente el streaming. Las funciones `fetch` pueden ejecutarse en el borde y enviar HTML rápidamente. Ambos se combinan para experiencias ultrarrápidas.

## Control de errores dentro de Suspense

Si un componente dentro de `<Suspense>` lanza un error, este se propagará hacia el `error.js` más cercano. Para manejar errores de forma específica, se puede usar un Error Boundary manual.

## Buenas prácticas

- Usa `loading.js` para la carga de la página completa; es simple y efectivo.
- Emplea `<Suspense>` manual para aislar componentes que dependen de datos lentos.
- Mantén los fallbacks lo más realistas posible (esqueletos en lugar de spinners genéricos) para mejorar la percepción.
- No suspendas en exceso: cada límite de Suspense añade complejidad; encuentra un equilibrio.
- Combina streaming con `revalidate` y `generateStaticParams` para tener páginas estáticas que cargan rápido y se actualizan progresivamente.
- Aprovecha el streaming para mejorar el LCP: el contenido principal debería estar fuera de un Suspense o ser el primero en resolverse.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Archivos de Metadatos Estáticos y Dinámicos](1-archivos-especiales/10-metadata-files.md) | [🏠 Inicio](../index.md) | [Grupos de Rutas ▶](2-convenciones-enrutamiento/01-grupos-rutas.md) |
