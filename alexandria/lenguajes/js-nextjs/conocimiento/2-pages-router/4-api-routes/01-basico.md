# API Routes: Conceptos y uso fundamental

## ¿Qué son las API Routes?

Las API Routes en el Pages Router son **endpoints HTTP serverless** que se crean simplemente añadiendo archivos dentro de la carpeta `pages/api/`. Cada archivo exporta por defecto una función `handler` que recibe los objetos `req` (petición) y `res` (respuesta) de Node.js.

Son ideales para:

- Construir una **API REST** o GraphQL sin necesidad de un servidor separado.
- Manejar envíos de formularios, webhooks, autenticación.
- Proxys a servicios externos.
- Lógica de servidor ligera que complementa las páginas.

## Estructura mínima

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' })
}
```

- El archivo debe estar dentro de `pages/api/`. La ruta resultante será `/api/hello`.
- Solo se permite una exportación por defecto (la función handler). Si se exportan otras cosas (como constantes), no afecta.
- Soporta cualquier verbo HTTP: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`.

## Los objetos `req` y `res`

Next.js utiliza los objetos nativos de Node.js (http.IncomingMessage y http.ServerResponse) con algunas extensiones:

### `req` – Petición

| Propiedad / método     | Descripción                                                                                      |
|------------------------|--------------------------------------------------------------------------------------------------|
| `req.method`           | El método HTTP (GET, POST, etc.).                                                                |
| `req.url`              | La URL de la petición (sin host).                                                                |
| `req.headers`          | Objeto con las cabeceras de la petición.                                                         |
| `req.body`             | Cuerpo parseado de la petición (disponible si se ha consumido antes; por defecto está disponible después de leer el stream). En Next.js, el cuerpo se parsea automáticamente si es JSON o `application/x-www-form-urlencoded`, pero no para `multipart/form-data`. |
| `req.query`            | Objeto con los parámetros de la URL (query string). Equivalente a `url.parse(req.url, true).query`. |
| `req.cookies`          | Objeto con las cookies parseadas. **Disponible solo si se usa `cookie` parser**; Next.js no lo incluye por defecto. Se puede usar una librería o leer `req.headers.cookie`. |

### `res` – Respuesta

| Método                 | Descripción                                                                                      |
|------------------------|--------------------------------------------------------------------------------------------------|
| `res.status(code)`     | Establece el código de estado HTTP. Devuelve `res` para encadenar.                               |
| `res.json(data)`       | Envía una respuesta JSON (establece cabeceras y serializa).                                      |
| `res.send(body)`       | Envía el cuerpo de la respuesta (string, Buffer, etc.).                                          |
| `res.end()`            | Finaliza la respuesta sin datos.                                                                 |
| `res.setHeader(name, value)` | Establece una cabecera de respuesta.                                                        |
| `res.redirect(code, url)`  | Redirige a una URL (por defecto 307).                                                        |

## Manejo de diferentes métodos HTTP

```javascript
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'GET recibido' })
  }
  if (req.method === 'POST') {
    const { name } = req.body
    return res.status(201).json({ name })
  }
  // Método no permitido
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Método ${req.method} no permitido` })
}
```

## Rutas dinámicas en API Routes

Funcionan igual que las páginas: archivos con `[param]`.

```
pages/api/posts/[id].js → /api/posts/123
```

```javascript
export default function handler(req, res) {
  const { id } = req.query
  res.status(200).json({ postId: id })
}
```

## Rutas Catch‑all

```
pages/api/docs/[...path].js → /api/docs/a/b/c
```

```javascript
export default function handler(req, res) {
  const { path } = req.query // path = ['a', 'b', 'c']
  res.json({ path })
}
```

Catch‑all opcional: `pages/api/shop/[[...slug]].js` → también captura `/api/shop`.

## Lectura del cuerpo de la petición

Next.js incorpora un **bodyParser** que analiza automáticamente los cuerpos en JSON o `application/x-www-form-urlencoded`. Para `multipart/form-data` (archivos) se necesita una librería adicional como `formidable` o `multer`.

```javascript
export default function handler(req, res) {
  console.log(req.body) // { name: 'valor' } para POST con JSON
}
```

> [!NOTE]
> **Nota**: Si se necesita el cuerpo crudo (por ejemplo, para webhooks con firma), se puede desactivar el bodyParser:

```javascript
export const config = {
  api: {
    bodyParser: false,
  },
}
```

Luego se debe leer el stream manualmente.

## Cabeceras y cookies

- Establecer cabeceras de respuesta:
  ```javascript
  res.setHeader('X-Custom', 'valor')
  res.setHeader('Cache-Control', 's-maxage=3600')
  ```

- Leer cookies: al no haber parser nativo, se recomienda leer `req.headers.cookie` y parsear con librerías como `cookie`.

```javascript
import cookie from 'cookie'

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  // ...
}
```

- Establecer cookies: usar `Set-Cookie` en `res.setHeader`.

## Variables de entorno

Acceder a variables de entorno es directo: `process.env.MY_SECRET`. Las variables sin el prefijo `NEXT_PUBLIC_` solo están disponibles en el servidor (API Routes, `getStaticProps`, etc.).

## Manejo de errores

Siempre envolver la lógica en `try/catch` para responder con un error controlado:

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

Si se lanza una excepción no capturada, Next.js responderá con un error 500 genérico en producción y mostrará el stack en desarrollo.

## Casos de uso frecuentes

1. **Formularios de contacto**: `POST /api/contact` → valida, envía email, guarda en BD.
2. **Webhooks**: `POST /api/webhook` → lee el cuerpo crudo, verifica firma, procesa evento.
3. **Autenticación**: `POST /api/login`, `POST /api/register`, manejo de tokens.
4. **Proxy a API externa**: ocultar claves, añadir cabeceras.
5. **Generación dinámica de recursos**: `GET /api/og-image` genera una imagen Open Graph en caliente.

## Consideraciones sobre Serverless

En plataformas como Vercel, cada API Route se despliega como una función serverless independiente. Esto implica:

- **Límites de tiempo de ejecución**: 10 segundos en el plan Hobby, hasta 30 segundos en Pro.
- **Cold starts**: la primera invocación puede ser más lenta. Optimizar con imports dinámicos y mantener el código ligero.
- **Sin estado**: no se pueden mantener conexiones persistentes (WebSockets). Cada petición se ejecuta en un entorno aislado.

## Buenas prácticas

- Validar siempre los datos de entrada (usar librerías como `zod` o `yup`).
- Establecer cabeceras CORS si la API se consume desde un dominio diferente.
- Usar rate limiting con librerías o servicios externos.
- No exponer información sensible en los mensajes de error.

## TypeScript

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ message: 'Hello' })
}
```

Para métodos más específicos:

```typescript
type GetResponse = { items: any[] }
type PostResponse = { created: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse>
) {
  if (req.method === 'GET') {
    return res.status(200).json({ items: [] })
  }
  // ...
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fallback modes](../3-data-fetching/04-fallback-modes.md) | [🏠 Inicio](../../index.md) | [Patrones de middleware en API Routes del Pages Router ▶](02-middlewares.md) |
