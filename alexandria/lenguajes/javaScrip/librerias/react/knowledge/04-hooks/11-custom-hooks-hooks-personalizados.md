# Custom Hooks (Hooks personalizados)

Los hooks personalizados son la mejor forma de extraer y reutilizar **lógica de estado y efectos** entre componentes. No son más que funciones JavaScript que empiezan con `use` y que internamente pueden usar otros hooks.

## Filosofía
En lugar de heredar comportamiento, **compones funciones que encapsulan preocupaciones**. Un hook personalizado puede:
- Utilizar `useState`, `useEffect`, `useContext`, etc.
- Devolver cualquier valor: estados, funciones, refs, objetos.
- Aceptar parámetros para personalizar su comportamiento.

## Ejemplos canónicos

**1. `useWindowSize`**
```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}
```

**2. `useLocalStorage`**
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```

**3. `useFetch`**
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
}
```

## Reglas y buenas prácticas
- **Nombre con `use`**: es obligatorio para que el linter aplique las reglas de hooks y para que otros desarrolladores sepan que esa función sigue el contrato de hooks.
- **No ejecutan lógica condicionalmente**: el hook en sí puede tener condicionales, pero todas las llamadas a hooks internos deben ser incondicionales.
- **Son composables**: un hook puede llamar a otros hooks personalizados.
- **Devuelven una interfaz limpia**: no expongas implementaciones internas. Devuelve solo lo necesario.
- **Documenta las dependencias y el comportamiento reactivo**.
- **Pruebas**: usa `renderHook` de React Testing Library para probarlos de forma aislada.

## Extracción de lógica común
Si ves que dos componentes comparten el mismo patrón de `useState` + `useEffect`, es un candidato perfecto para un custom hook. Por ejemplo, dos formularios que validan un campo de forma similar pueden compartir un `useFieldValidation`.

## Patrón de "hook factory"
A veces creas hooks que devuelven otros hooks (funciones de orden superior) o que reciben un hook como parámetro. Esto es avanzado y se usa en librerías, pero demuestra la flexibilidad de la composición.

## Testing con `renderHook`
```jsx
import { renderHook, act } from '@testing-library/react';

const { result } = renderHook(() => useCounter(0));
act(() => result.current.increment());
expect(result.current.count).toBe(1);
```

## Precauciones
- No rompas las reglas de hooks al abstraer.
- La dependencia excesiva de custom hooks puede generar código difícil de rastrear si no están bien nombrados.
- Recuerda que cada custom hook crea su propio espacio de estado. Compartir estado entre instancias requiere contexto o estado global.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useDebugValue`](10-usedebugvalue.md) | [🏠 Inicio](../index.md) | [Hooks experimentales: `use` ▶](12-hooks-experimentales-use.md) |
