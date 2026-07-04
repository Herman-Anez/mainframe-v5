# Usos avanzados de refs

## 1. Almacenar valores mutables no reactivos
`useRef` es ideal para guardar cualquier valor que necesite persistir entre renderizados sin provocar re-renderizaciones: IDs de temporizadores, instancias de librerías, estado anterior, o cualquier variable mutable.

```jsx
function Cronometro() {
  const intervalRef = useRef(null);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
}
```

## 2. Guardar el valor previo de un estado o prop
Combinando `useRef` y `useEffect`, puedes capturar el valor anterior para compararlo.

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current; // devuelve el valor anterior
}
```
Útil para lógica condicional basada en cambios de prop.

## 3. Callbacks estables que leen el estado actual (stale closure escape)
Cuando necesitas una función estable (que no cambie su referencia) pero que siempre acceda al último valor de un estado, puedes usar una ref que apunte al valor actual y un callback que la lea.

```jsx
function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

function useStableCallback(callback) {
  const callbackRef = useLatest(callback);
  return useCallback((...args) => callbackRef.current(...args), []);
}
```
Esto evita recrear funciones y rompe la dependencia de `useCallback` con el valor, útil en suscripciones. Sin embargo, debes usarse con moderación porque "engaña" a React sobre las dependencias reales.

## 4. Medir el DOM (tamaño, posición)
Con `useLayoutEffect` y un ref, puedes medir nodos del DOM de manera sincrónica para posicionar elementos sin parpadeo.

```jsx
function Tooltip({ children, targetRef }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    // ... calcular posición
    setPos({ top: targetRect.bottom, left: targetRect.left });
  }, [targetRef]);

  return <div ref={tooltipRef} style={{ position: 'fixed', top: pos.top, left: pos.left }}>{children}</div>;
}
```

## 5. Integración con librerías de terceros (jQuery, D3, etc.)
Cuando una librería necesita el control de un nodo DOM, le pasas la referencia.

```jsx
const chartRef = useRef(null);
useEffect(() => {
  if (chartRef.current) {
    const instance = new SomeLibrary(chartRef.current);
    instance.render();
    return () => instance.destroy();
  }
}, []);
return <div ref={chartRef} />;
```

## 6. Animaciones y transiciones con React Spring o GSAP
Las referencias permiten que las librerías de animación manipulen el DOM directamente sin interferir con el Virtual DOM.

## 7. Pasar una ref a varios destinos (ref callback)
A veces necesitas que una misma ref se aplique a múltiples elementos o que además de asignar `ref.current`, ejecutes lógica adicional. Los **refs callback** son funciones que se ejecutan con el nodo o componente como argumento. Aunque menos comunes, son flexibles.

```jsx
<div ref={(node) => {
  myRef.current = node;
  // acciones adicionales
}} />
```
Puedes tener un ref callback que actualice una medición de layout. Con hooks, se recomienda usar `useCallback` para la función callback si se pasa a un hijo y quieres estabilidad.

## 8. `useRef` y el problema de re-renderizados con listas
Cuando manejas una lista de referencias a nodos (ej. para gestionar foco o scroll), puedes usar un mapa de refs (un objeto con keys como ids) o un array de refs, pero no debes llamar a `useRef` dentro de un bucle. En su lugar, usa una sola ref que contenga un Map o un array, y mediante callbacks actualizas los nodos.

```jsx
const itemsRef = useRef(new Map());
function getItemRef(id) {
  return (node) => {
    if (node) itemsRef.current.set(id, node);
    else itemsRef.current.delete(id);
  };
}
```

## 9. Combinación con `forwardRef` y memo
Cuando un componente envuelto en `React.memo` recibe una ref que cambia en cada render (por ejemplo, una ref callback no estabilizada), puede romper la memoización porque la ref se considera una prop. Asegura que las refs pasadas sean estables, o usa `useRef` en el padre para mantener la misma referencia.

## 10. Refs en Concurrent Mode (React 18+)
En el renderizado concurrente, React puede "descartar" un render si el estado cambia antes del commit. Las refs asignadas durante el commit son estables, pero no debes confiar en cuántas veces se ejecuta un efecto de asignación. El comportamiento general es el mismo: la ref apuntará al nodo final una vez commitado.

## 11. `useInsertionEffect` (para CSS-in-JS)
Introducido para librerías de estilos, este hook se ejecuta antes de las mutaciones DOM pero después de que el Virtual DOM se ha construido. Puede usar refs para insertar reglas de estilo antes de que el layout se calcule.

---

Los refs completan el trío de herramientas para gestionar identidad mutable, acceso al DOM y comunicación imperativa controlada. Aunque React promueve el paradigma declarativo, estos escapes controlados son esenciales para cubrir todos los escenarios del mundo real.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `forwardRef`](02-forwardref.md) | [🏠 Inicio](../index.md) | [Portales ▶](../10-portales-y-fragments/01-portales.md) |
