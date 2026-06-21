# Reglas de los hooks

Los hooks son funciones de JavaScript, pero imponen dos reglas estrictas para garantizar el correcto funcionamiento del estado y los efectos entre renderizados. Estas reglas se basan en cómo React asocia internamente los hooks con el componente.

## Regla 1: Solo llamar hooks en el nivel superior
**No usar hooks dentro de bucles, condiciones o funciones anidadas.**

Razón: React mantiene una **lista enlazada de hooks** para cada componente. Cada llamada a un hook se registra en orden secuencial. Si un hook se ejecuta condicionalmente, el orden entre renders puede cambiar, y React asociaría el estado/efecto incorrecto a cada hook, resultando en bugs sutiles y errores.

```jsx
// ❌ Incorrecto
if (condicion) {
  const [x, setX] = useState(0); // Hook condicional
}

// ✅ Correcto
const [x, setX] = useState(0);
useEffect(() => {
  if (condicion) { /* ... */ }
}, [condicion]);
```

Esto obliga a que todo componente tenga exactamente el mismo número de hooks en cada renderizado.

## Regla 2: Solo llamar hooks desde funciones de React
**Los hooks solo pueden ser invocados desde:**
- Componentes funcionales de React.
- Hooks personalizados (funciones cuyo nombre comienza con `use`).

No los llames desde funciones JavaScript regulares, manejadores de eventos, ciclos de vida de clases, etc. Esta regla asegura que toda la lógica de estado de un componente esté claramente encapsulada dentro del ecosistema de React.

## ¿Por qué estas reglas?
React usa el orden de llamada para saber a qué estado o efecto corresponde cada hook entre renders. Imagina algo como:
```jsx
const [name, setName] = useState('');       // hook #1
const [age, setAge] = useState(0);          // hook #2
useEffect(/* ... */);                       // hook #3
```
En el siguiente render, React itera sobre la misma lista. Si la llamada al hook #2 se omite por una condición, el hook #3 tomaría su lugar y el estado se corrompería.

## Herramientas para hacer cumplir las reglas
El plugin de ESLint `eslint-plugin-react-hooks` incluye reglas que detectan violaciones. Se recomienda usarlo siempre. Además, React DevTools advierte en modo desarrollo si se violan.

## Hooks personalizados y las reglas
Los hooks personalizados son funciones que contienen hooks internamente. Su nombre debe empezar con `use` para que el linter aplique las mismas reglas y sea evidente que esa función sigue el contrato de los hooks.

Ejemplo:
```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    function handleOnline() { setOnline(true); }
    function handleOffline() { setOnline(false); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return online;
}
```
Este hook encapsula lógica de estado y efecto, y se puede usar en cualquier componente, respetando las reglas automáticamente.

## Excepciones y matices
- No hay problema en llamar hooks condicionalmente **dentro de un hook personalizado siempre que el hook personalizado en sí se llame incondicionalmente desde el componente**. La clave es que el número de hooks usados por el componente sea constante.
- Los hooks experimentales como `useDeferredValue` o `use` (en canary) también siguen estas reglas.

## Mentalidad de diseño
Las reglas de hooks, aunque restrictivas, incentivan un código más limpio y predecible. Obligan a que la lógica de estado esté claramente definida y no escondida en bifurcaciones confusas. A cambio, el modelo mental de sincronización y el estado son mucho más robustos que los de clases.

---

Este bloque te proporciona el control total sobre el tiempo de vida de los componentes: desde la gestión del estado local con `useState`, la comprensión del legado de clases, la migración mental al modelo de sincronización con hooks, el detalle fino de `useEffect`/`useLayoutEffect` y las reglas de oro que mantienen la cordura de toda aplicación React.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useEffect` y `useLayoutEffect` en profundidad](04-useeffect-y-uselayouteffect-en-profundidad.md) | [🏠 Inicio](../index.md) | [`useState` en profundidad ▶](../04-hooks/01-usestate-en-profundidad.md) |
