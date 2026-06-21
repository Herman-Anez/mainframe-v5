# Manejo de eventos en React

Una vez comprendido el sistema subyacente, hay que dominar los patrones de uso, evitar errores comunes y escribir código limpio y eficiente.

## Declaración de manejadores
En JSX, los manejadores de eventos se pasan como **referencias a funciones**, no como strings. Los nombres de los atributos van en camelCase:

```jsx
// ✅ Correcto
<button onClick={handleClick}>Clic</button>

// ❌ Incorrecto (string, solo en HTML clásico)
<button onclick="handleClick()">Clic</button>
```

No se invoca la función directamente; se pasa la referencia. Si necesitas pasar argumentos, envuelve en una arrow function o usa `bind` (ver más abajo).

## En componentes funcionales
La naturaleza léxica de las funciones y los hooks simplifica el manejo de eventos:

```jsx
function Contador() {
  const [count, setCount] = useState(0);

  function incrementar() {
    setCount(c => c + 1);
  }

  return <button onClick={incrementar}>+</button>;
}
```

No hay que preocuparse por `this`; las funciones definidas dentro del componente capturan el estado de ese render (aunque con `setCount(c => ...)` se evitan problemas de cierre obsoleto).

## En componentes de clase
En clases, el método debe estar ligado a la instancia. Tres opciones:

1. **Binding en el constructor** (recomendado en su momento):
   ```jsx
   class Button extends React.Component {
     constructor(props) {
       super(props);
       this.handleClick = this.handleClick.bind(this);
     }
     handleClick() { ... }
     render() { return <button onClick={this.handleClick} />; }
   }
   ```
2. **Campos de clase con arrow function** (sintaxis moderna, aunque es experimental en JS puro; soportado por TypeScript y Babel):
   ```jsx
   class Button extends React.Component {
     handleClick = () => { ... };
     render() { return <button onClick={this.handleClick} />; }
   }
   ```
   Esto crea una función por instancia, no por render; es conveniente y evita binding manual.
3. **Arrow function en el JSX**:
   ```jsx
   <button onClick={() => this.handleClick()}>Clic</button>
   ```
   Crea una nueva función en cada render, lo que puede afectar el rendimiento si se pasa a componentes hijos optimizados. Solo aceptable si no hay otra opción o el componente no es `PureComponent`/`memo`.

## Pasar argumentos al manejador
Para enviar datos adicionales, la envoltura con arrow function es la más legible:

```jsx
{items.map(item => (
  <button key={item.id} onClick={(e) => eliminarItem(item.id, e)}>
    Eliminar
  </button>
))}
```

Con `bind` (menos común en funciones, más típico en clases):
```jsx
<button onClick={this.eliminarItem.bind(this, item.id)}>
```

## Prevenir comportamiento por defecto y detener propagación
- **`e.preventDefault()`**: cancela la acción nativa del navegador (ej. seguir un enlace, enviar un formulario). Debe llamarse dentro del manejador.
- **`e.stopPropagation()`**: detiene la propagación del evento hacia los ancestros en el árbol de React. El evento nativo ya burbujeó hasta la raíz, pero React evita que los manejadores de los padres se ejecuten. Esto es suficiente en la mayoría de los casos.
- Si necesitas detener también la propagación nativa (por ejemplo, para que un listener nativo fuera de React no lo reciba), usa `e.nativeEvent.stopImmediatePropagation()`, aunque rara vez es necesario.

**Ejemplo de formulario:**
```jsx
function handleSubmit(e) {
  e.preventDefault();
  // lógica de envío AJAX
}
return <form onSubmit={handleSubmit}>...</form>;
```

## Batch de actualizaciones en manejadores de eventos
React agrupa múltiples llamadas a `setState` (o setters de `useState`) que ocurran en el mismo manejador de evento sintético, y las aplica en un solo render. En React 18, el batching es automático incluso en `setTimeout`, promesas y eventos nativos.

## Acceso asíncrono al evento
Desde la eliminación del pooling (React 17), el `SyntheticEvent` es persistente. Puedes acceder a él dentro de callbacks asíncronos sin `e.persist()`. Sin embargo, se considera buena práctica extraer los valores necesarios de inmediato para evitar confusiones:
```jsx
const target = e.target;
setTimeout(() => console.log(target.value), 1000);
```

## Rendimiento: evitar funciones inline innecesarias
Cada vez que defines una arrow function en el JSX, creas una nueva referencia en cada render. Esto puede ser perjudicial si el componente hijo está optimizado con `React.memo`, porque recibiría una prop "nueva" cada vez y se re-renderizaría sin necesidad.

**Solución con hooks:**
```jsx
const handleDelete = useCallback((id) => {
  setItems(items => items.filter(i => i.id !== id));
}, []); // dependencias vacías porque usa actualización funcional

return items.map(item => (
  <Item key={item.id} item={item} onDelete={handleDelete} />
));
```
Así `handleDelete` es estable, y `Item` envuelto en `React.memo` solo se re-renderiza si cambian sus otras props.

## Patrones comunes
- **Manejo de inputs controlados**:
  ```jsx
  const [text, setText] = useState('');
  <input value={text} onChange={e => setText(e.target.value)} />
  ```
- **Múltiples inputs con un solo handler** usando el atributo `name`:
  ```jsx
  const [form, setForm] = useState({ username: '', password: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  ```
- **Teclas y accesibilidad**: `onKeyDown` para atajos, `onKeyUp` para fin de composición. Ejemplo: cerrar modal con Escape.
  ```jsx
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  ```

## Eventos no controlados y refs
Cuando necesitas acceder a un valor de manera imperativa sin controlarlo (ej. campo de archivo), usas `useRef` y el evento `onChange` para leerlo:
```jsx
const fileRef = useRef(null);
const handleUpload = () => {
  const file = fileRef.current.files[0];
  ...
};
return <input type="file" ref={fileRef} onChange={handleUpload} />;
```

## Propagación en portales
Un portal renderiza hijos fuera del contenedor raíz en el DOM. Sin embargo, **la propagación de eventos sintéticos sigue el árbol de React**, no la jerarquía del DOM. Por tanto, un evento en un portal burbujeará a sus ancestros React, lo cual es muy útil para modales y tooltips.

## Integración con TypeScript
Los eventos sintéticos tienen tipos genéricos según el elemento:
```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... };
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... };
```
Para eventos de teclado: `React.KeyboardEvent<HTMLInputElement>`. Para el genérico: `React.SyntheticEvent`.

## Buenas prácticas finales
- Prefiere `onSubmit` en formularios sobre `onClick` en botones para soportar teclado y validación nativa.
- No uses `return false` para prevenir el comportamiento por defecto; solo funciona en HTML puro. Usa `e.preventDefault()`.
- Limpia event listeners nativos (añadidos con `ref`) en el `useEffect` de limpieza para evitar fugas de memoria.
- Centraliza la lógica de eventos complejos en hooks personalizados (ej. `useKeyPress`, `useOutsideClick`).

---

Dominar los eventos sintéticos y su manejo es esencial para que tus aplicaciones React sean interactivas, accesibles y de alto rendimiento. La abstracción de React te aísla de las diferencias entre navegadores y te permite concentrarte en la lógica, siempre que respetes sus convenciones y patrones de optimización.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ SyntheticEvent (Synthetic Events)](01-syntheticevent-synthetic-events.md) | [🏠 Inicio](../index.md) | [Componentes controlados ▶](../07-formularios/01-componentes-controlados.md) |
