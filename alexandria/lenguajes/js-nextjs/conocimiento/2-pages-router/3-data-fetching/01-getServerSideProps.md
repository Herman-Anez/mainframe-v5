# Getserversideprops

## Definición y propósito

`getServerSideProps` es una función asíncrona que se exporta desde una página del Pages Router. **Se ejecuta en el servidor en cada petición** y permite obtener datos dinámicos antes de renderizar la página. Los datos se pasan como `props` al componente React.

Es la herramienta principal para implementar **Server‑Side Rendering (SSR)** en el Pages Router.

## Cuándo usarla

- La página debe mostrar datos actualizados en cada solicitud (ej. precios de bolsa, clima, noticias de última hora).
- Los datos dependen de la petición entrante: cookies, headers, parámetros de consulta.
- Se necesita acceso a la sesión del usuario o autenticación en cada carga.
- No se puede usar `getStaticProps` porque el contenido no es cacheable o se actualiza con mucha frecuencia.

## Estructura básica

```javascript
export async function getServerSideProps(context) {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return {
    props: { data: json }, // serán pasadas al componente de página
  }
}
```

## Parámetro `context`

El objeto `context` contiene:

| Propiedad      | Descripción                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `params`       | Parámetros de ruta dinámica (ej. `{ id: '1' }` para `[id].js`).            |
| `req`          | Objeto `IncomingMessage` de Node.js (petición HTTP). Útil para cabeceras y cookies. |
| `res`          | Objeto `ServerResponse` de Node.js. Se puede usar para redirigir manualmente. |
| `query`        | Objeto con los query strings de la URL (`?search=hola`).                    |
| `resolvedUrl`  | La URL resuelta (incluye query y hash).                                     |
| `locale`       | El locale activo (si se usa internacionalización nativa).                   |
| `locales`      | Todos los locales configurados.                                             |
| `defaultLocale`| Locale por defecto.                                                         |

## Valores de retorno

La función debe devolver un objeto con una de estas propiedades:

- **`props`** (obligatorio): los datos que se pasarán al componente. Se serializan a JSON.
- **`notFound`** (opcional): booleano. Si es `true`, se muestra la página 404.
- **`redirect`** (opcional): objeto con `destination` (URL) y `permanent` (booleano). Redirige en el servidor.

```javascript
// Ejemplo de redirección
export async function getServerSideProps({ params }) {
  const post = await getPost(params.id)
  if (!post) {
    return { notFound: true }
  }
  if (post.private) {
    return { redirect: { destination: '/login', permanent: false } }
  }
  return { props: { post } }
}
```

## Ejecución

- Se ejecuta en el servidor **en cada petición** a la página.
- No se ejecuta en el cliente ni durante el build.
- En desarrollo, se ejecuta en cada recarga.
- En producción, en el primer acceso y en subsiguientes peticiones (siempre en servidor).

## Acceso a cookies y headers

```javascript
export async function getServerSideProps({ req }) {
  const token = req.cookies.token
  const userAgent = req.headers['user-agent']
  // ...
}
```

## Uso con `fetch` y manejo de errores

Es buena práctica capturar errores y, o bien devolver props vacías, o lanzar un error para mostrar la página 500.

```javascript
export async function getServerSideProps() {
  try {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error('Failed to fetch')
    return { props: { data: await res.json() } }
  } catch (error) {
    // Opción 1: retornar props para manejar en UI
    return { props: { error: error.message } }
    // Opción 2: lanzar error → se mostrará la página 500 (production)
    // throw error
  }
}
```

## TypeScript

```typescript
import { GetServerSideProps } from 'next'

interface PageProps {
  data: any
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  // context está tipado (GetServerSidePropsContext)
  return { props: { data: [] } }
}
```

## Rendimiento y optimizaciones

- **Cuidado con dependencias lentas**: cada petición ejecuta `getServerSideProps`. Si la API externa es lenta, el tiempo de respuesta se resiente.
- **Cache en CDN**: Puedes establecer cabeceras `Cache-Control` mediante `res.setHeader` para que CDNs cacheen la respuesta por un tiempo limitado, logrando un comportamiento similar a ISR pero sin reconstrucción en segundo plano.
  ```javascript
  context.res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  ```
- **Next.js 13+ con App Router**: En el App Router, `getServerSideProps` no existe; se usan Server Components con `fetch(url, { cache: 'no-store' })` o funciones dinámicas.

## Limitaciones

- No se puede usar `revalidate` (ISR) porque la página es completamente dinámica.
- No puede coexistir con `getStaticProps` o `getStaticPaths` en la misma página.
- Los datos se serializan a JSON; objetos complejos como fechas o undefined necesitan manejo.

## Comparación con `getStaticProps`

| Aspecto               | getServerSideProps                  | getStaticProps                         |
|-----------------------|-------------------------------------|----------------------------------------|
| Ejecución             | En cada petición (servidor)         | En build time (+ ISR en fondo)        |
| Rendimiento           | Mayor latencia, siempre dinámico    | Rápido (servido desde CDN/caché)       |
| Uso recomendado       | Datos por solicitud                 | Datos que pueden ser cacheados         |

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Catch all opcional](../2-enrutamiento/04-catch-all-opcional.md) | [🏠 Inicio](../../index.md) | [Getstaticprops ▶](02-getStaticProps.md) |
