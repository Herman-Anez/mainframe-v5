# Render Props vs. Higher-Order Components (HOC)

Ambos son patrones históricos para reutilizar lógica de estado entre componentes. Con la llegada de los hooks, muchos de sus casos de uso se simplifican, pero es crucial entenderlos porque aún aparecen en librerías y código heredado.

## Render Props
Consiste en pasar una función como prop (comúnmente `render`, `children` o un nombre descriptivo) a un componente. Este componente "proveedor" invoca la función con los datos o estado que quiere compartir, delegando la decisión de qué renderizar al consumidor.

**Ejemplo con `MouseTracker`:**
```jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };
  handleMouseMove = (e) => this.setState({ x: e.clientX, y: e.clientY });
  render() {
    return <div onMouseMove={this.handleMouseMove}>{this.props.render(this.state)}</div>;
  }
}

// Uso
<MouseTracker render={({ x, y }) => <p>Posición: {x}, {y}</p>} />
```

**Variantes:**
- `children` como función: `<MouseTracker>{({x, y}) => ...}</MouseTracker>`
- Prop con nombre específico: `fallback`, `item`, etc.

**Ventajas:**
- **Flexibilidad total**: el consumidor decide qué mostrar y cómo.
- **Explícito**: la lógica se pasa directamente, es fácil ver qué datos se inyectan.
- **No crea componentes adicionales en el árbol** (salvo el proveedor), evita el "wrapper hell" excesivo de HOCs.

**Desventajas:**
- **Sintaxis anidada**: si se encadenan varios, se produce un "callback hell" visual.
- **Funciones recreadas en cada render**: puede impactar el rendimiento si no se usa `React.memo` o si el proveedor es una clase que compara props (la función cambia en cada render). Con hooks se puede estabilizar con `useCallback` en el consumidor, pero el proveedor debe estar optimizado.
- **Dificultad para usar con `React.memo` y `shouldComponentUpdate`** porque la función es una prop nueva cada vez.

## Higher-Order Components (HOC)
Es una función que toma un componente y devuelve un componente nuevo, inyectando lógica adicional.

**Ejemplo: `withMouse` (HOC equivalente al render prop anterior):**
```jsx
function withMouse(WrappedComponent) {
  return class extends React.Component {
    state = { x: 0, y: 0 };
    handleMouseMove = (e) => this.setState({ x: e.clientX, y: e.clientY });
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <WrappedComponent {...this.props} mouse={this.state} />
        </div>
      );
    }
  };
}

// Uso
const DisplayMouse = withMouse(({ mouse }) => <p>{mouse.x}, {mouse.y}</p>);
```

**Ventajas:**
- **Reutilización declarativa**: se aplica una vez en la definición, no en cada render.
- **Puede manipular props**: añadir, modificar, filtrar props.
- **Fácil de componer**: `compose(withA, withB)(Component)`.

**Desventajas:**
- **Wrapper hell**: muchos HOCs anidados crean un árbol de componentes difícil de inspeccionar en DevTools.
- **Colisión de props**: si dos HOCs inyectan la misma prop, puede haber conflicto.
- **No transparente para refs**: el HOC envuelve y la ref no pasa automáticamente; hay que usar `forwardRef`.
- **Mal entendido del orden de composición**: `withA(withB(Comp))` aplica B primero, luego A.

## ¿Render Props o HOC? Y la llegada de los hooks
- **Antes de hooks**, la elección dependía de la situación: HOC para lógica transversal que se aplica a muchos componentes (conectar a Redux), render props para lógica con estado que requiere control fino del renderizado.
- **Con hooks**, la mayoría de las veces se puede extraer la lógica en un **custom hook**. Los hooks no añaden componentes al árbol, no sufren colisiones de props y son más fáciles de componer.

**Ejemplo con hooks (equivalente a `useMouse`):**
```jsx
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return position;
}

// Uso
function Display() {
  const { x, y } = useMouse();
  return <p>{x}, {y}</p>;
}
```
**Claramente superior**: sin componentes extra, sin cambios en la jerarquía.

## ¿Aún valen la pena?
- **HOCs**: aún se usan cuando necesitas inyectar algo que no se puede hacer con hooks puramente, como envolver en un `Suspense` o proveer un contexto adicional sin modificar el componente original. Algunas librerías como `react-redux` ofrecen tanto hooks (`useSelector`) como HOC (`connect`) por compatibilidad y preferencia.
- **Render Props**: en librerías que necesitan ceder el control total del renderizado (ej. `react-motion`, `downshift`), el render prop sigue siendo más flexible que un hook porque el consumidor decide qué elementos del DOM se crean, mientras el proveedor gestiona la lógica. Pero incluso en esos casos, muchos ofrecen hooks + prop getters (como `useCombobox`) como alternativa.

## Comparación final
| Característica          | Render Props                               | HOC                                      | Hooks personalizados               |
|-------------------------|--------------------------------------------|------------------------------------------|-----------------------------------|
| **Forma**               | Prop función (render/children)             | Función que envuelve componente          | Función que usa hooks             |
| **Árbol de componentes** | Añade un proveedor, los hijos son función  | Añade uno o más wrappers                 | No afecta el árbol                |
| **Rendimiento**         | Puede causar re-renders si no se optimiza  | Similar; se evitan renders si los props no cambian | Solo re-renderiza el componente anfitrión |
| **Composición**         | Encadenable pero verboso                   | Encadenable con `compose`                | Se llama directamente             |
| **Estado actual**       | Útil para delegar renderizado              | Útil para inyección declarativa          | Preferido para lógica reutilizable |

**Recomendación:** Siempre que puedas, extrae la lógica a un hook personalizado. Reserva los render props para cuando necesites un control granular del renderizado desde fuera, y los HOCs para envolturas declarativas (como proveedores de contexto) o para soporte de componentes de clase.

---

Estos cuatro patrones enriquecen tu caja de herramientas. Los componentes compuestos aportan una API elegante y contextual; el state reducer y los prop getters te dan un control quirúrgico sobre el comportamiento interno; y conocer la evolución de render props y HOCs te permite leer y mantener cualquier base de código React, al tiempo que abrazas el presente de los hooks.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Prop Getters](03-prop-getters.md) | [🏠 Inicio](../index.md) | [ARIA y gestión del foco ▶](../18-accesibilidad-i18n/01-aria-y-gestion-del-foco.md) |
