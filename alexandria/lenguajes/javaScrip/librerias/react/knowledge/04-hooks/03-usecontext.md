# `useContext`

El contexto resuelve el **prop drilling** (pasar props a través de muchos componentes intermedios que no las necesitan). `useContext` es el hook para consumirlo en funciones.

## Creación y provisión
```jsx
const ThemeContext = React.createContext('light'); // valor por defecto

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

## Consumo con `useContext`
```jsx
function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

## Comportamiento y rendimiento
Cada vez que el `value` del Provider cambia (comparado con `Object.is`), **todos los componentes que consumen ese contexto se re-renderizan**, sin importar si usan `React.memo`. No hay forma de suscribirse a una parte del contexto; es todo o nada. Por eso, se recomiendan estrategias:

- **Dividir contextos**: no pongas todo en un solo objeto. Separa contexto de tema, de autenticación, de preferencias, etc. Así, un cambio en el tema no re-renderiza componentes que solo leen datos de usuario.
- **Componente intermedio con `React.memo` y children**: si colocas el `Provider` en lo alto pero pasas `children` como prop, los hijos directos no se re-renderizan porque `children` es un prop que no cambia.
- **Usar selectores en contextos** (con bibliotecas como `use-context-selector`) para evitar renderizados masivos.

## Valor por defecto
El valor por defecto se usa cuando no hay Provider arriba. Es útil en pruebas o componentes aislados.

## Patrón: Provider con estado
Es común encapsular el Provider en un componente que maneje el estado y exponga tanto el valor como funciones para actualizarlo, a menudo usando `useReducer`:

```jsx
const CountContext = createContext();

function CountProvider({ children }) {
  const [count, dispatch] = useReducer(countReducer, 0);
  return (
    <CountContext.Provider value={{ count, dispatch }}>
      {children}
    </CountContext.Provider>
  );
}
```

## Cuándo no usar Context
- No está pensado para estado que cambia muy frecuentemente (ej. cada tecla en un input). En esos casos, mantén el estado local.
- Para estado global complejo, considera soluciones como Redux Toolkit, Zustand o Jotai, que tienen mecanismos de suscripción selectiva.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `useEffect` y suscripciones](02-useeffect-y-suscripciones.md) | [🏠 Inicio](../index.md) | [`useRef` y el DOM ▶](04-useref-y-el-dom.md) |
