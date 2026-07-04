# API Routes en el Pages Router

## Conceptos fundamentales

Las **API Routes** del Pages Router permiten crear endpoints HTTP directamente desde la carpeta `pages/api/`. Cada archivo exporta por defecto una función `handler` que recibe los objetos `req` (petición) y `res` (respuesta) de Node.js. No requieren configuración adicional; se convierten automáticamente en funciones serverless si se despliegan en Vercel o en endpoints de un servidor Node.js estándar.

## Estructura básica

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' })
}
```

- El archivo debe residir en `pages/api/`. La ruta resultante será `/api/hello` (sin la carpeta `pages` ni la extensión).
- Soporta cualquier verbo HTTP: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.
- Next.js proporciona extensiones sobre los objetos nativos de Node.js para facilitar tareas comunes.

## Objetos `req` y `res` extendidos

### `req` (NextApiRequest)

| Propiedad / método | Descripción |
|--------------------|-------------|
| `req.method` | Método HTTP (`'GET'`, `'POST'`, etc.). |
| `req.url` | URL de la petición (sin host). |
| `req.headers` | Cabeceras de la petición. |
| `req.body` | Cuerpo parseado. Next.js incluye un `bodyParser` que analiza JSON y `application/x-www-form-urlencoded` automáticamente. Para `multipart/form-data` se requiere una librería adicional. |
| `req.query` | Objeto con los parámetros de la URL (query string). |
| `req.cookies` | **No disponible por defecto**. Se debe parsear manualmente desde `req.headers.cookie` o usar una librería como `cookie`. |

### `res` (NextApiResponse)

| Método | Descripción |
|--------|-------------|
| `res.status(code)` | Establece el código de estado HTTP. Devuelve `res` para encadenar. |
| `res.json(data)` | Envía una respuesta JSON (establece cabeceras y serializa). |
| `res.send(body)` | Envía la respuesta con un cuerpo (string, Buffer). |
| `res.end()` | Finaliza la respuesta sin datos. |
| `res.setHeader(name, value)` | Establece una cabecera de respuesta. |
| `res.redirect(code, url)` | Redirige a una URL (por defecto 307). |

## Manejo de diferentes métodos HTTP

```javascript
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'GET' })
  }
  if (req.method === 'POST') {
    const { name } = req.body
    return res.status(201).json({ name })
  }
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Método ${req.method} no permitido` })
}
```

## Rutas dinámicas y Catch‑all

Las rutas dinámicas se consiguen con corchetes, igual que en las páginas:

```
pages/api/posts/[id].js    → /api/posts/123
pages/api/docs/[...path].js → /api/docs/a/b/c
```

El valor se recupera a través de `req.query`:

```javascript
// pages/api/posts/[id].js
export default function handler(req, res) {
  const { id } = req.query
  res.json({ postId: id })
}
```

Para catch‑all, `req.query.path` será un array. Para catch‑all opcional (`[[...slug]]`), también captura la ruta base.

## Lectura del cuerpo de la petición

El `bodyParser` incorporado procesa `application/json` y `application/x-www-form-urlencoded`. Para `multipart/form-data` (archivos) se debe desactivar el bodyParser y usar una librería como `formidable` o `multer`.

```javascript
export const config = {
  api: {
    bodyParser: false,  // Desactiva el parser automático
  },
}

export default async function handler(req, res) {
  // Leer el stream manualmente con formidable, etc.
}
```

## Cookies y cabeceras

Para leer cookies, se recomienda parsear `req.headers.cookie` con la librería `cookie`:

```javascript
import cookie from 'cookie'

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
}
```

Para establecer cookies, usar `res.setHeader('Set-Cookie', 'name=value; HttpOnly; Path=/')`.

## Variables de entorno y secretos

Las variables de entorno sin el prefijo `NEXT_PUBLIC_` solo están disponibles en el servidor, por lo que son seguras dentro de las API Routes. Se accede mediante `process.env.MY_SECRET`.

## Manejo de errores

Siempre envuelve la lógica en `try/catch` para devolver un error controlado:

```javascript
export default async function handler(req, res) {
  try {
    const data = await fetchExternal()
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
```

Si no se captura, Next.js devolverá un error 500 genérico en producción.

## CORS y cabeceras personalizadas

Para habilitar CORS, establece las cabeceras correspondientes:

```javascript
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  // ... resto del handler
}
```

Se puede crear un middleware reutilizable (ver más abajo).

## Middlewares en API Routes

No existe un sistema de middleware nativo como en el App Router, pero se pueden implementar patrones de composición:

### Patrón "Higher‑Order Handler"

```javascript
// middleware/withAuth.js
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization
    if (!token) return res.status(401).json({ error: 'No autorizado' })
    return handler(req, res)
  }
}
```

Uso:

```javascript
import { withAuth } from '../../middleware/withAuth'

function handler(req, res) {
  res.json({ data: 'Sensible' })
}
export default withAuth(handler)
```

### Librería `next-connect`

Proporciona una API similar a Express con soporte para middlewares, encadenamiento de métodos y manejo de errores.

```bash
npm install next-connect
```

```javascript
import nc from 'next-connect'
import cors from 'cors'

const handler = nc()
  .use(cors())
  .get((req, res) => res.json({ data: 'GET' }))
  .post((req, res) => res.status(201).json({ created: true }))
  .delete((req, res) => res.status(204).end())

export default handler
```

Permite adjuntar propiedades al `req` y usar `next()` para flujo de control.

## TypeScript en API Routes

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ message: 'Hello' })
}
```

Para métodos específicos puedes sobrecargar el tipo de respuesta.

## Consideraciones de despliegue

- **Serverless**: En Vercel, cada API Route es una función serverless independiente. Límite de ejecución de 10‑30 segundos según el plan. Cold starts pueden afectar la latencia.
- **Node.js standalone**: Con `output: 'standalone'` y `next start`, las API Routes se ejecutan en el servidor Node.js.
- **Exportación estática**: No se pueden usar API Routes con `next export`. Si necesitas backend con exportación estática, debes externalizarlo.

## Buenas prácticas

- Centraliza la lógica común (autenticación, validación) en middlewares reutilizables.
- Valida siempre los datos de entrada con esquemas (ej. `zod`, `yup`).
- Configura CORS correctamente si la API es consumida desde otro dominio.
- Mantén las funciones ligeras; evita importar módulos pesados que no se usen en la ruta.
- No expongas información de errores al cliente en producción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Datos Estructurados (JSON‑LD)](../10-seo/03-datos-estructurados.md) | [🏠 Inicio](../index.md) | [Route Handlers en el App Router ▶](02-route-handlers.md) |
