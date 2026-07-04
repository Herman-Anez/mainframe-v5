# `useMemo` y `useCallback`

Ambos hooks sirven para **memoizar** (almacenar en caché) resultados entre renders, evitando cálculos repetidos o recreación de funciones que causan renders innecesarios en hijos optimizados.

## `useMemo`
```jsx
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);
```
React ejecuta la función solo cuando alguna dependencia cambia; en caso contrario, devuelve el valor memorizado de la ejecución anterior.

**Cuándo usarlo:**
- Cálculos pesados (filtrados, ordenamientos, derivaciones complejas) dentro del componente.
- Estabilizar la referencia de objetos o arrays que se pasan como props a hijos envueltos en `React.memo`, para evitar que se re-rendericen por un nuevo objeto con igual contenido.

**Cuándo NO usarlo:**
- Cálculos baratos. `useMemo` añade overhead (llamada a función, comparación de dependencias). Primero escribe el código sin él, luego perfila.
- No lo uses como garantía de rendimiento sin medir.

## `useCallback`
```jsx
const memoizedCallback = useCallback((arg) => doSomething(arg), [deps]);
```
Devuelve la misma instancia de función mientras las dependencias no cambien. Es un atajo para `useMemo(() => fn, deps)`.

**Cuándo usarlo:**
- Pasas la función como prop a un componente hijo que está envuelto en `React.memo`. Si la función se recrea en cada render, `memo` no evitará el render del hijo.
- La función es dependencia de un `useEffect`. Si la recreas, el efecto se re-ejecutará innecesariamente. Con `useCallback`, mantienes la estabilidad.

**El mito del rendimiento:**
`useCallback` no evita que se cree la función (siempre se crea una en cada render, al menos la definición inline, pero `useCallback` descarta la nueva si las deps no cambian). Su verdadero valor es evitar renders en hijos o efectos. Usarlo indiscriminadamente añade complejidad y uso de memoria sin beneficio.

## Combinación con `React.memo`
```jsx
const List = React.memo(({ items, onItemClick }) => { ... });

function Parent() {
  const [query, setQuery] = useState('');
  const items = useMemo(() => filterItems(query), [query]);
  const handleClick = useCallback((id) => { /* ... */ }, []);

  return <List items={items} onItemClick={handleClick} />;
}
```
Aquí `List` solo se re-renderiza si `items` o `handleClick` cambian.

## Dependencias y funciones dentro de funciones
Si tu callback usa props o estado, debes incluirlos en las dependencias. Si necesitas acceder al valor más reciente sin cambiar la referencia, considera el patrón de `ref`:

```jsx
const latestValue = useRef(value);
latestValue.current = value;

const stableCallback = useCallback(() => {
  // siempre lee latestValue.current
}, []);
```

Este patrón es útil pero debe usarse con cuidado: estás evadiendo la reactividad normal y el componente no se re-renderizará cuando cambie `value`, lo cual puede ser lo deseado o no.

## Memorización en contexto de listas
Cuando renderizas una lista de elementos que cada uno recibe callbacks, es crucial que el callback sea estable (con `useCallback`) para que los items con `React.memo` no se re-rendericen al cambiar el padre.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useReducer`](05-usereducer.md) | [🏠 Inicio](../index.md) | [`useLayoutEffect` ▶](07-uselayouteffect.md) |
