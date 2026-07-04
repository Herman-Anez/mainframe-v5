# React Server Components (RSC)

React Server Components es un nuevo paradigma que permite ejecutar componentes **solo en el servidor**, enviando su salida (HTML y un formato serializado) al cliente sin incluir su código JavaScript en el bundle.

## ¿Qué son los RSC?
Son componentes que se renderizan exclusivamente en el servidor (o en build time). No tienen estado interactivo, no pueden usar hooks como `useState` o `useEffect`, pero pueden acceder directamente a bases de datos, sistemas de archivos o APIs internas sin exponer detalles al cliente. Su resultado se serializa en un formato especial (RSC Payload) y se envía al cliente, donde React lo combina con los componentes cliente para formar la interfaz final.

## Componentes de servidor vs. componentes de cliente
- **Server Components (predeterminados en Next.js App Router)**: se ejecutan en el servidor. Pueden ser async/await para leer datos. No se hidratan ni tienen interactividad.
- **Client Components**: se ejecutan en el servidor (SSR) y en el cliente. Para usar estado, efectos, eventos, se debe añadir la directiva `'use client'` al inicio del archivo.

## Cómo funciona la integración
1. El servidor renderiza los Server Components, que pueden incluir Client Components en su árbol.
2. Los Server Components se convierten en un stream de datos (RSC Payload) que contiene la estructura de la UI y las props para los Client Components.
3. El cliente recibe ese stream, lo reconcilia con el árbol, hidrata los Client Components y muestra la interfaz.
4. Las actualizaciones subsiguientes (navegación SPA) pueden solicitar solo el payload de la nueva ruta sin recargar la página.

## Ventajas
- **Bundle más pequeño**: las librerías usadas solo en el servidor no se envían al cliente.
- **Acceso directo al backend**: evita capas de API; el componente puede hacer consultas SQL directamente.
- **SEO mejorado**: el contenido se renderiza completamente en el servidor.
- **Composición natural**: mezclas componentes de servidor y cliente en el mismo árbol, definiendo límites claros.

## Ejemplo conceptual (Next.js App Router)
```jsx
// app/posts/page.js - Server Component por defecto
import { db } from '@/lib/db';
import PostList from './PostList'; // Client Component

export default async function PostsPage() {
  const posts = await db.post.findMany();
  return <PostList posts={posts} />;
}
```

```jsx
// app/posts/PostList.js
'use client';
import { useState } from 'react';

export default function PostList({ posts }) {
  const [filter, setFilter] = useState('');
  // ...
}
```

## Desafíos y consideraciones
- Los Server Components no pueden tener estado ni manejar eventos; se debe pensar cuidadosamente dónde colocar la interactividad.
- La serialización del payload impone restricciones: los props de un Server a un Client Component deben ser serializables (no funciones, Date, etc., aunque se está trabajando en mejorar esto).
- El ecosistema aún está madurando; muchas librerías están adaptándose para soportar `'use client'` y funcionar correctamente con RSC.
- La navegación SPA con RSC requiere frameworks como Next.js o Remix; no es algo que se pueda usar directamente con Create React App.

## RSC y Suspense
Los Server Components se integran profundamente con Suspense: un componente de servidor puede envolverse en un `Suspense` para mostrar un fallback mientras se espera el stream de datos del servidor. Esto permite una carga progresiva (streaming) sin necesidad de configuraciones complejas.

## Futuro de React
RSC representa el siguiente paso en la evolución de React hacia una arquitectura híbrida servidor-cliente, donde la línea entre ambos entornos se difumina pero con contratos claros. React 18 sentó las bases con las APIs de `Suspense` y transiciones; React 19 consolida el patrón con `use()` y mejoras en RSC.

---

Este bloque te sitúa en la vanguardia del desarrollo React: desde el corazón concurrente que hace posible una experiencia de usuario fluida, pasando por las APIs que te permiten priorizar y coordinar el trabajo, hasta los Server Components que redefinen dónde y cómo se ejecuta tu código. Dominar estos conceptos te prepara para la próxima década de aplicaciones web.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Transiciones: `startTransition` y `useTransition`](04-transiciones-starttransition-y-usetransition.md) | [🏠 Inicio](../index.md) | [React Router ▶](../13-enrutamiento/01-react-router.md) |
