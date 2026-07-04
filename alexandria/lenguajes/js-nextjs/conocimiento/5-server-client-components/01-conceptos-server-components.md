# React Server Components en Next.js

## ¿Qué son los Server Components?

Los **React Server Components (RSC)** son un nuevo tipo de componentes introducidos por React y adoptados por Next.js a partir del App Router. A diferencia de los componentes tradicionales (Client Components), los Server Components se ejecutan **exclusivamente en el servidor** y nunca se hidratan en el cliente.

Next.js trata **por defecto todos los componentes del App Router como Server Components**, a menos que se indique explícitamente `'use client'`.

## Filosofía de los Server Components

La idea es separar el código en dos planos:

- **Servidor**: se encarga de obtener datos, renderizar contenido estático, acceder a recursos privados.
- **Cliente**: se encarga de la interactividad (estado, efectos, eventos).

Esto permite enviar **menos JavaScript al cliente**, mejorar el rendimiento y mantener secretos en el servidor.

## Características fundamentales

- Se ejecutan **solo en el servidor** durante el renderizado (SSR, SSG o ISR) y nunca se envían como JavaScript al navegador.
- Pueden ser **asíncronos** (`async function Component() {}`), lo que permite esperar datos directamente sin necesidad de hooks.
- Tienen acceso directo a **recursos del servidor**: bases de datos, sistemas de archivos, secretos, APIs internas.
- **No pueden usar estado, efectos, contextos, ni hooks** del lado del cliente (`useState`, `useEffect`, `createContext`, etc.). Tampoco pueden tener manejadores de eventos (`onClick`, `onChange`).
- Sus **props deben ser serializables** (datos primitivos, objetos planos, React elements que sean Server Components). No se pueden pasar funciones como props porque el cliente no puede ejecutarlas.
- Generan **JSX estático** que se envía al cliente como HTML (y como representación de React para la hidratación posterior de Client Components anidados).

## ¿Cómo sabe Next.js que un componente es de servidor?

- En el App Router, **todo es Server Component por defecto**. No necesitas añadir ninguna directiva.
- Solo cuando se escribe `'use client'` al principio de un archivo, ese módulo y todos sus imports se convierten en Client Components (se ejecutarán también en el cliente).

## Ciclo de vida en el servidor

1. Next.js recibe una petición.
2. Identifica el árbol de componentes para esa ruta.
3. Ejecuta los Server Components: resuelve sus `async`, ejecuta `fetch`, consultas a BD, etc.
4. Genera el HTML final y una representación serializada (RSC Payload) que contiene las props y el marcado de los Client Components.
5. Envía el HTML al cliente junto con los bundles de JS necesarios.
6. El cliente hidrata los Client Components, mientras que los Server Components permanecen como HTML estático.

## Beneficios de los Server Components

- **Reducción del tamaño del bundle**: el código del servidor no se envía al cliente. Sólo los Client Components llevan JavaScript al navegador.
- **SEO mejorado**: el contenido se incluye directamente en el HTML inicial.
- **Seguridad**: las claves API, tokens y lógica sensible permanecen en el servidor.
- **Menor carga de trabajo para el cliente**: el servidor puede hacer el trabajo pesado (consultas, renderizado).
- **Streaming nativo**: combinados con `<Suspense>`, permiten enviar partes de la página a medida que están listas.

## Limitaciones que debes conocer

- No pueden manejar eventos (`onClick`, `onSubmit`). Si necesitas interactividad, debes usar un Client Component.
- No pueden importar Client Components y usarlos como JSX directamente… **¡sí pueden!** Pueden importar un Client Component y renderizarlo. Pero **un Client Component no puede importar un Server Component** y renderizarlo en su interior; en cambio, el Server Component puede pasar un Server Component como `children` a un Client Component.
- El estado global mediante React Context no está disponible porque los Server Components no soportan `createContext` ni `useContext`. Sin embargo, se puede inyectar un proveedor de contexto desde un Client Component que envuelva a los hijos (patrón de providers).

## ¿Cuándo usar Server Components?

- Para el esqueleto principal de la aplicación: layouts, cabeceras, pies de página que no requieren estado.
- Para páginas que obtienen datos (listas, artículos, productos).
- Para cualquier lógica que acceda a sistemas de archivos, bases de datos o APIs internas.
- Para envolver la aplicación con proveedores de contexto (mediante un Client Component intermedio).

## Ejemplo básico

```tsx
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(res => res.json())
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

No hay `'use client'`, así que es un Server Component. Se ejecuta en el servidor, obtiene los datos y envía HTML puro.

## Server Components vs Componentes tradicionales (Pages Router)

En el Pages Router, todos los componentes podían ser renderizados en servidor o cliente, pero el código siempre se incluía en el bundle del cliente. Con RSC, hay una separación real: el código del servidor nunca llega al navegador.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Renderizado Dinámico vs Estático](../4-renderizado/06-dinamico-vs-estatico.md) | [🏠 Inicio](../index.md) | [Componentes de Cliente en el App Router ▶](02-client-components.md) |
