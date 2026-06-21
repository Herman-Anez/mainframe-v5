# Patrones de middleware en API Routes del Pages Router

## Concepto

El Pages Router **no posee un sistema de middleware nativo como el App Router** (archivo `middleware.ts`). Para aplicar lógica transversal (autenticación, logging, CORS, validación) en las API Routes, se utilizan patrones de **middleware manual** o librerías como **`next-connect`**.

Estas técnicas permiten encadenar funciones que se ejecutan antes (o después) del handler final, modificando la petición o la respuesta, o cortando la ejecución si es necesario.

## Patrón básico: función envolvente (Higher‑Order Handler)

Consiste en crear una función que toma el handler original y devuelve un nuevo handler con la lógica adicional.

```javascript
// middleware/withAuth.js
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    // Verificar token (simulado)
    // req.user = { id: 1 }  // adjuntar datos al request
    return handler(req, res)
  }
}
```

Uso en la API Route:

```javascript
import { withAuth } from '../../middleware/withAuth'

function handler(req, res) {
  res.status(200).json({ data: 'Sensible' })
}

export default withAuth(handler)
```

Si se necesitan múltiples middlewares, se pueden componer manualmente:

```javascript
export default withAuth(withLogger(handler))
```

**Problema**: La composición puede volverse ilegible. Además, el manejo de errores en cada middleware debe ser explícito.

## Patrón con promesas y composición asistida

Se puede crear una función `applyMiddlewares` que recorra un array de middlewares:

```javascript
function applyMiddlewares(middlewares, handler) {
  return async (req, res) => {
    for (const middleware of middlewares) {
      await middleware(req, res)
      if (res.writableEnded) return // Si el middleware ya respondió, parar
    }
    return handler(req, res)
  }
}
```

Ejemplo:

```javascript
export default applyMiddlewares(
  [withAuth, withLogger, withValidation],
  (req, res) => {
    res.json({ ok: true })
  }
)
```

Sin embargo, este enfoque no maneja automáticamente los errores lanzados y es más rudimentario.

## Librería `next-connect`

**`next-connect`** es una librería que implementa un enrutador y middleware al estilo Express.js para Next.js API Routes. Es la solución más robusta y ampliamente usada.

### Instalación

```bash
npm install next-connect
```

### Uso básico

```javascript
import nc from 'next-connect'

const handler = nc()
  .get((req, res) => {
    res.json({ method: 'GET' })
  })
  .post((req, res) => {
    res.json({ method: 'POST' })
  })
  .delete((req, res) => {
    res.json({ method: 'DELETE' })
  })

export default handler
```

- Soporta encadenamiento de métodos HTTP.
- Los métodos no definidos devuelven 405 automáticamente (configurable).

### Middlewares en `next-connect`

La API `.use()` permite agregar middlewares que se ejecutan en orden antes del handler de la ruta.

```javascript
const handler = nc()
  .use((req, res, next) => {
    // Logger
    console.log(`${req.method} ${req.url}`)
    next()
  })
  .get((req, res) => {
    res.json({ message: 'OK' })
  })
```

> [!IMPORTANT]
> **Importante**: El middleware debe llamar a `next()` para continuar con el siguiente middleware o handler. Si no llama a `next()`, la cadena se detiene.

### Middlewares con propiedades personalizadas

Se puede extender el objeto `req` para pasar datos entre middlewares.

```javascript
const handler = nc()
  .use((req, res, next) => {
    req.user = { id: 1 }
    next()
  })
  .get((req, res) => {
    res.json({ userId: req.user.id })
  })
```

En TypeScript, se debe extender el tipo de `NextApiRequest` con la propiedad adicional.

### Manejo de errores

`next-connect` captura errores lanzados o pasados a `next(error)`. Se puede definir un handler de error global:

```javascript
const handler = nc({
  onError: (err, req, res) => {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: 'Method not allowed' })
  },
})
```

### Middlewares comunes con `next-connect`

1. **Autenticación**:
   ```javascript
   export function authMiddleware(req, res, next) {
     const token = req.headers.authorization
     if (!token) return res.status(401).json({ error: 'Unauthorized' })
     // Verificar...
     next()
   }
   ```

2. **CORS**:
   ```javascript
   export function cors(req, res, next) {
     res.setHeader('Access-Control-Allow-Origin', '*')
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
     if (req.method === 'OPTIONS') {
       return res.status(200).end()
     }
     next()
   }
   ```

3. **Validación de esquema** (con `zod`):
   ```javascript
   export function validateBody(schema) {
     return (req, res, next) => {
       const result = schema.safeParse(req.body)
       if (!result.success) {
         return res.status(400).json({ errors: result.error.issues })
       }
       req.validatedBody = result.data
       next()
     }
   }
   ```

4. **Rate Limiting** (con `rate-limiter-flexible`):
   Se puede implementar, pero ten en cuenta la naturaleza serverless (el estado debe guardarse externamente, en Redis por ejemplo).

## Composición y organización de middlewares

En proyectos grandes, se crean archivos separados para cada middleware y se combinan en la API Route:

```javascript
// pages/api/protected.js
import nc from 'next-connect'
import { auth, cors, validateBody } from '../../middleware'
import { postSchema } from '../../schemas'

const handler = nc()
  .use(cors)
  .use(auth)
  .post(validateBody(postSchema), (req, res) => {
    // req.validatedBody disponible
    res.status(201).json({ created: true })
  })

export default handler
```

## Manejo de `next()` y finalización de respuesta

- Si un middleware envía una respuesta (`res.json()`, etc.), debe detener la cadena. `next-connect` recomienda no llamar a `next()` si ya se respondió. Usar `return res.status(...).json(...)` previene continuaciones accidentales.
- En middlewares que solo hacen preparación (cors, logging), siempre llamar a `next()` al final.

## Custom middleware sin `next-connect`

Si no se desea usar una librería, se puede crear una función `runMiddleware` que adapte middlewares compatibles con Connect (por ejemplo, `cors` de la librería `cors`):

```javascript
// lib/runMiddleware.js
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
```

Uso:

```javascript
import Cors from 'cors'
const cors = Cors({ methods: ['GET'] })

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)
  // Handler principal
}
```

Este patrón es útil para reutilizar middlewares del ecosistema Express.

## Middleware a nivel global

No hay un gancho global para inyectar middleware automáticamente en todas las API Routes del Pages Router. Si se necesita aplicar un middleware a todas las rutas, se debe envolver cada una o crear un archivo base y reexportarlo.

Una solución común es crear un `api-handler.ts` que ya incluya middlewares globales y luego importarlo en cada ruta:

```javascript
// lib/api-handler.js
import nc from 'next-connect'
import { cors, auth } from './middlewares'

export const apiHandler = () => nc().use(cors).use(auth)
```

```javascript
// pages/api/users.js
import { apiHandler } from '../../lib/api-handler'

const handler = apiHandler()
  .get((req, res) => { ... })

export default handler
```

## Consideraciones de rendimiento

- Los middlewares se ejecutan en cada petición; mantén su lógica ligera.
- Evita operaciones bloqueantes; usa async/await para IO.
- En serverless, el cold start puede aumentar si se importan muchos middlewares con dependencias pesadas. Utiliza imports dinámicos si un middleware no es necesario en todas las rutas.

## Diferencias con el middleware del App Router

- En App Router, `middleware.ts` se ejecuta en el Edge Runtime y puede interceptar tanto páginas como API routes. Tiene acceso a `NextRequest` y `NextResponse`.
- Las API Routes del Pages Router no pasan por ese middleware. Para compartir lógica entre ambos, se debe duplicar o extraer a funciones comunes.

## Buenas prácticas

- Mantén cada middleware con una única responsabilidad.
- Usa TypeScript para tipar las extensiones del `req`.
- Centraliza la configuración de CORS y otros ajustes comunes.
- Prueba los middlewares unitariamente.

Con estos patrones, las API Routes del Pages Router pueden tener una arquitectura modular, mantenible y similar a la de frameworks como Express, sin sacrificar la simplicidad del sistema de archivos de Next.js.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ API Routes: Conceptos y uso fundamental](01-basico.md) | [🏠 Inicio](../../index.md) | [Patrón de Layout por Página ▶](../5-layouts/01-per-page-layout.md) |
