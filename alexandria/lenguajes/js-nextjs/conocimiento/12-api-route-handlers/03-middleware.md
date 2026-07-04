# Middleware en Next.js

## Definición

El **Middleware** de Next.js permite ejecutar código antes de que se complete una petición. Se define en un archivo `middleware.ts` en la raíz del proyecto (junto a `next.config.js`). Puede interceptar peticiones a páginas, Route Handlers, archivos estáticos y API Routes (incluyendo las del Pages Router). El middleware se ejecuta en el **Edge Runtime**, lo que le da una latencia bajísima.

## Creación del middleware

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Lógica personalizada
  return NextResponse.next() // Continúa la petición
}
```

- `middleware` debe exportar una función llamada `middleware` (o un array de funciones usando firmas alternativas).
- Tiene acceso a `NextRequest` (extensión de `Request`) y `NextResponse` (extensión de `Response` con ayudas como `next()`, `redirect()`, `rewrite()`).

## Configuración del `matcher`

Para limitar qué rutas activan el middleware, exporta un objeto `config` con una propiedad `matcher`:

```ts
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

- `matcher` puede ser un array de patrones (soporta globbing).
- Si no se especifica, el middleware se ejecutará en **todas** las peticiones. Esto puede afectar el rendimiento y las páginas estáticas, ya que incluso las peticiones a archivos estáticos pasarían por el middleware. Se recomienda siempre definir un `matcher` para limitar la ejecución.

## Operaciones comunes

### Redirección

```ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/old')) {
    return NextResponse.redirect(new URL('/new', request.url))
  }
  return NextResponse.next()
}
```

### Reescribir (proxy interno)

```ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/blog')) {
    return NextResponse.rewrite(new URL('/news', request.url))
  }
}
```

El usuario ve `/blog`, pero el contenido servido es el de `/news`. La URL no cambia en el navegador.

### Añadir o modificar cabeceras

```ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('X-Custom-Header', 'valor')
  return response
}
```

### Control de acceso (Auth)

```ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

### Manejo de locales (i18n)

```ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'es', 'fr']
const defaultLocale = 'en'

function getLocale(request: NextRequest) {
  // ... lógica para obtener el locale preferido
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}
```

## Middleware y Edge Runtime

El middleware se ejecuta en el **Edge Runtime** (no en Node.js). Esto implica:

- Latencia muy baja (se ejecuta cerca del usuario).
- APIs limitadas: no soporta `fs`, `net`, ni la mayoría de los módulos nativos de Node.js.
- No puede usar `require` o `import` de módulos que dependan de Node.js. Solo módulos compatibles con Edge (o que no usen APIs de servidor).
- No tiene acceso al sistema de archivos del proyecto (excepto lo que está dentro del bundle del middleware).

## Buenas prácticas

- Mantén el middleware ligero; cualquier operación costosa impactará en todas las peticiones coincidentes.
- Usa `matcher` para limitar su alcance.
- Para lógica compleja, considera redirigir a un Route Handler o una página en lugar de procesar todo en el middleware.
- Evita acceder a secretos en el middleware a menos que sea necesario (se ejecutan en el borde y pueden estar expuestos si no se manejan con cuidado).
- El middleware se ejecuta **antes** de la caché estática? En Vercel, el middleware se ejecuta después de la verificación de la caché en el Edge, por lo que no afecta a páginas ya cacheadas en el CDN a menos que se configure explícitamente una estrategia.

## Limitaciones

- No puede establecer cookies directamente en la respuesta más que mediante `response.cookies.set()`.
- No puede acceder a `req.body` (el cuerpo de la petición) directamente; para leer datos del cuerpo necesitas un Route Handler o una API Route.
- El middleware no puede realizar streaming ni modificar el flujo de respuesta más allá de las cabeceras y el código de estado.

## Combinación con otros routers

- Las **API Routes del Pages Router** también son interceptadas por el middleware si la ruta coincide con el matcher.
- Los **Route Handlers del App Router** también pasan por el middleware.
- El middleware se ejecuta **antes** de cualquier lógica de página o API.

## Ejemplo avanzado: Rate Limiting

Se puede implementar un contador simple usando `@vercel/kv` o alguna solución Edge:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const requests = await kv.incr(`rate:${ip}`)
  if (requests === 1) {
    await kv.expire(`rate:${ip}`, 60) // 60 segundos de ventana
  }
  if (requests > 100) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  return NextResponse.next()
}
```

## Migración desde Pages Router

Si anteriormente usabas un `middleware` en Pages Router (por ejemplo, un archivo `pages/_middleware.ts` obsoleto), la nueva ubicación es la raíz del proyecto con el archivo `middleware.ts`. La API es más potente y usa objetos `NextRequest`/`NextResponse`.

Con estos tres documentos, se cubren todas las formas de construir lógica de servidor en Next.js, tanto para APIs como para interceptar y modificar peticiones.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Route Handlers en el App Router](02-route-handlers.md) | [🏠 Inicio](../index.md) | [Patrones de autenticación en Next.js ▶](../13-autenticacion/01-patrones.md) |
