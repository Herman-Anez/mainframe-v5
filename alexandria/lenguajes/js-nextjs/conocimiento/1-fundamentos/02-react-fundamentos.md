# React fundamentos

## Por qué React es la base

Next.js extiende React, por lo que es imprescindible dominar los conceptos fundamentales de React antes o en paralelo. Aquí se repasan los pilares que Next.js utiliza y potencia.

## Componentes y JSX

- Los componentes son funciones o clases que retornan JSX.
- JSX es una extensión de sintaxis que se compila a llamadas de `React.createElement`.
- Next.js admite componentes de servidor (sin estado ni efectos) y componentes de cliente (con hooks).

## Props y estado

- **Props**: datos de solo lectura pasados de padre a hijo.
- **Estado (`useState`)**: datos locales que cambian con el tiempo y provocan re‑renderizados.
- El estado en Next.js puede residir en Client Components, pero la fuente de verdad suele venir del servidor (datos cacheados, sesiones, etc.).

## Ciclo de vida y efectos

- `useEffect`: para sincronización con APIs externas, suscripciones, timers. Se ejecuta después del renderizado.
- `useLayoutEffect`: igual pero se dispara antes de pintar. Útil para mediciones de layout.
- En Next.js, los efectos solo están disponibles en Client Components.

## Context API

- `createContext` + `useContext` para compartir datos sin pasar props manualmente.
- En Next.js App Router, los proveedores de contexto deben estar en un Client Component, que se puede colocar en el layout root a través de un wrapper.

## Hooks esenciales

- `useReducer`: para estado complejo con transiciones predecibles.
- `useRef`: referencia mutable que persiste entre renderizados; acceso al DOM.
- `useMemo` / `useCallback`: optimizaciones de rendimiento para evitar cálculos o funciones innecesarias.
- `useId`: genera IDs únicos para accesibilidad.
- Hooks personalizados: lógica reutilizable.

## Renderizado condicional y listas

- Operador ternario, `&&`, `if/else` para mostrar/ocultar componentes.
- `key` única al renderizar listas con `.map()`. Importante para la reconciliación.

## Composición vs Herencia

- React promueve la composición: pasar componentes como `children` o props.
- En Next.js, los layouts son un ejemplo de composición: cada layout recibe `children` y los envuelve.

## Virtual DOM y reconciliación

- React mantiene un árbol virtual en memoria, lo compara con el anterior y aplica solo los cambios necesarios al DOM real.
- Esto hace que las actualizaciones sean eficientes.

## Flujo de datos unidireccional

- Los datos fluyen de padres a hijos mediante props.
- Las actualizaciones de estado se propagan hacia abajo, facilitando el razonamiento sobre la interfaz.

## React Server Components (RSC)

- **Concepto clave para Next.js App Router**.
- Los componentes se ejecutan **solo en el servidor**. No tienen estado, efectos ni manejadores de eventos.
- Pueden ser asíncronos, acceder directamente a bases de datos o sistemas de archivos.
- Reducen el tamaño del bundle de cliente y eliminan la necesidad de API routes para obtener datos en muchos casos.
- Se mezclan con Client Components: los RSC pueden importar Client Components, pero no al revés. La comunicación es mediante props serializables.

## Suspense y manejo de asincronía

- `<Suspense>` permite mostrar un fallback (spinner, esqueleto) mientras un componente hijo se resuelve.
- Next.js App Router integra Suspense automáticamente mediante `loading.js` y soporte nativo para streaming.
- Los Server Components asíncronos utilizan Suspense bajo el capó.

## Límites de uso en Next.js

- Los Client Components deben llevar `'use client'` en la primera línea.
- No se pueden importar Server Components directamente dentro de Client Components, pero se pueden pasar como `children` o mediante props.
- Las funciones del lado del servidor (`cookies()`, `headers()`) solo funcionan en Server Components o Route Handlers.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Que es nextjs](01-que-es-nextjs.md) | [🏠 Inicio](../index.md) | [Estructura proyecto ▶](03-estructura-proyecto.md) |
