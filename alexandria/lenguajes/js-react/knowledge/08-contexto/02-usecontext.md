# `useContext`

## Consumo de contexto con hooks
`useContext(Context)` devuelve el valor actual del contexto para ese componente. React busca hacia arriba en el árbol y devuelve el `value` del Provider más cercano. Si no encuentra ninguno, retorna el `defaultValue`.

```jsx
const theme = useContext(ThemeContext);
```

## Comportamiento reactivo
Cada vez que el valor del Provider más cercano cambia (según `Object.is`), el componente se re-renderiza. No importa si el componente solo necesita una parte del valor; si el objeto completo es nuevo, se re-renderiza. De ahí la importancia de dividir contextos.

## Advertencias comunes
- **`useContext` en el mismo componente que el Provider**: no lee su propio valor; necesita estar dentro de un descendiente para ver el cambio. Si renderizas un Provider y quieres consumirlo dentro del mismo componente, debes separarlo en dos.
- **Renderizado condicional de Providers**: si un Provider se monta/desmonta dinámicamente, los consumidores cambian entre el valor provisto y el `defaultValue`, lo que puede provocar montajes/desmontajes inesperados.

## Ejemplo con tema oscuro/claro
```jsx
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
      onClick={toggleTheme}
    >
      Cambiar tema
    </button>
  );
}
```

## Consumo con `Consumer` (legado)
En componentes de clase o cuando necesitas render props, se usa `<Context.Consumer>`:
```jsx
<ThemeContext.Consumer>
  {value => <button style={{ color: value }}>Texto</button>}
</ThemeContext.Consumer>
```
En funciones modernas, `useContext` es siempre preferible.

## Anidamiento de contextos
Un componente puede consumir múltiples contextos sin problema. El orden de las llamadas no afecta porque los hooks de contexto no dependen del orden secuencial (a diferencia de `useState`). React identifica el contexto exacto mediante el objeto que pasaste a `createContext`.

```jsx
const theme = useContext(ThemeContext);
const user = useContext(UserContext);
```

## Problema de rendimiento: estabilización con `useMemo` en el consumidor
Si no puedes dividir el contexto y solo necesitas una propiedad calculada, puedes memorizar el resultado en el consumidor con `useMemo`:
```jsx
const { theme } = useContext(AppContext);
const buttonStyle = useMemo(() => ({ background: theme === 'dark' ? '#000' : '#fff' }), [theme]);
```
Esto no evita el re-render del componente, pero sí evita que los hijos reciban un nuevo objeto de estilo.

## Depuración con React DevTools
En DevTools, puedes ver el árbol de componentes y los Providers, así como los valores actuales de los contextos, lo que facilita entender qué valor está llegando a cada consumidor.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `createContext` y Provider](01-createcontext-y-provider.md) | [🏠 Inicio](../index.md) | [Composición vs. Contexto ▶](03-composicion-vs-contexto.md) |
