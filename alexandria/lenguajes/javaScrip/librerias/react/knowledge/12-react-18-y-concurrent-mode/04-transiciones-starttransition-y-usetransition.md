# Transiciones: `startTransition` y `useTransition`

Las transiciones son un nuevo concepto que permite **marcar actualizaciones de estado como no urgentes**. Mientras que una actualización urgente (como teclear en un input) debe reflejarse inmediatamente, otras (como filtrar una lista enorme al escribir) pueden demorarse ligeramente para no bloquear la interacción.

## `startTransition`
```jsx
import { startTransition } from 'react';

function handleChange(e) {
  setInputValue(e.target.value); // actualización urgente
  startTransition(() => {
    setFilteredResults(buscar(e.target.value)); // actualización no urgente
  });
}
```
- `setInputValue` se ejecuta inmediatamente, reflejando la pulsación en el input sin demora.
- `setFilteredResults` se marca como transición; React puede retrasar su renderizado si hay interacciones más urgentes, evitando que la UI se congele mientras se procesa el filtro.

## `useTransition`
Devuelve un array con un indicador de `isPending` y la función `startTransition`. `isPending` es `true` mientras la transición está en curso, lo que permite mostrar un indicador sutil de carga sin caer en un fallback agresivo.

```jsx
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInputValue(e.target.value);
  startTransition(() => {
    setFilteredResults(buscar(e.target.value));
  });
}

return (
  <>
    <input value={inputValue} onChange={handleChange} />
    {isPending && <Spinner />}
    <Lista items={filteredResults} />
  </>
);
```

## Beneficios
- **Interactividad inmediata**: el input no se bloquea mientras se procesan datos pesados.
- **Evitar saltos visuales**: si la actualización es rápida, el usuario no ve ningún indicador de carga; si es lenta, se muestra el spinner.
- **Integración con Suspense**: una transición puede envolver un cambio de ruta que implique carga de código o datos, manteniendo la pantalla anterior visible hasta que la nueva esté lista (concurrent suspense transitions).

## Cuándo usarlas
- Filtros y búsquedas que afectan grandes conjuntos de datos.
- Navegación entre pestañas o secciones que requieren carga de datos.
- Cualquier actualización que no necesite ser instantánea para sentir la UI responsiva.

## `useDeferredValue`
Alternativa a `startTransition` cuando no controlas la actualización del estado (por ejemplo, si el valor viene de una prop). `useDeferredValue` devuelve una versión "diferida" del valor, que se actualiza con menor prioridad.

```jsx
const deferredQuery = useDeferredValue(query);
const filtered = useMemo(() => buscar(deferredQuery), [deferredQuery]);
```
Esto permite que el input se mantenga reactivo mientras la lista se actualiza en segundo plano.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Suspense para datos](03-suspense-para-datos.md) | [🏠 Inicio](../index.md) | [React Server Components (RSC) ▶](05-react-server-components-rsc.md) |
