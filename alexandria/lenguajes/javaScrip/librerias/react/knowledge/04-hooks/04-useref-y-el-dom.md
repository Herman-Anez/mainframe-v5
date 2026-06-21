# `useRef` y el DOM

`useRef` devuelve un objeto mutable con una propiedad `current` que persiste durante toda la vida del componente. A diferencia del estado, mutar `ref.current` **no provoca un nuevo render**.

## Uso principal: acceso al DOM
```jsx
function TextInputWithFocus() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current?.focus();
  return <input ref={inputRef} />;
}
```

El atributo `ref` en un elemento JSX asigna automáticamente el nodo DOM a `ref.current` tras el montaje. En el desmontaje, vuelve a `null`.

## No leer/escribir refs durante el render
React asume que el render es puro. Si lees o modificas `ref.current` durante el render (fuera de un efecto o manejador), puedes obtener resultados inconsistentes y será difícil de razonar. Los lugares correctos son:
- Manejadores de eventos.
- `useEffect` o `useLayoutEffect`.

## Almacenar valores mutables que no necesitan ser reactivos
`useRef` es excelente para guardar IDs de intervalo, instancias de librerías externas o cualquier valor que cambie pero no deba disparar un render.

```jsx
const intervalId = useRef(null);
useEffect(() => {
  intervalId.current = setInterval(/* ... */);
  return () => clearInterval(intervalId.current);
}, []);
```

## Diferencias con `useState`
| Característica        | `useState`                       | `useRef`                           |
|----------------------|----------------------------------|-------------------------------------|
| Causa re-render       | Sí, al actualizar               | No                                  |
| Almacenamiento        | Valor inmutable (reemplazar)    | Objeto mutable (`.current`)         |
| Lectura en render     | Segura                           | Segura pero no reactiva             |
| Uso típico            | Datos que afectan la UI         | Referencias a DOM, valores no-UI    |

## `forwardRef` y `useImperativeHandle`
`forwardRef` permite que un componente padre pase un ref a un hijo, normalmente para acceder a un nodo DOM interno.

```jsx
const FancyInput = forwardRef((props, ref) => {
  const internalRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => internalRef.current.focus(),
    // expone solo lo que quieras
  }));
  return <input ref={internalRef} />;
});
```

`useImperativeHandle` personaliza el valor de la ref expuesta, evitando exponer todo el DOM interno y dando una API controlada.

## El objeto ref es estable
El objeto devuelto por `useRef` se crea una vez y se mantiene idéntico entre renders. Puedes pasarlo a hijos sin preocuparte por renders extra.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useContext`](03-usecontext.md) | [🏠 Inicio](../index.md) | [`useReducer` ▶](05-usereducer.md) |
