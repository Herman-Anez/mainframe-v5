# React Query y SWR (Server State)

Estas librerías no gestionan "estado global cliente" en el sentido tradicional, sino el **estado del servidor** (datos que provienen de una API). Resuelven el fetching, cacheo, sincronización y actualización de datos asíncronos, eliminando la necesidad de almacenarlos manualmente en Redux o Zustand.

## React Query (TanStack Query)

### Conceptos fundamentales
- **`useQuery`**: hook para obtener datos. Acepta una `queryKey` (identificador único) y una función asíncrona. Devuelve `{ data, error, isLoading, isError }`.
  ```jsx
  import { useQuery } from '@tanstack/react-query';

  function Posts() {
    const { data, isLoading, error } = useQuery({
      queryKey: ['posts'],
      queryFn: () => fetch('/api/posts').then(res => res.json()),
    });
    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error</div>;
    return data.map(post => <Post key={post.id} post={post} />);
  }
  ```
- **Caché automática**: los datos se cachean por `queryKey`. Las subsiguientes llamadas obtienen datos en caché inmediatamente (stale-while-revalidate). React Query revalida en segundo plano al montar, al recuperar el foco, o por intervalo.
- **`staleTime`**: tiempo durante el cual los datos se consideran "frescos" y no se revalidan.
- **Invalidación**: con `queryClient.invalidateQueries({ queryKey: ['posts'] })` se marcan como obsoletos y se refetchan automáticamente. Es la forma principal de actualizar datos tras una mutación.
- **Mutaciones**: `useMutation` para POST, PUT, DELETE. Permite callbacks `onSuccess` para invalidar queries y actualizaciones optimistas.

  ```jsx
  const mutation = useMutation({
    mutationFn: (nuevoPost) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(nuevoPost) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  ```

### Características avanzadas
- **Optimistic Updates**: actualizar la UI antes de que el servidor confirme, con rollback automático.
- **Infinite Queries**: para scroll infinito o paginación con cursor.
- **DevTools**: extensión visual para inspeccionar caché y queries.
- **Prefetching, Suspense mode, streaming SSR**.

## SWR
SWR ("stale-while-revalidate") es una librería similar de Vercel, más minimalista. Su hook principal es `useSWR`. Ofrece caching, revalidación en foco, polling, y soporte para Suspense. Su API es un poco más ligera pero igual de potente.

```jsx
import useSWR from 'swr';
const { data, error } = useSWR('/api/posts', fetcher);
```

## Diferencia clave: Estado del servidor vs. Estado del cliente
React Query y SWR **no deben almacenar estado que no sea de servidor**. Para estado local de UI (modal abierto, tema) o estado global del cliente (carrito de compras), sigue siendo apropiado usar Context, Zustand o Jotai. Sin embargo, gran parte del estado que antes se ponía en Redux (datos de API, listas) ahora vive en React Query, reduciendo drásticamente la necesidad de un store global.

## Por qué esto cambia la arquitectura
Antes: `useEffect` → `fetch` → `setState` en un store global, con lógica manual de loading/error y sincronización compleja.
Ahora: declaras las queries donde se necesitan, la librería maneja caching, deduplicación, revalidación en segundo plano, y el store de datos está fuera del árbol React (evita re-renderizar todo).

## Integración con otros stores
- Puedes usar **Zustand o Redux** para el estado del cliente (autenticación, configuración) y **React Query** para los datos del servidor.
- React Query tiene su propio cache store; no necesitas duplicar esos datos en Redux.

## Cuándo usar cada uno
| Librería       | Tipo de estado           | Propósito principal                                |
|----------------|--------------------------|----------------------------------------------------|
| Context + useReducer | Cliente global       | Aplicaciones pequeñas, estado simple               |
| Redux Toolkit  | Cliente global + servidor| Aplicaciones grandes, trazabilidad, RTK Query      |
| Zustand        | Cliente global           | Simplicidad, performance, sin boilerplate          |
| Jotai / Recoil | Cliente global / local   | Granularidad atómica, estados interconectados      |
| React Query / SWR | Servidor             | Datos asíncronos, caching, sincronización          |

## Conclusión
La tendencia moderna es **separar estado de servidor (React Query/SWR) del estado de cliente (Zustand/Jotai/Context)**. Esto simplifica la arquitectura, mejora el rendimiento y reduce el código boilerplate. La elección dentro de cada categoría depende de la escala y la familiaridad del equipo, pero todas las opciones presentadas son robustas y listas para producción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Jotai y Recoil (Estado atómico)](04-jotai-y-recoil-estado-atomico.md) | [🏠 Inicio](../index.md) | [CSS Modules ▶](../15-estilos/01-css-modules.md) |
