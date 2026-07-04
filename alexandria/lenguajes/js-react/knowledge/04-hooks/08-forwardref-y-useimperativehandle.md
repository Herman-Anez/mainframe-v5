# `forwardRef` y `useImperativeHandle`

## `forwardRef`: pasar refs a hijos
`forwardRef` es un HOC que permite que un componente funcional reciba un `ref` y lo asigne a un nodo DOM interno o a otro componente.

```jsx
const FancyInput = React.forwardRef((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />;
});

// Uso
function Parent() {
  const inputRef = useRef(null);
  return <FancyInput ref={inputRef} />;
}
```

Sin `forwardRef`, el atributo `ref` no puede ser pasado a un componente funcional; se necesita esta envoltura. Internamente, el componente recibe el `ref` como segundo argumento después de `props`.

## `useImperativeHandle`: personalizar la instancia expuesta
Por defecto, cuando un padre usa `ref` en un hijo, obtiene acceso directo al nodo DOM interno si este lo ha asignado mediante `forwardRef`. Pero a veces queremos exponer solo una API controlada, no todo el DOM. `useImperativeHandle` personaliza el valor del `ref` que el padre recibe.

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    scrollIntoView: () => inputRef.current?.scrollIntoView(),
    // No exponemos inputRef.current entero
  }), []);

  return <input ref={inputRef} />;
});
```

Ahora el padre solo puede llamar a `focus()` y `scrollIntoView()`, protegiendo el encapsulamiento.

**Dependencias**: el segundo argumento de `useImperativeHandle` es una función que crea el objeto expuesto, y el tercero es un arreglo de dependencias. Si alguna cambia, se re-ejecuta la función. Normalmente es `[]` porque el objeto expuesto es estable, pero si dependiera de algún estado, deberías incluirlo.

## Casos de uso
- **Componentes de librerías** que quieren ofrecer una API imperativa segura (ej. `input.focus()`, `slider.next()`).
- **Medidas o animaciones** donde el padre necesita controlar un hijo sin acoplarse a su DOM interno.
- **Integración con librerías no React** que requieren acceso a nodos del DOM.

## Advertencias
- No abuses de la API imperativa. React fomenta lo declarativo. Si te encuentras usando `useImperativeHandle` para casi todo, probablemente estés yendo contra el paradigma.
- `forwardRef` y `useImperativeHandle` añaden complejidad; mantenlo simple si el consumidor solo necesita `ref` directa al DOM.

## Combinación con `useRef` y `useImperativeHandle` en un mismo componente
```jsx
const VideoPlayer = forwardRef(({ src }, ref) => {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    get currentTime() { return videoRef.current?.currentTime; },
  }));

  return <video ref={videoRef} src={src} />;
});
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useLayoutEffect`](07-uselayouteffect.md) | [🏠 Inicio](../index.md) | [`useId` ▶](09-useid.md) |
