# Server‑Side Rendering (SSR)

## Concepto

El Server‑Side Rendering (SSR) consiste en generar el HTML de una página **en el servidor**, en cada petición, y enviarlo completo al cliente. El navegador recibe una página totalmente renderizada, lista para ser visualizada, y React se hidrata posteriormente para dotarla de interactividad.

En Next.js, el SSR se utiliza cuando la página debe mostrar datos actualizados en cada solicitud o cuando depende de información de la petición (cookies, headers, parámetros de consulta).

## SSR en Pages Router

Se implementa exportando la función asíncrona `getServerSideProps` desde la página.

```javascript
export async function getServerSideProps(context) {
  const { params, req, res } = context
  const response = await fetch(`https://api.example.com/data`)
  const data = await response.json()
  return { props: { data } }
}

export default function Page({ data }) {
  return <div>{data.content}</div>
}
```

- Se ejecuta en el servidor en cada petición.
- Los datos se pasan al componente como `props`.
- También se pueden devolver `notFound` o `redirect`.

## SSR en App Router

En el App Router, una página se convierte en SSR cuando:

- Utiliza funciones dinámicas como `cookies()`, `headers()`, `searchParams` (promesa) o `noStore()`.
- Un `fetch` tiene `cache: 'no-store'`.
- Se exporta `dynamic = 'force-dynamic'`.

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' })
  const data = await res.json()
  return <div className={theme?.value}>{data.content}</div>
}
```

Al usar `cookies()`, la página se renderiza en cada petición automáticamente.

## Flujo del SSR

1. El cliente solicita la URL.
2. Next.js ejecuta el componente de página y los Server Components relacionados en el servidor.
3. Se ejecutan las funciones de obtención de datos (`getServerSideProps` o los `fetch` del componente).
4. Se genera un HTML completo y se envía al cliente.
5. El cliente muestra la página (no interactiva todavía).
6. React hidrata los componentes del lado del cliente, adjuntando eventos y estado.

## Ventajas del SSR

- **SEO óptimo**: el contenido está presente en el HTML inicial, lo que permite que los motores de búsqueda lo indexen.
- **Carga inicial rápida de contenido**: el usuario ve el contenido de inmediato.
- **Datos frescos garantizados**: cada petición recibe los datos más actuales.
- **Personalización por petición**: se puede acceder a cookies, sesiones, etc.

## Desventajas del SSR

- **Latencia del servidor**: cada petición implica esperar a que el servidor genere la página, lo que puede aumentar el Time to First Byte (TTFB).
- **Mayor carga del servidor**: cada petición consume recursos de CPU/memoria.
- **No es cacheable por defecto**: salvo que se configuren cabeceras de caché o se use una CDN con stale-while-revalidate, cada petición golpea el servidor.

## Optimizaciones

- **Caché de respuestas con cabeceras**: en Pages Router, usando `context.res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59')` se puede cachear a nivel de CDN.
- **Streaming (solo App Router)**: el SSR combinado con streaming permite enviar el shell y luego el contenido dinámico, mejorando el TTFB. (Ver `streaming-suspense.md`).
- **Edge Runtime**: ejecutar SSR en el borde reduce la latencia geográfica.

## Cuándo usar SSR

- Páginas con contenido altamente personalizado (dashboard de usuario, carrito de compras).
- Datos que cambian constantemente (resultados en vivo, precios de acciones).
- Páginas que requieren leer cookies o headers para decidir el contenido.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Server Actions](../3-app-router/4-obtencion-datos/05-server-actions.md) | [🏠 Inicio](../index.md) | [Static Site Generation (SSG) ▶](02-ssg.md) |
