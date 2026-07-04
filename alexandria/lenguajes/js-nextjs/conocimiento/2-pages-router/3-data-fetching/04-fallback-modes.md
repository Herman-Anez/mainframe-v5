# Fallback modes

## Descripción general

El parámetro `fallback` en el objeto retornado por `getStaticPaths` controla el comportamiento cuando un usuario solicita una ruta dinámica que **no fue pre‑renderizada** en el build. Hay tres valores posibles: `false`, `true` y `'blocking'`. Cada uno dicta qué sucede en el primer acceso y cómo se comporta el componente React.

## `fallback: false`

- **Comportamiento en build**: Se generan solo las rutas incluidas en `paths`.
- **Ruta no encontrada**: Si un usuario visita una URL que no está en `paths`, **devuelve un 404** de inmediato. No se intenta generar la página.
- **Ventajas**: Simple y seguro. Útil cuando el conjunto de rutas es conocido y no cambia.
- **Desventajas**: Cualquier ruta nueva no existirá hasta el próximo build.
- **Ejemplo**:
  ```javascript
  export async function getStaticPaths() {
    return { paths: [...], fallback: false }
  }
  ```
  En el componente **no** se necesita manejar estado de carga.

## `fallback: true`

- **Comportamiento**: Next.js servirá una versión de "fallback" de la página mientras genera la página real en el servidor. La generación ocurre **una vez** en el primer acceso; las siguientes peticiones usarán la página estática generada (y se revalidará según `revalidate`).
- **Requisito en el componente**: Debes manejar el estado de carga usando `router.isFallback`. Mientras se genera la página, `router.isFallback` es `true`.
- **Ejemplo**:
  ```javascript
  import { useRouter } from 'next/router'

  export default function Post({ post }) {
    const router = useRouter()

    if (router.isFallback) {
      return <div>Cargando...</div>
    }

    return <article>{post.content}</article>
  }
  ```
- **Flujo**:
  1. Usuario solicita `/posts/123` que no fue generada.
  2. Next.js sirve inmediatamente el HTML de la página, pero con `router.isFallback = true`.
  3. En segundo plano ejecuta `getStaticProps` con `params: { id: '123' }`.
  4. Cuando termina, regenera la página y el cliente recibe el HTML final (similar a una actualización en caliente).
- **Ventajas**: Permite añadir páginas sin hacer un nuevo build. El usuario ve una pantalla de carga mientras tanto.
- **Desventajas**: El componente debe gestionar el estado `isFallback`, lo que puede complicar la lógica si no se toman precauciones. Además, el primer render no tendrá los datos reales, así que hooks que dependan de los datos pueden fallar.
- **Precaución**: Si se usa SWR o fetching en cliente, debe evitarse hasta que `isFallback` sea falso.

## `fallback: 'blocking'`

- **Comportamiento**: Similar a `true`, pero sin mostrar pantalla de carga. El servidor **espera** a que `getStaticProps` termine antes de enviar la respuesta. El usuario no ve el estado intermedio.
- **No necesita `router.isFallback`**: El componente siempre recibe los datos reales desde el principio, porque el HTML se genera completamente.
- **Ventajas**: No necesitas manejar estado de carga; el SEO es consistente (el HTML siempre tiene el contenido real). Adecuado para páginas que deben tener contenido completo en la primera respuesta.
- **Desventajas**: El primer acceso puede ser lento si `getStaticProps` tarda mucho (el usuario espera una respuesta). Sin embargo, las siguientes visitas serán estáticas y rápidas.
- **Ejemplo**:
  ```javascript
  export async function getStaticPaths() {
    const posts = await fetch('...').then(res => res.json())
    const paths = posts.map(p => ({ params: { id: p.id } }))
    return { paths, fallback: 'blocking' }
  }
  ```
  En la página no se necesita `router.isFallback` (aunque puede usarse opcionalmente para verificar si la página está estática).

## Comparativa

| Modo               | Primera carga de ruta no generada | Necesita `isFallback` | Tiempo de respuesta inicial | Uso típico                     |
|--------------------|-----------------------------------|------------------------|-----------------------------|--------------------------------|
| `false`            | 404 inmediato                     | No                     | Muy rápido (404)            | Sitio con rutas fijas          |
| `true`             | Muestra loading + genera en fondo | Sí                     | Inmediato (página vacía)    | Catálogo grande, permite añadir páginas sin build |
| `'blocking'`       | Genera en servidor y luego envía  | No                     | Lento la primera vez        | Landing pages de nuevas entradas, donde el contenido es vital |

## Generación en segundo plano y ISR

Una vez que la página se genera por primera vez (ya sea en build o vía `fallback: true/blocking`), se comporta como cualquier página estática con `revalidate`. Esto significa que después del tiempo indicado, la página se regenerará en segundo plano cuando haya tráfico.

## Manejo de errores en fallback

- Si `getStaticProps` falla durante la generación bajo demanda (con `fallback: true`), la página de fallback se queda cargando indefinidamente? En realidad, Next.js mostrará la página de error 500 si la generación falla y no se puede recuperar. Es recomendable manejar excepciones dentro de `getStaticProps` para devolver `notFound: true` o props vacías.
- Con `'blocking'`, si falla, el servidor devolverá un error 500.

## Implementación robusta con `fallback: true`

```javascript
export default function Page({ data }) {
  const router = useRouter()

  if (router.isFallback) {
    return <Esqueleto />
  }

  return <Contenido data={data} />
}
```

Se puede también usar `router.isFallback` para condicionar el render de componentes que dependan de `data`.

## Estrategia de "paths pequeños + fallback: blocking"

Un patrón común es pre‑renderizar solo las páginas más visitadas (top 100) y para el resto usar `fallback: 'blocking'`. Así se optimiza el tiempo de build y se genera bajo demanda.

## Consideraciones con TypeScript

Los tipos de Next.js ya incluyen la validación de `fallback`. En el componente, `router.isFallback` es `boolean` y ayuda a discriminar el estado de carga.

## Migración al App Router

En el App Router, el concepto equivalente es `generateStaticParams` combinado con `dynamicParams` (booleano) y `revalidate`. No existe un modo `'blocking'` explícito; la generación bajo demanda ocurre automáticamente si `dynamicParams` es `true` (por defecto). El streaming y Suspense sustituyen el manejo del estado de carga.

---

Este bloque cubre exhaustivamente los mecanismos de obtención de datos del Pages Router, proporcionando la base para implementar cualquier estrategia de renderizado híbrido en aplicaciones Next.js clásicas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Getstaticpaths](03-getStaticPaths.md) | [🏠 Inicio](../../index.md) | [API Routes: Conceptos y uso fundamental ▶](../4-api-routes/01-basico.md) |
