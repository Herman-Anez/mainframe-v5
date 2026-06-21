# `useMemo` y `useCallback`: optimizaciones

Estos dos hooks son las herramientas para estabilizar valores y referencias, evitando cálculos repetidos y renders no deseados en componentes hijos memoizados.

## `useMemo`
Memoiza el **resultado** de una función costosa. Solo recalcula cuando cambia alguna dependencia.

```jsx
const listaFiltrada = useMemo(() => {
  return items.filter(item => item.categoria === categoria);
}, [items, categoria]);
```

Sin `useMemo`, la función de filtrado se ejecutaría en cada render, aunque `items` o `categoria` no hubieran cambiado. Con él, se omite si las dependencias son las mismas.

**Consideraciones clave:**
- No usar para todos los cálculos: si el cálculo es barato, el overhead de `useMemo` (invocación del hook, comparación de dependencias) puede ser peor.
- Útil para derivar datos que se pasan como props a componentes memoizados, ya que estabiliza la referencia: un nuevo array con los mismos elementos generaría un render en un hijo con `React.memo`; `useMemo` evita crear un nuevo array si las dependencias no cambiaron.
- Las dependencias deben incluir toda variable reactiva usada dentro (regla `exhaustive-deps`).

## `useCallback`
Memoiza una **función**, devolviendo la misma instancia mientras sus dependencias no cambien. Es un atajo para `useMemo(() => fn, deps)`.

```jsx
const handleClick = useCallback((id) => {
  setSeleccionado(id);
}, [setSeleccionado]); // setSeleccionado es estable
```

**Propósito principal:** pasar funciones estables a componentes hijos envueltos en `React.memo`, evitando que se re-rendericen porque la función prop es "nueva" en cada render del padre.

```jsx
const ItemMemo = React.memo(Item);

function Lista({ items }) {
  const handleDelete = useCallback((id) => {
    // lógica de eliminación
  }, []); // sin dependencias si usamos updater funcional

  return items.map(item => (
    <ItemMemo key={item.id} item={item} onDelete={handleDelete} />
  ));
}
```

**Cuándo no usar `useCallback`:**
- Si la función se pasa a elementos HTML nativos (`<button onClick={fn}>`), porque esos no están memoizados y no se benefician de la estabilidad.
- Si la función se usa como dependencia de un efecto, pero no se pasa a hijos memoizados: en ese caso, definir la función dentro del efecto puede ser más simple.
- Abusar de él añade complejidad cognitiva; evalúa siempre si el hijo realmente está optimizado con `memo`.

## Trampa: dependencias y cierres obsoletos
Si tu callback depende de estado o props, debes incluirlos en las dependencias. Si no quieres que la función cambie, puedes usar el patrón de ref (`useRef`) para mantener el valor actual sin cambiar la identidad de la función, pero a costa de "saltarse" la reactividad normal. Esto es avanzado y requiere justificación.

```jsx
const latestValue = useRef(valor);
latestValue.current = valor;
const stableFn = useCallback(() => {
  // usar latestValue.current
}, []);
```

## Relación con `React.memo`
`useMemo` y `useCallback` son los compañeros inseparables de `React.memo`: estabilizan las referencias que se pasan como props, permitiendo que la comparación superficial de `memo` detecte que no ha habido cambios.

## Olores de código y buenas prácticas
- No memorices todo de forma indiscriminada. Primero identifica cuellos de botella con el Profiler.
- Si un valor derivado se usa en muchos lugares, quizá deba estar en el estado global o en un hook propio.
- En React 19 y el futuro compilador (React Forget), la memoización podría ser automática. Mientras tanto, úsala con criterio quirúrgico.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `React.memo`](01-reactmemo.md) | [🏠 Inicio](../index.md) | [`React.lazy` y `Suspense` ▶](03-reactlazy-y-suspense.md) |
