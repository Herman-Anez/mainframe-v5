# API Route Handler

## Definición

Los Route Handlers reemplazan a las API Routes del Pages Router. Se definen en archivos `route.js` (o `.ts`) dentro de `app/`. Exportan funciones con los nombres de los métodos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`). Usan las API estándar de la Web (`Request` y `Response`).

## Formato

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

## Parámetros dinámicos

Para rutas como `app/api/items/[id]/route.ts`, las funciones reciben un segundo argumento con `params` (objeto, no promesa) extraído de la URL.

```ts
export async function GET(request, { params }: { params: { id: string } }) {
  const id = params.id
  return Response.json({ id })
}
```

A partir de Next.js 15, `params` se vuelve una promesa; se debe `await`.

## Contexto de la petición

- `request` contiene headers, cookies, método, URL, etc.
- Se pueden usar las funciones `cookies()` y `headers()` de `next/headers` para acceder a cookies/headers.
- El método `OPTIONS` se puede exportar para CORS preflight.

## Streaming y Edge

- Los Route Handlers soportan streaming de respuestas usando `ReadableStream`.
- Se pueden ejecutar en Edge Runtime con `export const runtime = 'edge'`.

## Caché

Por defecto, Next.js cachea las respuestas GET automáticamente. Se puede controlar con:

```ts
export async function GET() {
  return Response.json(data, {
    headers: { 'Cache-Control': 'max-age=60, stale-while-revalidate=120' }
  })
}
```

O usando `next.revalidate` en el contexto de fetch... Pero Route Handlers no tienen la integración automática de fetch como las páginas. La caché se basa en cabeceras.

## Revalidación bajo demanda

Se puede usar `revalidatePath` o `revalidateTag` en Server Actions para invalidar la caché de un Route Handler.

## Consideraciones

- Los Route Handlers no pueden coexistir con un `page.js` en la misma carpeta; la ruta es o API o UI.
- No tienen acceso a `params` de layouts o configuraciones de segmento de página, pero sí pueden leer cookies y headers.
- Pueden usar `NextResponse` (de `next/server`) para utilidades como redirección (`NextResponse.redirect`).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Plantilla sin Persistencia](07-template.md) | [🏠 Inicio](../../index.md) | [Fallback para Rutas Paralelas ▶](09-default.md) |
