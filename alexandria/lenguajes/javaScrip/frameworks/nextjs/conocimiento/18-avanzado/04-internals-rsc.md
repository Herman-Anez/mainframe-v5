# Internals de React Server Components

## 1. Arquitectura de RSC

Los **React Server Components (RSC)** son la base del App Router. Su arquitectura se fundamenta en la separación entre **componentes del servidor** y **componentes del cliente**. Esta separación es posible gracias a un formato de serialización especial (RSC Payload) y un protocolo de streaming.

## 2. El formato RSC Payload

Cuando un Server Component se renderiza, Next.js no envía su código JavaScript al cliente. En su lugar, genera una representación intermedia llamada **RSC Payload** (también conocido como "flight format"). Este payload:

- Contiene el JSX serializado en una estructura similar a JSON pero más compacta.
- Incluye referencias a Client Components (llamadas "client references") en lugar de su implementación.
- Puede mezclar HTML estático con marcadores para suspenso.

El cliente React recibe este payload y lo utiliza para hidratar el árbol de componentes, resolviendo las referencias a módulos de cliente que ya tiene en su bundle.

## 3. Renderizado en el servidor y envío progresivo

El proceso de renderizado de una página en el App Router es el siguiente:

1. **El servidor ejecuta los Server Components** (layouts, páginas). Estos pueden ser asíncronos; el servidor espera a que se resuelvan sus datos.
2. **Construye un árbol de elementos React** donde los Server Components se transforman en elementos de "server component" y los Client Components en referencias.
3. **Serializa el árbol** al formato RSC Payload.
4. **Envía el HTML inicial** (para SEO y primera pintura) junto con el payload en un script inline (`self.__next_f.push([...])`). Esto permite la hidratación sin necesidad de JS adicional para los Server Components.
5. **Para componentes suspendidos**, el servidor espera a que se resuelvan y luego envía chunks adicionales del payload mediante streaming.

El cliente recibe estos chunks, los procesa con `ReactDOM.hydrateRoot` (o `createRoot` en navegaciones del lado del cliente) y reconstruye la interfaz.

## 4. Referencias de cliente

Cuando un Server Component importa un Client Component, se genera una **referencia de cliente**. Esta referencia incluye:

- El ID del módulo (ruta del archivo).
- El nombre de la exportación.
- Un identificador único.

En el cliente, el bundler ha generado un mapeo entre referencias y los componentes reales. Durante la hidratación, React usa ese mapeo para instanciar el componente correcto.

Por eso, un Client Component **no puede importar un Server Component** directamente: el Server Component no existe en el bundle del cliente. En su lugar, puede recibir un Server Component como `children` desde un padre Server Component, porque el padre ya renderizó y serializó ese contenido como parte del árbol.

## 5. Límites de `'use client'`

La directiva `'use client'` no solo marca un archivo, sino que **convierte todo el módulo y sus importaciones en código de cliente**. Es un límite "hacia abajo": una vez que entras en un Client Component, todos los componentes que importes serán Client Components también (o causarán un error si son Server Components sin la directiva).

Esto fuerza una arquitectura donde los componentes interactivos se ubican en las hojas del árbol, y los Server Components forman la estructura principal.

## 6. Serialización de props

Las props que se pasan de un Server Component a un Client Component deben ser **serializables** (tipos primitivos, objetos planos, arrays, React elements que sean Server Components, etc.). Las funciones no se pueden pasar porque no hay forma de serializarlas para el cliente. Esta es una restricción deliberada: obliga a que la lógica permanezca en el servidor o se convierta en un Client Component.

## 7. Streaming y RSC

El streaming de RSC funciona a nivel de Suspense boundaries. El servidor no espera a que todo el árbol esté resuelto; envía el payload del árbol estático primero, y luego, a medida que se completan los componentes suspendidos, envía actualizaciones del payload. El cliente fusiona estas actualizaciones en el DOM sin recargar la página.

El formato de streaming se basa en **chunks de texto delimitados** que el script del lado cliente interpreta para reconstruir el árbol.

## 8. Caché del cliente y navegaciones

En navegaciones SPA (con `next/link`), Next.js no vuelve a solicitar el HTML completo, sino que **pide el RSC Payload** de la nueva ruta a través de una petición `fetch` especial con cabecera `RSC: 1`. El servidor responde con el payload serializado (sin HTML). El cliente reemplaza el árbol de React en el segmento correspondiente, preservando el estado del layout.

Este mecanismo es lo que permite la persistencia de los layouts: el layout no se toca porque su parte del árbol no cambia; solo se actualiza el slot `children`.

## 9. Consideraciones de rendimiento

- El payload RSC es más pequeño que el HTML completo, porque no incluye las partes estáticas del layout que ya están en el cliente.
- La generación de payloads se cachea en la Data Cache del servidor (para páginas estáticas), por lo que las navegaciones son rapidísimas.
- Next.js deduplica peticiones `fetch` durante la renderización para evitar solicitudes redundantes, mejorando aún más el rendimiento.

## 10. Futuro y evolución

La arquitectura RSC está en pleno desarrollo. Futuras versiones de React y Next.js mejorarán el formato de serialización, la eficiencia del streaming y la integración con turbopack. Se espera que RSC se convierta en el estándar de React para renderizado híbrido.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Dynamic IO (Experimental)](03-dynamic-io.md) | [🏠 Inicio](../index.md) | ➖ |
