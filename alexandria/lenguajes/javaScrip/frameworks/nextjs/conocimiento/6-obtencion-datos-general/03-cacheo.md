# Sistema de caché en Next.js

Next.js posee una arquitectura de caché multinivel que trabaja en conjunto para optimizar la entrega de contenido. Comprenderla es clave para controlar el rendimiento y la frescura de los datos.

## Niveles de caché

1. **Request Memoization (Memoización de peticiones)**  
   Durante un mismo renderizado del servidor, las peticiones `fetch` idénticas se deduplican. No persiste entre peticiones; solo evita trabajo repetido en el mismo ciclo de render.

2. **Data Cache (Caché de datos)**  
   Almacena las respuestas de `fetch` (y resultados de `unstable_cache`) de forma persistente en el servidor. Es compartida entre usuarios y peticiones. Se invalida mediante revalidación temporal o bajo demanda.

3. **Full Route Cache (Caché de rutas completas)**  
   Almacena el HTML y el payload RSC de las páginas estáticas (generadas en build o bajo demanda). Se sirve directamente desde la caché. En producción, las páginas estáticas se guardan aquí.

4. **Router Cache (Caché del router en el cliente)**  
   Guarda en memoria los payloads de las páginas visitadas recientemente para una navegación instantánea. Dura la sesión o un tiempo corto. Se puede invalidar con `router.refresh()`.

## Cómo controlar la Data Cache y la Full Route Cache

- **Fetch con `cache: 'force-cache'`** (predeterminado): el resultado se almacena en la Data Cache. La página se considera estática (Full Route Cache).
- **Fetch con `cache: 'no-store'`**: no se usa Data Cache; la página se vuelve dinámica (SSR), sin Full Route Cache.
- **`next: { revalidate: N }`**: establece un tiempo de vida en la Data Cache. Tras expirar, la siguiente petición regenerará en segundo plano (ISR).
- **`export const revalidate = N`** en layout/página: equivalente a nivel de segmento.
- **`export const dynamic = 'force-static'`** o **`'force-dynamic'`**: fuerza el comportamiento de la ruta.

## Revalidación bajo demanda

Permite purgar la Data Cache (y en consecuencia la Full Route Cache) de forma selectiva.

- **`revalidateTag(tag)`**: invalida todas las entradas de fetch asociadas a un tag.
- **`revalidatePath(path)`**: invalida la caché de una ruta específica.

Estas funciones se usan dentro de Server Actions o Route Handlers.

## Caché de Router (cliente)

- Almacena los segmentos visitados para evitar peticiones al servidor durante la navegación SPA.
- Se refresca automáticamente tras un tiempo (30 segundos en producción) o cuando se produce una revalidación.
- Se puede forzar el refresco con `router.refresh()`.

## Flujo de una petición cacheada

1. El usuario solicita `/blog/post-1`.
2. Next.js verifica si existe Full Route Cache. Si está presente y no ha expirado, la sirve directamente.
3. Si no existe o expiró, se ejecuta el renderizado del servidor. Durante el render, los `fetch` consultan primero la Data Cache.
4. Si la Data Cache tiene el dato fresco, se usa; si no, se hace la petición externa y se guarda.
5. El HTML generado se guarda en la Full Route Cache.
6. El cliente recibe el HTML y lo hidrata.

## Buenas prácticas de cacheo

- Diseña una estrategia de tags coherente (por ejemplo, `posts`, `comments`) para invalidar grupos de datos.
- Prefiere `revalidate` para la mayoría de contenidos; usa `no-store` solo cuando sea imprescindible.
- Para APIs que no usan `fetch` (bases de datos directas), envuélvelas con `unstable_cache` para beneficiarte de la Data Cache.
- Monitoriza el equilibrio entre frescura y rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Obtención de datos en el App Router](02-app-router-fetch.md) | [🏠 Inicio](../index.md) | [Mutaciones de datos en Next.js ▶](04-mutaciones.md) |
