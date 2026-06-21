# Jotai y Recoil (Estado atómico)

Jotai y Recoil representan un paradigma diferente: el **estado atómico**, donde el estado se divide en piezas independientes llamadas **átomos**. Los componentes se suscriben a átomos específicos y se re-renderizan solo cuando esos átomos cambian.

## Jotai

### Átomos
Un átomo es una unidad mínima de estado. Se crea con `atom()` y se consume con `useAtom`.

```jsx
import { atom, useAtom } from 'jotai';

const contadorAtom = atom(0);

function Contador() {
  const [count, setCount] = useAtom(contadorAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Átomos derivados
Puedes crear átomos que dependen de otros. Jotai los rastrea automáticamente.

```jsx
const dobleAtom = atom((get) => get(contadorAtom) * 2);
```

Cuando el valor de `contadorAtom` cambia, `dobleAtom` se actualiza y cualquier componente que lo lea se re-renderiza. Esto crea un grafo de dependencias reactivas.

### Átomos con estado asíncrono
Jotai soporta átomos basados en promesas de manera nativa, integrándose con Suspense.

```jsx
const usuarioAtom = atom(async (get) => {
  const id = get(userIdAtom);
  const res = await fetch(`/api/user/${id}`);
  return res.json();
});

function Usuario() {
  const [usuario] = useAtom(usuarioAtom); // suspende si la promesa no está resuelta
  return <div>{usuario.nombre}</div>;
}
```

### Sin Provider (opcional)
Jotai funciona sin Provider; los átomos mantienen su estado en un store interno por defecto. Se puede usar un Provider para aislar contextos (útil en tests).

### Familia de átomos
`atomFamily` permite crear átomos parametrizados, ideales para colecciones dinámicas.

```jsx
const itemAtom = atomFamily((id) => atom({ id, value: '' }));
```

## Recoil
Recoil es la biblioteca de Meta (Facebook) basada en el mismo paradigma atómico. Sus conceptos clave son:
- **Átomo**: unidad de estado.
- **Selector**: unidad derivada (pura o asíncrona).
- **RecoilRoot**: Provider obligatorio.

Su API es similar, pero utiliza strings como claves para identificación (necesario para persistencia y DevTools). Ejemplo:
```jsx
const contadorAtom = atom({ key: 'contador', default: 0 });
const dobleAtom = selector({
  key: 'doble',
  get: ({ get }) => get(contadorAtom) * 2,
});
```

**Estado actual:** Recoil está en desarrollo experimental y con menor mantenimiento reciente; Jotai ha ganado popularidad como alternativa más simple y sin strings.

## Ventajas del modelo atómico
- **Re-renderizados quirúrgicos**: un componente solo se actualiza cuando el átomo específico que lee cambia.
- **Composición natural**: derivar estado sin necesidad de selectores manuales.
- **División del estado**: fomenta micro-estados independientes.
- **Suspense para datos asíncronos**: integración perfecta con React 18+.

## Cuándo usarlo
- Aplicaciones con muchos estados locales que se convierten en globales (ej. formularios complejos compartidos).
- Cuando la granularidad de actualización es crítica (evitar re-renders de listas enormes).
- Si prefieres un modelo reactivo declarativo sobre imperativo (Zustand) o acciones (Redux).

## Comparación con Zustand
Zustand es un store externo único (o varios stores), con selectores. Jotai son múltiples átomos. Ambos evitan Provider y son ligeros. Zustand tiende a ser más simple para lógica de negocio centralizada (carrito, autenticación); Jotai brilla cuando tienes muchas piezas de estado interconectadas. La elección es de estilo y necesidades de rendimiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Zustand](03-zustand.md) | [🏠 Inicio](../index.md) | [React Query y SWR (Server State) ▶](05-react-query-y-swr-server-state.md) |
