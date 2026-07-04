# Métodos de obtención de datos en el Pages Router

El Pages Router ofrece tres funciones asíncronas principales para obtener datos antes de renderizar una página: `getServerSideProps`, `getStaticProps` y `getStaticPaths`. Adicionalmente, existe el legado `getInitialProps`. A continuación se detallan sus usos, parámetros, valores de retorno y patrones.

## 1. `getServerSideProps`

Ejecuta la obtención de datos en el servidor **en cada petición**. Ideal para contenido dinámico o personalizado.

```javascript
export async function getServerSideProps(context) {
  // context: { params, req, res, query, resolvedUrl, locale, locales, defaultLocale }
  const data = await fetch(`https://api.example.com/items/${context.params.id}`)
  const item = await data.json()
  return {
    props: { item },             // Datos pasados al componente
    notFound: false,             // Opcional: mostrar 404
    redirect: {                  // Opcional: redirigir
      destination: '/login',
      permanent: false,
    },
  }
}
```

- **Cuándo usarla**: la página muestra datos que dependen de la petición (cookies, autenticación, parámetros de consulta) o que cambian con mucha frecuencia.
- **Caché**: se puede configurar `Cache-Control` en `res` para CDN:
  ```javascript
  context.res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  ```

## 2. `getStaticProps`

Se ejecuta **en tiempo de compilación** (build time). Genera HTML estático que puede ser servido desde una CDN. Puede combinarse con `revalidate` para ISR.

```javascript
export async function getStaticProps(context) {
  // context: { params, preview, previewData, locale, locales, defaultLocale }
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return {
    props: { posts },
    revalidate: 3600, // Opcional: regenerar cada 1 hora (ISR)
    notFound: false,
    redirect: { destination: '/', permanent: false },
  }
}
```

- **Cuándo usarla**: datos que no cambian por petición y pueden ser cacheados (listados, artículos).
- **`revalidate`**: activa el ISR, permitiendo actualizar el contenido sin reconstruir todo el sitio.

## 3. `getStaticPaths`

Se usa **junto con `getStaticProps`** en páginas con rutas dinámicas para definir qué rutas se pre‑renderizarán en el build.

```javascript
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  const paths = posts.map(post => ({ params: { id: post.id.toString() } }))
  return {
    paths,
    fallback: 'blocking', // false | true | 'blocking'
  }
}
```

- **`fallback: false`**: rutas no generadas → 404.
- **`fallback: true`**: muestra un estado de carga (`router.isFallback`) y genera la página en el primer acceso.
- **`fallback: 'blocking'`**: el servidor espera a generar la página antes de responder (sin pantalla de carga).

## 4. `getInitialProps` (legado)

Método anterior que se ejecuta tanto en servidor como en cliente (en la primera carga). No se recomienda en nuevos proyectos porque impide la optimización estática automática. Solo se usa en `_app` o `_document` si es estrictamente necesario.

## Patrones complementarios

- **Per‑page layouts**: combinando las funciones de obtención con `getLayout`.
- **TypeScript**: cada función tiene tipos exportados por Next.js (`GetServerSideProps`, `GetStaticProps`, `GetStaticPaths`).

## Resumen comparativo

| Función               | Ejecución                   | Uso principal                    |
|-----------------------|-----------------------------|----------------------------------|
| `getServerSideProps`  | Cada petición (servidor)    | Datos dinámicos/privados         |
| `getStaticProps`      | Build (+ ISR en segundo plano) | Contenido cacheable            |
| `getStaticPaths`      | Build                       | Definir rutas dinámicas a generar|

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Server Actions: Puente entre Cliente y Servidor](../5-server-client-components/04-server-actions.md) | [🏠 Inicio](../index.md) | [Obtención de datos en el App Router ▶](02-app-router-fetch.md) |
