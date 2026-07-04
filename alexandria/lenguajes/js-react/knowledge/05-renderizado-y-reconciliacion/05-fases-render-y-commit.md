# Fases: Render y Commit

React divide su trabajo en dos fases principales, una de las cuales se subdivide en tareas concurrentes (React 18+). Comprender estas fases es clave para optimizar y depurar.

## 1. Render Phase (Fase de renderizado)
En esta fase, React **construye el nuevo árbol de elementos** (Virtual DOM) y lo compara con el anterior. Es una fase **pura y sin efectos secundarios**; puede ser interrumpida y reanudada (Concurrent Mode). Durante el renderizado:

- React ejecuta las funciones de los componentes (o `render()` en clases).
- Calcula las diferencias (diffing) y determina qué nodos DOM necesitan ser añadidos, modificados o eliminados.
- Los hooks como `useState`, `useReducer`, `useMemo` se ejecutan aquí (la función componente se ejecuta, los hooks retornan valores).
- **No se permiten mutaciones del DOM, peticiones de red, suscripciones**; todo eso se deja para la fase de commit mediante `useEffect`.
- El resultado es una **lista de operaciones** pendientes.

React puede **iniciar el renderizado** y luego pausarlo si llega una tarea de mayor prioridad (por ejemplo, una entrada del usuario), gracias al planificador (Scheduler). Esto es lo que habilita el renderizado concurrente.

## 2. Commit Phase (Fase de confirmación)
Una vez que React tiene la lista de cambios necesaria, los aplica **de forma sincrónica e ininterrumpible** al DOM real. En esta fase:

- React recorre el árbol y ejecuta las mutaciones: inserta, elimina, actualiza nodos.
- Inmediatamente después de las mutaciones, ejecuta **`useLayoutEffect`** (sincrónico, antes del pintado del navegador).
- Luego, el navegador pinta la pantalla.
- Finalmente, React ejecuta **`useEffect`** (asincrónico, programado para después del pintado).

La fase de commit siempre es sincrónica y no puede ser interrumpida, garantizando que la UI sea consistente.

## Implicaciones en hooks
- `useEffect`: se ejecuta después de que el navegador ha pintado, en una cola de microtareas. Ideal para la mayoría de efectos.
- `useLayoutEffect`: se ejecuta sincrónicamente tras las mutaciones DOM, antes del pintado. Usar solo cuando necesitas medidas del DOM que afectan visualmente el resultado.
- `useInsertionEffect` (introducido para CSS-in-JS): se ejecuta antes de cualquier mutación DOM, útil para insertar estilos dinámicos antes de que el layout sea leído.

## ¿Por qué esta separación?
- **Render puro**: permite a React descartar el trabajo si es necesario (por ejemplo, si el estado cambia de nuevo antes de commit). Facilita el Concurrent Rendering.
- **Commit atómico**: garantiza que la interfaz nunca quede en un estado parcialmente actualizado. Si hay un error en el render, React puede hacer rollback y mostrar un error boundary.
- **Efectos diferidos**: `useEffect` no bloquea el navegador, manteniendo la UI responsiva.

## StrictMode y doble invocación
En desarrollo, React ejecuta dos veces el render y los efectos para detectar problemas de pureza. En la fase de commit, los `useLayoutEffect` y `useEffect` se ejecutan (montaje → limpieza → montaje). Más detalles en la siguiente sección.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Renderizado condicional](04-renderizado-condicional.md) | [🏠 Inicio](../index.md) | [StrictMode ▶](06-strictmode.md) |
