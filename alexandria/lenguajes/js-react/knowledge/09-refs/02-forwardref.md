# `forwardRef`

## El problema que resuelve
Los componentes funcionales no reciben el atributo `ref`. Si intentas pasar `ref` directamente a un componente funcional, React lo ignorará (o mostrará un warning). `forwardRef` es la forma de reenviar esa `ref` a un hijo interno.

```jsx
// Componente funcional sin forwardRef: ❌
function MyInput(props) {
  return <input {...props} />;
}
// <MyInput ref={miRef} /> => miRef no recibe nada
```

## Uso de `forwardRef`
`React.forwardRef` es una función de orden superior que envuelve el componente. Recibe una función de renderizado que acepta `(props, ref)` además de `props`.

```jsx
const MyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// Ahora <MyInput ref={miRef} /> funciona; miRef.current apuntará al input interno.
```

## Convenciones
- El segundo parámetro `ref` solo se recibe si el componente está envuelto en `forwardRef`.
- Puedes pasar la `ref` directamente a un elemento DOM o a otro componente con `forwardRef`.
- Los props del componente no incluyen `ref`; `ref` se extrae aparte por React.

## Combinación con `useImperativeHandle`
A veces no queremos exponer el nodo DOM completo, sino una API controlada. `useImperativeHandle` personaliza el valor de la ref que verá el padre.

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { inputRef.current.value = ''; },
    // No exponemos inputRef.current
  }), []);

  return <input ref={inputRef} />;
});
```

Con esto, el padre solo puede llamar a `fancyInputRef.current.focus()` y `clear()`, encapsulando el DOM interno.

## `forwardRef` y TypeScript
Es necesario tipar el componente correctamente para que el padre pueda usar la ref con el tipo adecuado.

```tsx
interface FancyInputHandle {
  focus: () => void;
  clear: () => void;
}

const FancyInput = forwardRef<FancyInputHandle, { label: string }>((props, ref) => {
  // ...
});
```

El primer parámetro de tipo es la interfaz de la ref, el segundo los props.

## Reenviar ref a un componente hijo con nombre de display
Para DevTools, puedes asignar un `displayName` o usar la función con nombre para que el componente sea identificable.
```jsx
const MyInput = forwardRef(function MyInput(props, ref) { ... });
// o
MyInput.displayName = 'MyInput';
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useRef` y el DOM](01-useref-y-el-dom.md) | [🏠 Inicio](../index.md) | [Usos avanzados de refs ▶](03-usos-avanzados-de-refs.md) |
