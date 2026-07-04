# Server Actions

## Definición

Las **Server Actions** son funciones asíncronas que se ejecutan en el servidor pero que pueden ser invocadas desde componentes del cliente (o formularios) sin necesidad de crear un Route Handler manualmente. Son una forma de RPC (Remote Procedure Call) integrada en Next.js.

Se definen con la directiva `'use server'`.

```ts
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // lógica de servidor: base de datos, revalidación...
  revalidatePath('/posts')
}
```

## Invocación desde un formulario

La forma más directa es usar la prop `action` de un formulario HTML:

```tsx
import { createPost } from './actions'

export default function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Crear</button>
    </form>
  )
}
```

Al enviar, se ejecuta `createPost` en el servidor, y se recibe el `FormData` como argumento. El componente no necesita ser Client Component.

## Invocación programática

Desde un Client Component, se puede llamar a una Server Action directamente (como si fuera una función local), pero hay que tener en cuenta que la función se ejecutará en el servidor.

```tsx
'use client'
import { createPost } from './actions'

export function CreateButton() {
  const handleClick = async () => {
    // La Server Action puede recibir datos no serializables? No, se serializan.
    const result = await createPost({ title: 'Nuevo post' })
  }
  return <button onClick={handleClick}>Crear</button>
}
```

> [!IMPORTANT]
> **Importante**: Los argumentos deben ser serializables (objetos planos, FormData, etc.). Si la acción se llama desde un formulario, recibe `FormData`; si se llama programáticamente, puede recibir objetos serializables.

## Revalidación tras mutación

Es muy común usar `revalidatePath` o `revalidateTag` dentro de una Server Action para actualizar la UI inmediatamente después de una mutación.

```ts
'use server'
import { revalidatePath } from 'next/cache'

export async function deletePost(postId: string) {
  // eliminar de BD
  revalidatePath('/posts') // actualiza la lista
}
```

## Estados de carga con `useFormStatus` y `useActionState`

React ofrece hooks para gestionar el estado del formulario:

- **`useFormStatus`**: Devuelve `{ pending }` para mostrar un spinner mientras se ejecuta la acción.

```tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Enviando...' : 'Enviar'}</button>
}
```

- **`useActionState`**: Permite manejar respuestas y errores de la Server Action con un estado.

```tsx
import { useActionState } from 'react-dom'
import { createPost } from './actions'

const initialState = { error: null }

export default function Form() {
  const [state, action, isPending] = useActionState(createPost, initialState)
  return (
    <form action={action}>
      <input name="title" />
      {state.error && <p>{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
```

La Server Action debe aceptar `prevState` y los datos del formulario, y devolver el nuevo estado.

```ts
'use server'
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  if (!title) return { error: 'Título requerido' }
  // crear post
  revalidatePath('/posts')
  return { error: null }
}
```

## Consideraciones de seguridad

- Las Server Actions crean automáticamente endpoints POST que Next.js protege con tokens CSRF. No hay que preocuparse por CSRF si se usan con formularios.
- Validar siempre los datos de entrada; nunca confiar en el cliente.
- No exponer secretos en las acciones; se ejecutan en el servidor, pero el código puede ser visible si se comparte en el bundle del cliente (aunque el código de la acción se mantiene en el servidor, los argumentos pueden ser inspeccionados).

## Tamaño límite del cuerpo

Por defecto, las Server Actions aceptan cuerpos de hasta 1 MB. Se puede modificar en `next.config.js`:

```js
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

## Server Actions y `redirect`

Se puede usar `redirect` dentro de una acción para redirigir después de la mutación.

```ts
'use server'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // ...
  redirect('/posts')
}
```

## Server Actions vs Route Handlers

- Las Server Actions son más simples para mutaciones asociadas a formularios.
- Los Route Handlers son más adecuados para APIs públicas, webhooks o cuando se necesita control fino sobre métodos y cabeceras.
- Las Server Actions pueden revalidar datos y usar `fetch` internamente, pero no pueden ser llamadas desde fuera de la aplicación.

## Buenas prácticas

- Define las Server Actions en archivos separados (`lib/actions.ts`, `app/actions.ts`) para mantener la organización.
- Tipa los parámetros y retornos para mejorar la mantenibilidad.
- Maneja errores de forma consistente (retorna objetos de error, no lanzar excepciones no controladas).
- Aprovecha `useActionState` para formularios con validación compleja.

---

Estos cinco temas cubren integralmente la obtención y mutación de datos en el App Router, desde el fetch extendido hasta las modernas Server Actions, proporcionando las herramientas para construir aplicaciones rápidas, estáticas o dinámicas, con un control granular del caché.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Funciones Dinámicas y Comportamiento de Ruta](04-dynamic-functions.md) | [🏠 Inicio](../../index.md) | [Server‑Side Rendering (SSR) ▶](../../4-renderizado/01-ssr.md) |
