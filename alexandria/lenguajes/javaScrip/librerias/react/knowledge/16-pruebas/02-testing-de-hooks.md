# Testing de Hooks

Probar hooks de forma aislada es crucial cuando contienen lógica compleja que se usa en varios componentes. React Testing Library proporciona `renderHook` para este fin.

## `renderHook`
Acepta un hook (o función que lo llama) y devuelve un objeto `result` que contiene `current`, actualizado tras cada render. Permite ejecutar acciones con `act()` o funciones expuestas por el hook.

```jsx
import { renderHook, act } from '@testing-library/react';

const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
};

test('debe incrementar el contador', () => {
  const { result } = renderHook(() => useCounter());
  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(1);
});
```

## Proporcionar contexto o wrappers
`renderHook` acepta una opción `wrapper` para envolver el hook en Providers necesarios.

```jsx
const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
const { result } = renderHook(() => useTheme(), { wrapper });
```

## Probando hooks asíncronos
Los hooks que usan `useEffect` con operaciones asíncronas necesitan `waitFor` y `act` para actualizar el estado.

```jsx
test('useFetch devuelve datos', async () => {
  const { result } = renderHook(() => useFetch('/api/data'));
  // Inicialmente cargando
  expect(result.current.loading).toBe(true);
  // Esperar a que se resuelva
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toEqual({ ... });
});
```

**Mocking de fetch**: con MSW o `jest.spyOn(global, 'fetch')` para controlar las respuestas.

## Buenas prácticas
- Prueba el contrato público del hook (valores retornados y funciones), no su implementación interna.
- No llames directamente a `setState` desde la prueba; usa las funciones expuestas por el hook.
- Si el hook depende de `useEffect` con suscripciones, asegura limpiar con `unmount()` (devuelto por `renderHook`).
- Usa `act` alrededor de acciones que disparen actualizaciones de estado; `userEvent` ya envuelve sus acciones en `act`, pero en `renderHook` debes hacerlo manual.

## Alternativa: pruebas de integración
A veces, probar el hook directamente a través de un componente ficticio puede ser más sencillo y más cercano al uso real. Elige la opción que dé más confianza sin sobrecargar el test.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Jest y React Testing Library](01-jest-y-react-testing-library.md) | [🏠 Inicio](../index.md) | [Cypress (Pruebas End-to-End) ▶](03-cypress-pruebas-end-to-end.md) |
