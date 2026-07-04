# `useEffect` y `useLayoutEffect` en profundidad

## `useEffect(effect, deps?)`

**Parámetros:**
- `effect`: función que puede contener código imperativo (efectos secundarios). Puede retornar opcionalmente una función de *cleanup*.
- `deps`: array opcional de dependencias. React usará `Object.is` para comparar cada elemento entre el render actual y el anterior. Si todas son iguales, se salta el efecto.

**Timing:**
- Se ejecuta **después de que el navegador haya pintado** la pantalla. Esto evita bloquear la actualización visual. La mayoría de los efectos (data fetching, suscripciones, logs) deben ir aquí.
- Si el efecto modifica el DOM de forma que cause un re-render inmediato (como leer medidas y luego setear estado), el usuario puede ver un parpadeo. Para esos casos, existe `useLayoutEffect`.

**Orden de ejecución:**
- React ejecuta las limpiezas de los efectos del render anterior (si las dependencias cambiaron) en el orden en que se declararon.
- Luego, ejecuta los nuevos efectos en orden.
- En caso de desmontaje, ejecuta todas las limpiezas.

**Efectos asíncronos:**
- La función pasada a `useEffect` no puede ser asíncrona directamente (no debe devolver una promesa). Pero dentro de ella puedes definir funciones `async` y llamarlas.
  ```jsx
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(url);
      // ...
    }
    fetchData();
  }, [url]);
  ```

**Cuidado con las dependencias:**
- Debes incluir todas las variables reactivas (props, estado, funciones derivadas de estado/props) que uses dentro del efecto. React recomienda instalar la regla de ESLint `react-hooks/exhaustive-deps`.
- Si necesitas que una función no provoque re-ejecuciones innecesarias, envuélvela en `useCallback`.
- Si necesitas un valor mutable que no quieres como dependencia, puedes usar `useRef`.

## `useLayoutEffect(effect, deps?)`

**Timing:**
- Se ejecuta **sincrónicamente después de todas las mutaciones del DOM, pero antes de que el navegador pinte**. Bloquea el pintado, por lo que si el efecto es lento, la UI se congelará.
- Ideal para leer layout del DOM (tamaño, posición, scroll) y aplicar cambios visuales de forma sincrónica sin que el usuario vea el estado intermedio.

**Ejemplo clásico: tooltip posicionado**
```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  setTooltipPosition({ x: rect.right, y: rect.top });
}, [content]); // evita el parpadeo
```
Si usaras `useEffect`, el tooltip aparecería primero en una posición incorrecta y luego se reposicionaría, causando un destello.

**Equivalencia en clases:**
- Similar a `componentDidMount` y `componentDidUpdate` porque estos también se ejecutan antes del pintado en el navegador. `useEffect` se parece más a un callback asíncrono después del pintado (aunque en realidad es en un microtask, etc.).

**Regla general:** Si tu efecto no lee ni modifica el DOM de manera visual inmediata, usa `useEffect`. Solo cámbiate a `useLayoutEffect` si observas un parpadeo o necesitas medidas sincrónicas del DOM.

## Cleanup (limpieza)
La función de limpieza se ejecuta:
- Antes de re-ejecutar el efecto (cuando cambian las dependencias).
- Al desmontar el componente.

Es crucial para evitar memory leaks: cancelar suscripciones, limpiar timers, abortar peticiones fetch (usando `AbortController`), remover event listeners, etc.

## Ejemplo de petición con cancelación
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort();
}, [url]);
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Ciclo de vida con hooks](03-ciclo-de-vida-con-hooks.md) | [🏠 Inicio](../index.md) | [Reglas de los hooks ▶](05-reglas-de-los-hooks.md) |
