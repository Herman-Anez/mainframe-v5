# `useState` en profundidad

Aunque ya presentamos `useState` en el estado local, aquí nos centramos en los detalles que marcan la diferencia en aplicaciones reales.

## El valor inicial "lazy"
Si el cómputo del estado inicial es costoso (leer de `localStorage`, calcular valores complejos), no querrás hacerlo en cada render. `useState` acepta una **función inicializadora** que se invoca solo una vez durante el montaje:

```jsx
// ❌ Costoso en cada render (aunque useState solo lo usa la primera vez, la expresión se evalúa siempre)
const [data, setData] = useState(expensiveComputation());

// ✅ Solo se ejecuta una vez
const [data, setData] = useState(() => expensiveComputation());
```

## El setter y las actualizaciones funcionales
El setter (`setValor`) es **estable**: React garantiza que su identidad no cambia entre renders, por lo que puedes pasarlo como prop sin causar renders extra en hijos.

Al usar la versión funcional (`setValor(prev => nuevoValor)`), React encola la actualización y garantiza que `prev` sea el valor más reciente del estado, incluso si múltiples actualizaciones se encolan en el mismo evento. Esto es fundamental para evitar cierres obsoletos (stale closures):

```jsx
// Escenario: click rápido que incrementa varias veces
function Contador() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // ❌ Si el estado no ha cambiado al momento de leer, puedes perder actualizaciones
    // setCount(count + 1); // siempre usa el count del render actual
    // setCount(count + 1); // ambos usarían el mismo valor obsoleto

    // ✅ Con función actualizadora
    setCount(c => c + 1);
    setCount(c => c + 1); // cada una recibe el último valor, resultando en +2
  }

  return <button onClick={handleClick}>+</button>;
}
```

## El estado es una instantánea (snapshot)
Cada render tiene su propia copia independiente del estado y las props. Las funciones definidas dentro del componente capturan el valor del estado de ese render. Si usas temporizadores o suscripciones, asegúrate de usar la versión funcional del setter o referencias (`useRef`) para leer el valor más reciente.

```jsx
function Cronómetro() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      // ❌ setTime(time + 1) usaría el time del render en que se creó el intervalo (0)
      setTime(t => t + 1); // ✅ siempre el último
    }, 1000);
    return () => clearInterval(id);
  }, []); // arreglo vacío, solo montaje
}
```

## Agrupación (batching) automática en React 18+
React 18 agrupa múltiples actualizaciones de estado en un solo re-render, incluso dentro de promesas, `setTimeout` o eventos nativos. Antes de React 18, solo se agrupaban dentro de los manejadores de eventos sintéticos. Esto mejora el rendimiento sin intervención. Si necesitas forzar un render sincrónico (casos muy raros), puedes usar `flushSync` de `react-dom`, pero no es recomendable.

## Inmutabilidad y referencias
`useState` no fusiona objetos automáticamente como `setState` en clases. Si usas objetos, debes copiarlos explícitamente:

```jsx
const [user, setUser] = useState({ name: '', age: 0 });
// ❌ Mutación parcial (no funciona)
setUser({ name: 'Ana' }); // age se pierde
// ✅ Copia completa
setUser(prev => ({ ...prev, name: 'Ana' }));
```

Para estados complejos, `useReducer` suele ser más escalable.

## Cómo evita renderizados innecesarios
React aplica `Object.is` entre el valor anterior y el nuevo. Si son idénticos, se omite el render. Por tanto, si un setter recibe el mismo valor (misma referencia en objetos), no habrá render. Pero ojo: si creas un nuevo objeto con los mismos datos, sí habrá render porque la referencia cambió. Aquí es donde `useMemo` puede ayudar.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Reglas de los hooks](../03-estado-y-ciclo-de-vida/05-reglas-de-los-hooks.md) | [🏠 Inicio](../index.md) | [`useEffect` y suscripciones ▶](02-useeffect-y-suscripciones.md) |
