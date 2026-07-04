# Server Actions: Puente entre Cliente y Servidor

## Concepto

Las **Server Actions** son funciones asíncronas del servidor que pueden ser invocadas directamente desde el cliente (por ejemplo, desde un `form` o un `onClick`) sin necesidad de crear un Route Handler manual. Son una de las innovaciones más potentes del App Router.

Se definen con la directiva `'use server'`.

## Definición y tipos

Pueden definirse de dos formas:

1. **En un archivo separado** con `'use server'` en la primera línea. Todas las funciones exportadas son Server Actions.
   ```ts
   // app/actions.ts
   'use server'
   
   export async function createPost(formData: FormData) {
     // lógica en servidor
   }
   ```

2. **Dentro de un Server Component** marcando una función inline con `'use server'`. Útil para acciones que requieren cierre (closure) con datos del componente.
   ```tsx
   // app/page.tsx
   import { revalidatePath } from 'next/cache'
   
   export default function Page() {
     async function updateItem(data: FormData) {
       'use server'
       // ...
     }
     return <form action={updateItem}>...</form>
   }
   ```

## ¿Cómo se invocan?

- **Desde un formulario**: usando la prop `action` de `<form>`. El navegador envía automáticamente el `FormData` a la acción.
- **Desde un Client Component**: llamándola como una función asíncrona normal. Solo se pueden pasar argumentos serializables (objetos planos, `FormData`, etc.). No se pueden pasar funciones o clases.

```tsx
// En un Client Component
import { createPost } from './actions'

<button onClick={async () => {
  await createPost({ title: 'Nuevo' })
}}>Crear</button>
```

## Funcionamiento interno

Next.js transforma automáticamente las Server Actions en endpoints POST. Cuando se invocan, el framework:

1. Serializa los argumentos y los envía al servidor.
2. Ejecuta la función en el servidor.
3. Devuelve el resultado (si es necesario) o un flujo de revalidación.
4. Aplica protecciones CSRF automáticas.

## Revalidación de la UI después de una acción

Es muy común usar `revalidatePath` o `revalidateTag` dentro de la acción para actualizar las páginas cacheadas.

```ts
'use server'
import { revalidatePath } from 'next/cache'

export async function deletePost(postId: string) {
  // ... eliminar de BD
  revalidatePath('/posts')
}
```

Esto hace que la página `/posts` se regenere en segundo plano y el cliente vea los cambios sin recargar.

## Manejo de estado de carga y errores

React proporciona hooks específicos para Server Actions:

- **`useFormStatus`**: lee el estado `pending` del formulario.
- **`useActionState`**: maneja el estado, los errores y la respuesta de la acción.

```tsx
'use client'
import { useActionState } from 'react-dom'
import { createPost } from './actions'

const initialState = { error: null }

export default function NewPostForm() {
  const [state, action, isPending] = useActionState(createPost, initialState)

  return (
    <form action={action}>
      <input name="title" />
      {state.error && <p className="error">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear Post'}
      </button>
    </form>
  )
}
```

La acción debe aceptar el estado previo como primer argumento:

```ts
'use server'
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  if (!title) return { error: 'Título obligatorio' }
  // ...
  revalidatePath('/posts')
  return { error: null }
}
```

## Server Actions y redirecciones

Puedes usar `redirect` desde `next/navigation` dentro de una Server Action para redirigir después de una mutación.

```ts
'use server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  // ... validar
  redirect('/dashboard')
}
```

## Seguridad

- **CSRF**: Next.js incluye automáticamente un token secreto en la petición y lo verifica en el servidor. No necesitas configuración adicional.
- **Validación**: los argumentos vienen del cliente, por lo que **debes validar siempre** los datos dentro de la acción (usa `zod`, `yup`, etc.).
- **Secrets**: el código de las Server Actions permanece en el servidor. Aunque el cliente pueda ver qué función se llama, no puede acceder a su implementación.
- **Límite de tamaño**: por defecto, las Server Actions aceptan un cuerpo de hasta 1 MB. Se puede cambiar en `next.config.js`:
  ```js
  module.exports = {
    experimental: {
      serverActions: { bodySizeLimit: '2mb' }
    }
  }
  ```

## ¿Cuándo usar Server Actions vs Route Handlers?

- **Server Actions**: para mutaciones asociadas a la interfaz de usuario (crear, actualizar, eliminar). Se integran perfectamente con formularios y revalidación. No generan un endpoint público.
- **Route Handlers (`route.ts`)**: para APIs que necesitan ser consumidas por clientes externos (webhooks, aplicaciones móviles) o para operaciones que no están ligadas a un componente React. Permiten control total sobre el método HTTP, cabeceras, etc.

## Optimizaciones y limitaciones

- Una Server Action se ejecuta en el mismo entorno que el resto de la aplicación; puede ser Node.js o Edge según la configuración del segmento.
- No pueden ser llamadas desde Server Components para pasar datos al cliente (eso sería una petición innecesaria). Están pensadas para interacciones del cliente.
- Si una acción se usa frecuentemente desde un Client Component, el código de la acción no se expone, pero la definición de la función sí se incluye en el bundle del cliente para permitir la llamada? Realmente solo se incluye una referencia serializada; el código de la acción permanece en el servidor.

## Buenas prácticas

- Centraliza las acciones en archivos como `lib/actions.ts` o `app/actions.ts`.
- Valida siempre con esquemas.
- Retorna estados claros (`{ success: boolean, error?: string }`) para manejar en el cliente.
- Combina `useActionState` y `useFormStatus` para formularios robustos.
- Usa nombres de acción descriptivos (`createUser`, `deleteComment`).

Con esta profundización, tienes un dominio completo de la arquitectura de componentes dual y las Server Actions, la base sobre la que se construye cualquier aplicación moderna con el App Router.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrones de Composición Server/Client](03-patrones.md) | [🏠 Inicio](../index.md) | [Métodos de obtención de datos en el Pages Router ▶](../6-obtencion-datos-general/01-pages-metodos.md) |
