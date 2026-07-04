# Streaming con Suspense

## Concepto

El **streaming** permite que el servidor envíe HTML al cliente en **trozos** a medida que se genera, en lugar de esperar a que toda la página esté lista. Next.js implementa streaming en el App Router mediante **React Suspense**, permitiendo que partes de la interfaz se muestren inmediatamente mientras otras se cargan de forma asíncrona.

## Cómo funciona

- El servidor comienza a enviar el HTML de los **layouts** y componentes no suspendidos inmediatamente (shell estático).
- Los componentes envueltos en `<Suspense>` se procesan de forma diferida.
- Cuando el contenido asíncrono (por ejemplo, un `fetch` dentro de un Server Component suspendido) se resuelve, el servidor envía un chunk de HTML con ese contenido y un script que React usará para hidratarlo en su lugar.
- El resultado es una página que se visualiza progresivamente, mejorando el **Time to First Byte (TTFB)** y el **Largest Contentful Paint (LCP)**.

## Implementación en App Router

### 1. Suspense automático con `loading.js`

Colocar un archivo `loading.js` en un segmento envuelve automáticamente la página con un `<Suspense>` y muestra el fallback mientras la página espera datos.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Cargando panel...</div>
}
```

Mientras `app/dashboard/page.tsx` (asíncrono) espera sus datos, se muestra el loading.

### 2. Suspense manual

Para granularidad fina, se puede usar `<Suspense>` directamente en componentes.

```tsx
import { Suspense } from 'react'
import Comments from './Comments'

export default function BlogPost() {
  return (
    <article>
      <h1>Título</h1>
      <Suspense fallback={<p>Cargando comentarios...</p>}>
        <Comments />
      </Suspense>
    </article>
  )
}
```

`Comments` es un Server Component asíncrono. Mientras se resuelve, el fallback ocupa su lugar.

## Streaming y Edge Runtime

El streaming funciona especialmente bien con el Edge Runtime, ya que reduce la latencia de la conexión inicial y permite que los chunks lleguen aún más rápido.

## Impacto en métricas

- **TTFB**: se reduce porque el primer chunk (shell) se envía rápidamente.
- **FCP (First Contentful Paint)**: mejora al mostrar el esqueleto antes.
- **LCP**: si el contenido principal no está suspendido, se muestra pronto; si lo está, al menos se ve un fallback y luego se actualiza.

## Consideraciones sobre SEO

El streaming no perjudica el SEO porque el HTML final contiene todo el contenido; los crawlers esperan a que la página termine de cargarse (aunque es posible que algunos no ejecuten JavaScript, pero el HTML estático final se recibe igual en el streaming). En cualquier caso, Next.js también proporciona prerenderización estática con ISR para contenido público.

## Limitaciones

- **No disponible en Pages Router**: solo en App Router.
- Los componentes suspendidos deben ser Server Components; los Client Components no se suspenden automáticamente (aunque pueden ser hijos de un `Suspense` y esperar datos propios con hooks como `use`).
- En desarrollo, el comportamiento puede ser ligeramente diferente debido al modo estricto.

## Buenas prácticas

- Usa `loading.js` para la carga de página completa y `<Suspense>` para partes concretas.
- Los fallbacks deben ser livianos (esqueletos CSS, spinners) para no bloquear el renderizado.
- Evita suspender en exceso: demasiados límites de Suspense pueden generar muchas ondas de hidratación y perjudicar el rendimiento.
- Aprovecha el streaming junto con ISR para tener páginas estáticas que luego actualizan partes dinámicas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Client‑Side Rendering (CSR)](04-csr.md) | [🏠 Inicio](../index.md) | [Renderizado Dinámico vs Estático ▶](06-dinamico-vs-estatico.md) |
