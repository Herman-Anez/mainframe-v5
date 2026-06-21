# `createContext` y Provider

## Creación del contexto
`React.createContext(defaultValue)` crea un objeto Contexto. Este objeto contiene dos piezas clave:
- `Context.Provider`: componente React.
- `Context.Consumer`: componente legado; en funciones se prefiere `useContext`.

```jsx
const ThemeContext = React.createContext('light');
```

El `defaultValue` es el valor que se usa cuando un componente consume el contexto **sin un Provider ascendente** que lo envuelva. Es útil para pruebas o cuando un componente puede funcionar de forma aislada con un valor razonable.

## El componente Provider
```jsx
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
```
Cada Provider acepta una prop `value` (puede ser cualquier tipo: string, objeto, número, función). Internamente, React almacena el valor en la fibra del Provider y lo compara con `Object.is` en cada render. Cuando `value` cambia, React programa una actualización de todos los componentes consumidores descendientes.

## Jerarquía y anidamiento
Los Providers pueden anidarse y cada uno crea un "ámbito" para su contexto. Un consumidor lee el valor del Provider más cercano hacia arriba en el árbol. Si no hay Provider, usa el `defaultValue`.

```jsx
<ThemeContext.Provider value="dark">
  <Toolbar />           // lee "dark"
  <ThemeContext.Provider value="light">
    <Sidebar />         // lee "light"
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

## Rendimiento y propagación de actualizaciones
Cada vez que se renderiza un Provider con un nuevo `value`, **todos los componentes descendientes que consumen ese contexto se re-renderizan**, incluso si están envueltos en `React.memo`. No hay manera de suscribirse selectivamente a una parte del valor del contexto sin patrones adicionales. Por eso, es crítico:
- Evitar recrear objetos en el `value` en cada render del Provider.
- Dividir contextos en piezas pequeñas según responsabilidades (tema, autenticación, preferencias de usuario, etc.).

**Estabilizar el valor con `useMemo`**:
```jsx
function App() {
  const [theme, setTheme] = useState('dark');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>
      <Contenido />
    </ThemeContext.Provider>
  );
}
```
Si no usas `useMemo`, el objeto `{ theme, setTheme }` se crea nuevo en cada render y dispara una actualización en todos los consumidores aunque `theme` no haya cambiado.

## Provider con estado integrado
Es una buena práctica encapsular el Provider junto con su lógica de estado en un componente compuesto:

```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```
Así, la aplicación se envuelve con un solo componente y la lógica permanece encapsulada.

## Contexto con `useReducer`
Para estado global más complejo, `useReducer` dentro de un Provider es un patrón muy potente:

```jsx
const CountContext = createContext();
const DispatchContext = createContext();

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(countReducer, initialState);
  return (
    <CountContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </CountContext.Provider>
  );
}
```
Separar el estado y el dispatch en dos Providers distintos evita que los componentes que solo necesitan despachar acciones se re-rendericen cuando el estado cambia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Buenas prácticas en formularios React](../07-formularios/03-buenas-practicas-en-formularios-react.md) | [🏠 Inicio](../index.md) | [`useContext` ▶](02-usecontext.md) |
