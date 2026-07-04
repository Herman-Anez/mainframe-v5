# `useEffect` y suscripciones

`useEffect` es la puerta de entrada para interactuar con el mundo exterior. Vamos a dominarlo.

## Sincronización reactiva, no ciclo de vida
Cada vez que un componente se renderiza, React compara las dependencias. Si alguna cambió desde el último render, se ejecuta la limpieza del efecto anterior (si existe) y luego el nuevo efecto. Al desmontar, se ejecutan todas las limpiezas.

El modelo mental es: **el efecto describe cómo sincronizar un sistema externo con el estado actual de las dependencias**.

## Suscripciones y limpieza
Cualquier suscripción (event listeners, WebSockets, streams) debe limpiarse para evitar fugas de memoria:

```jsx
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => subscription.unsubscribe();
}, [props.source]);
```

**Event listeners globales:**
```jsx
useEffect(() => {
  function handleResize() { /* ... */ }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []); // solo montaje/desmontaje
```

**Cancelación de peticiones fetch:**
```jsx
useEffect(() => {
  const controller = new AbortController();
  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      // ...
    } catch (err) {
      if (err.name !== 'AbortError') throw err;
    }
  }
  fetchData();
  return () => controller.abort();
}, [url]);
```

## El arreglo de dependencias
- **`undefined` (sin segundo argumento)**: el efecto se ejecuta después de cada render. Peligroso; puede causar bucles infinitos.
- **`[]`**: solo montaje/desmontaje.
- **`[deps]`**: se ejecuta si alguna dependencia cambia.

La regla de oro: incluye **todas** las variables reactivas (props, estado, funciones definidas en el componente) que uses dentro. La regla `exhaustive-deps` de ESLint es indispensable.

**No mientas sobre las dependencias** para "arreglar" un bucle infinito; encuentra la verdadera causa.

## Efectos que solo ocurren una vez
Si realmente necesitas ejecutar código una sola vez (conectar un socket, analytics), y las variables que usas no deben provocar re-ejecuciones, tienes opciones:
- Poner `[]` y leer valores actuales desde una `ref` (si no necesitas reactividad).
- Usar `useRef` para almacenar la versión más reciente de un callback sin desencadenar efectos.

## Limpieza en modo estricto
React 18 en desarrollo monta, desmonta y vuelve a montar el componente para verificar que el efecto se limpia correctamente. Si tu efecto no es idempotente (ej. envías dos peticiones en lugar de una), verás comportamientos extraños. Asegúrate de que la limpieza revierta todo lo que el efecto configuró.

## `useEffect` vs `useLayoutEffect`
`useEffect` es asíncrono respecto al pintado. Si necesitas medir el DOM o hacer cambios visuales inmediatos, usa `useLayoutEffect`. En caso de duda, empieza con `useEffect` y cambia si ves parpadeo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useState` en profundidad](01-usestate-en-profundidad.md) | [🏠 Inicio](../index.md) | [`useContext` ▶](03-usecontext.md) |
