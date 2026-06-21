# Higher-Order Components (HOCs)

Un **Higher-Order Component** es una función que toma un componente y devuelve un nuevo componente mejorado. Está inspirado en las funciones de orden superior de JavaScript (`map`, `filter`, etc.). La convención es nombrar la función con `with` + Capacidad (ej. `withRouter`, `withAuth`, `withLogger`).

## Estructura básica
```jsx
const withLogging = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Componente ${WrappedComponent.displayName || WrappedComponent.name} montado`);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Uso
const BotonConLogging = withLogging(Boton);
```

## Propósito
Reutilizar **lógica transversal** (cross-cutting concerns) que no es específica de un componente: logging, autenticación, inyección de datos (como conectar a Redux), medición de rendimiento, manipulación de props, etc. El HOC envuelve al componente original y puede:
- Inyectar props adicionales.
- Modificar el comportamiento (ej. prevenir renderizado si no está autenticado).
- Manejar estado y ciclo de vida que luego comparte.

## Convenciones
- **Pasar las props no relacionadas** directamente al componente envuelto: `<WrappedComponent {...this.props} />` (en clases) o `{...passthroughProps}` en funciones.
- **Maximizar la compatibilidad**: el HOC debe ser transparente, no debe modificar el prototipo del componente original.
- **Display name**: asignar un nombre legible para facilitar la depuración.
  ```js
  withLogging.displayName = `WithLogging(${getDisplayName(WrappedComponent)})`;
  ```
- **No usar HOCs dentro del método render**: porque se crearía una nueva instancia en cada render, desmontando y montando el componente interno. Los HOCs se aplican una vez, en la fase de definición, fuera del componente.

## Ejemplo real: Conexión a Redux (con `connect`)
Antes de hooks, `connect(mapStateToProps, mapDispatchToProps)` era un HOC por excelencia. Proporcionaba estado global y despachadores como props al componente.

## HOCs vs Hooks
Con la aparición de hooks, la mayoría de los casos de lógica reutilizable con estado se resuelven mediante **hooks personalizados**, que son más simples y no generan anidamiento adicional en el árbol de componentes (no hay *wrapper hell*). Sin embargo, los HOCs siguen siendo útiles cuando:
- Necesitas modificar el componente a nivel estructural (ej. agregar un `Suspense` o un proveedor de contexto) sin tocar el JSX del consumidor.
- Estás trabajando con componentes de clase y no puedes usar hooks.
- Algunas librerías (React Router v5, Redux) ofrecían APIs basadas en HOCs que aún pueden usarse. La tendencia es migrar a hooks (ej. `useSelector`, `useDispatch` en Redux Toolkit).

## Ejemplo de HOC funcional (con hooks)
Los HOCs no tienen por qué ser clases; pueden ser funciones que retornan componentes funcionales con hooks:
```jsx
const withOnlineStatus = (WrappedComponent) => (props) => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handle = () => setOnline(navigator.onLine);
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
    return () => {
      window.removeEventListener('online', handle);
      window.removeEventListener('offline', handle);
    };
  }, []);
  return <WrappedComponent {...props} online={online} />;
};
```

## Precauciones
- **Propagación de refs**: un HOC envuelve al componente, así que la `ref` de un padre no apuntará directamente al componente envuelto a menos que uses `React.forwardRef` en el HOC.
- **Conflicto de nombres de props**: si el HOC inyecta una prop con el mismo nombre que una prop existente, puede haber colisiones. Documentar bien las props inyectadas ayuda.
- **Static methods**: no se copian automáticamente; si necesitas copiarlas, debes hacerlo manualmente o usar bibliotecas como `hoist-non-react-statics`.

---

En resumen, este bloque de componentes te da el arsenal para crear piezas de interfaz robustas y modulares: desde los funcionales modernos, el legado de clases que aún perdura, la correcta tipificación de props, el poder de la composición sobre la herencia, los patrones `children`/render props para flexibilizar, y los HOCs como técnica de reutilización de lógica en un mundo pre-hooks. Con estos cimientos, podrás tomar decisiones informadas sobre cuándo y cómo usar cada herramienta.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Children y Render Props](05-children-y-render-props.md) | [🏠 Inicio](../index.md) | [Estado local con `useState` ▶](../03-estado-y-ciclo-de-vida/01-estado-local-con-usestate.md) |
