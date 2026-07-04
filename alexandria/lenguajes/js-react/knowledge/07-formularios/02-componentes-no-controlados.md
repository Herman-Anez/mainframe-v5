# Componentes no controlados

En un componente **no controlado**, el estado del formulario lo mantiene el propio DOM. React no controla el valor; solo lo lee cuando es necesario (generalmente mediante `ref`). Es más parecido al comportamiento tradicional de HTML.

## Características
- El valor se establece con `defaultValue` o `defaultChecked` (no con `value`/`checked`).
- Para obtener el valor actual, se usa una referencia (`useRef`) o se lee el formulario entero en el momento del envío.

```jsx
function FormularioNoControlado() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombre = inputRef.current.value;
    console.log(nombre);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" defaultValue="Invitado" ref={inputRef} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

## Lectura del valor
- Mediante `ref`: accedes a la propiedad `value` del nodo DOM.
- En el evento `onSubmit` del formulario, puedes usar `new FormData(formElement)` para capturar todos los campos sin refs individuales.

```jsx
const formRef = useRef(null);
const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(formRef.current);
  const datos = Object.fromEntries(formData.entries());
};
```

## Ventajas
- Menos re-renders: el valor no se almacena en el estado de React, por lo que escribir no dispara renderizado. Útil en formularios muy grandes o con campos que solo importan al enviar.
- Integración más simple con librerías no React que manipulan el DOM.
- Similar al HTML estándar, puede ser más fácil de migrar desde aplicaciones tradicionales.

## Desventajas
- La fuente de verdad está en el DOM, no en React. Dificulta la validación en tiempo real y la sincronización entre campos.
- Más difícil de integrar con el flujo declarativo de React: no puedes reaccionar a cambios de un campo sin adjuntar eventos manualmente.
- Las refs pueden hacer el código menos predecible.

## Cuándo son la opción correcta
- Campos de entrada de archivos (`<input type="file">`), donde el valor es un objeto FileList que React no puede controlar.
- Formularios simples y puntuales donde solo necesitas el valor al enviar.
- Integración con librerías que requieren acceso directo al DOM (ej. editores enriquecidos).
- Migraciones progresivas: empezar con no controlados y luego, si se necesita reactividad, envolver en controlados.

## Campos de archivo (file input)
Siempre no controlado:
```jsx
const fileRef = useRef(null);
const handleSubmit = (e) => {
  e.preventDefault();
  const archivo = fileRef.current.files[0];
};
<input type="file" ref={fileRef} />
```

## Transición entre controlado y no controlado
React advierte si un input pasa de ser controlado (con `value`) a no controlado (sin `value` o con `undefined`/`null`) o viceversa. Debes decidir un modo y mantenerlo constante durante la vida del componente. Un error común es tener `value={state}` y que `state` sea `undefined` inicialmente; eso lo convierte en no controlado. Asegúrate de inicializar con un string vacío si quieres controlado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componentes controlados](01-componentes-controlados.md) | [🏠 Inicio](../index.md) | [Buenas prácticas en formularios React ▶](03-buenas-practicas-en-formularios-react.md) |
