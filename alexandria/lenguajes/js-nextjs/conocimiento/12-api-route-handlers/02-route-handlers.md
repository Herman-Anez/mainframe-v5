# Route Handlers en el App Router

## Definición

Los **Route Handlers** reemplazan a las API Routes del Pages Router en el App Router. Se definen en archivos `route.ts` (o `.js`) dentro de cualquier carpeta del directorio `app/`. Exportan funciones con el nombre del método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`).

Utilizan las APIs web estándar (`Request` y `Response`) en lugar de los objetos `req`/`res` de Node.js.

## Estructura mínima

```ts
// app/api/items/route.ts
export async function GET(request: Request) {
  return Response.json({ items: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ created: true }, { status: 201 })
}
```

- Cada archivo `route.ts` define los métodos permitidos. Cualquier método no exportado devuelve un 405 automáticamente (a menos que se maneje explícitamente).
- No pueden coexistir con un `page.tsx` en la misma carpeta; esa carpeta es o página o API, no ambas.

## Acceso a parámetros dinámicos

Las carpetas con segmentos dinámicos (`[id]`, `[...slug]`) funcionan igual que en las páginas. Los parámetros se reciben como segundo argumento de la función.

```ts
// app/api/posts/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  return Response.json({ id })
}
```

En **Next.js 15+**, `params` es una **promesa** que debe ser `await`eada:

```ts
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

Lo mismo aplica para catch‑all (`[...slug]`), donde `slug` será un array de strings.

## Cabeceras y cookies

Puedes usar `next/headers` para leer cookies y cabeceras de la petición.

```ts
import { cookies, headers } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const userAgent = headers().get('user-agent')
  // ...
}
```

Estas funciones son dinámicas y convertirán la ruta en renderizado dinámico si se usan en un segmento que no sea `force-dynamic`. En Route Handlers normalmente no afecta, pero para generar respuestas cacheables debes evitar su uso (a menos que sepas que la respuesta debe ser dinámica).

## Respuestas y utilidades

Además de `Response`, puedes usar `NextResponse` de `next/server` que ofrece métodos adicionales:

```ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'OK' })
}

export async function POST(request: Request) {
  const data = await request.json()
  if (!data.name) {
    return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })
  }
  return NextResponse.redirect(new URL('/success', request.url))
}
```

## Caché en Route Handlers

Por defecto, Next.js no cachea las respuestas de los Route Handlers como lo hace con las páginas. Debes configurar manualmente las cabeceras de caché.

```ts
export async function GET() {
  const data = await fetch('...')
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
```

Si necesitas revalidación bajo demanda, puedes usar `revalidatePath` o `revalidateTag` dentro del handler (por ejemplo, en un `POST`).

## Edge Runtime

Los Route Handlers pueden ejecutarse en el Edge Runtime para una latencia mínima.

```ts
export const runtime = 'edge'

export async function GET() {
  return new Response('Hola desde el borde')
}
```

En Edge, no tienes acceso a APIs de Node.js (sistema de archivos, algunos módulos nativos). Solo APIs web y un subconjunto limitado.

## Streaming de respuestas

Puedes devolver un `ReadableStream` como cuerpo de respuesta:

```ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('Hola')
      controller.close()
    }
  })
  return new Response(stream)
}
```

Ideal para transmitir grandes volúmenes de datos o respuestas en tiempo real.

## Manejo de CORS

Debes configurar manualmente las cabeceras CORS, por ejemplo mediante un helper:

```ts
export async function GET(request: Request) {
  return new Response('OK', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

## Validación de datos

Debes validar manualmente el cuerpo de la petición. Puedes usar `zod`:

```ts
import { z } from 'zod'

const schema = z.object({ name: z.string().min(1) })

export async function POST(request: Request) {
  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 })
  }
  // ...
}
```

## TypeScript

Los tipos se integran bien:

```ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // NextRequest extiende Request con utilidades (cookies, etc.)
}
```

## Comparativa con Pages API Routes

| Aspecto                | Pages API Routes               | Route Handlers                      |
|------------------------|--------------------------------|-------------------------------------|
| Objetos                | `req`/`res` Node.js           | `Request`/`Response` Web API        |
| Enrutamiento           | `pages/api/...`               | `app/.../route.ts`                  |
| Parámetros             | `req.query`                   | `params` (segundo argumento)        |
| Caché                  | Manual (cabeceras)            | Manual (cabeceras)                  |
| Middleware global      | No nativo                     | Comparten `middleware.ts`           |
| Streaming              | No soportado                  | Sí, con `ReadableStream`            |
| Runtime                | Solo Node.js                  | Node.js o Edge                      |

## Buenas prácticas

- Usa `route.ts` para APIs públicas que requieran control total sobre cabeceras, métodos y streaming.
- Prefiere Server Actions para mutaciones ligadas a la UI (formularios) porque son más simples y seguras.
- Siempre valida los datos de entrada.
- Configura `Cache-Control` adecuadamente; considera si la respuesta debe ser cacheada en CDN.
- Para webhooks y llamadas externas, verifica el origen (ej. comprobando una firma HMAC).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ API Routes en el Pages Router](01-pages-api.md) | [🏠 Inicio](../index.md) | [Middleware en Next.js ▶](03-middleware.md) |
