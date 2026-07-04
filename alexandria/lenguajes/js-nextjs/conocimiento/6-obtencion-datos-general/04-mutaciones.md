# Mutaciones de datos en Next.js

Realizar operaciones de creación, actualización o eliminación de datos es una necesidad fundamental. Next.js ofrece varias vías, cada una con sus ventajas.

## 1. Server Actions (App Router)

Son funciones asíncronas del servidor que se pueden invocar directamente desde formularios o eventos en el cliente sin crear un endpoint manual.

```ts
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  if (!title) return { error: 'El título es obligatorio' }
  
  // Lógica de negocio (insertar en BD, etc.)
  revalidatePath('/posts')
  redirect('/posts')
}
```

- Se utilizan con `useActionState` y `useFormStatus` para manejar estados de carga y errores en el cliente.
- Protección CSRF automática.
- Simplicidad: no necesitas escribir Route Handlers para operaciones ligadas a la UI.

## 2. API Routes (Pages Router)

En el Pages Router se crean endpoints en `pages/api/` que reciben `req` y `res`.

```javascript
// pages/api/posts.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title } = req.body
    // validar y guardar
    res.status(201).json({ success: true })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
```

- Adecuado para aplicaciones con Pages Router o cuando se necesita una API pública.
- No tiene integración automática de CSRF; debe manejarse manualmente.

## 3. Route Handlers (App Router)

Archivos `route.ts` dentro del App Router que exportan funciones como `GET`, `POST`, etc.

```ts
// app/api/posts/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  // validar, guardar
  return Response.json({ success: true }, { status: 201 })
}
```

- Ofrecen control total sobre la respuesta, cabeceras, streaming.
- Útiles para webhooks, APIs consumidas por terceros o clientes externos.
- Pueden usar revalidación con `revalidatePath`/`revalidateTag`.

## 4. Revalidación tras mutaciones

Independientemente del método elegido, es crucial actualizar la interfaz para reflejar los cambios.

- En Server Actions o Route Handlers: `revalidatePath('/ruta')` o `revalidateTag('etiqueta')`.
- En Pages Router: se puede devolver una redirección o usar `router.push` en el cliente tras una respuesta exitosa.

## 5. Optimistic Updates

Consiste en actualizar la UI de forma inmediata, antes de que la mutación se confirme en el servidor, para una experiencia más fluida. Se implementa mediante librerías como `swr` o `react-query`, o manualmente con estado.

Ejemplo con `useOptimistic` de React (experimental) junto con Server Actions:

```tsx
'use client'
import { useOptimistic } from 'react'

export function TodoList({ initialTodos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state, newTodo) => [...state, newTodo]
  )

  const formAction = async (formData: FormData) => {
    const newTodo = { id: Date.now(), text: formData.get('text') }
    addOptimisticTodo(newTodo)
    await addTodo(formData) // Server Action
  }

  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  )
}
```

## 6. Manejo de errores

- Server Actions: devolver un objeto con `error` y mostrarlo en el cliente (usando `useActionState`).
- Route Handlers: devolver códigos de estado HTTP 4xx/5xx y manejar en el cliente con `try/catch` o respuestas estándar.
- API Routes: `res.status(500).json({ error: '...' })`.

## 7. Comparativa de enfoques

| Método            | Dónde se define            | Ideal para                                   |
|-------------------|----------------------------|----------------------------------------------|
| Server Actions    | `'use server'` en función  | Mutaciones desde formularios/UI              |
| Route Handlers    | `route.ts`                 | APIs públicas, webhooks, múltiples clientes  |
| API Routes        | `pages/api/`               | Proyectos con Pages Router                   |

## 8. Patrones recomendados

- Centraliza las mutaciones en archivos dedicados (acciones o servicios) para facilitar el testing y la reutilización.
- Valida siempre los datos de entrada con `zod` o similar.
- Revalida solo las rutas necesarias para no sobrecargar el sistema.
- Para operaciones muy complejas, combina Server Actions con Route Handlers si se requiere exponer la misma lógica a clientes externos.

Con estos cuatro bloques, se cubre en profundidad todo el espectro de obtención y mutación de datos en las dos arquitecturas de Next.js, desde las funciones clásicas del Pages Router hasta las modernas Server Actions y el sofisticado sistema de caché.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Sistema de caché en Next.js](03-cacheo.md) | [🏠 Inicio](../index.md) | [Optimización de imágenes con `next/image ▶](../7-optimizaciones/01-imagenes.md) |
