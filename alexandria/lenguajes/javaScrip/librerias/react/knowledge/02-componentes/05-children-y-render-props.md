# Children y Render Props

## `props.children`
Es la prop especial que todo componente recibe automáticamente y que contiene **lo que esté entre sus etiquetas de apertura y cierre**. No es necesario declararlo explícitamente; siempre está disponible como `props.children`.

Puede ser:
- Un string o número.
- Un elemento JSX simple.
- Un fragmento o array de elementos (cuando hay varios hijos). En React 16+, los arrays de hijos requieren `key` si se generan dinámicamente.
- Una función (esto enlaza con render props).

**Uso en composición**:
```jsx
function Contenedor({ children }) {
  return <div className="borde">{children}</div>;
}
```
Puedes manipular `children` con las utilidades `React.Children.map`, `React.Children.forEach`, `React.Children.count`, `React.Children.only`, pero en la mayoría de los casos no es necesario; basta con renderizarlo directamente.

**Children como función (Render Props indirecto)**  
A veces se pasa una función como `children`, permitiendo al padre proveer datos dinámicos:
```jsx
<ContadorDeClicks>
  {contador => <p>Has hecho clic {contador} veces</p>}
</ContadorDeClicks>
```
Esto es, en esencia, un render prop usando `children`. Sin embargo, el patrón clásico de Render Props utiliza una prop con nombre específico.

## Render Props
Es una técnica para **compartir lógica de estado o comportamiento entre componentes**. Consiste en que un componente reciba una prop (usualmente llamada `render` o con un nombre descriptivo) cuyo valor es una función que retorna JSX. El componente "proveedor" invoca esa función pasándole los datos que quiere exponer, delegando la decisión de renderizado al consumidor.

```jsx
class RastreadorRaton extends React.Component {
  state = { x: 0, y: 0 };
  manejarMovimiento = (e) => this.setState({ x: e.clientX, y: e.clientY });
  render() {
    return <div onMouseMove={this.manejarMovimiento}>{this.props.render(this.state)}</div>;
  }
}

// Uso:
<RastreadorRaton render={({ x, y }) => <p>Posición: {x}, {y}</p>} />
```

**Ventajas:**
- El componente que provee datos no necesita saber cómo se visualizan; esa responsabilidad es del consumidor.
- Permite reutilizar lógica con estado sin crear un HOC, y sin *wrapper hell* si se compone cuidadosamente.
- Puede ser nombrada de forma semántica (ej. `children`, `item`, `header`, `body`).

**Inconvenientes:**
- Puede crear anidamiento de funciones si no se extraen.
- Las funciones se recrean en cada render, lo que puede afectar el rendimiento si no se optimizan con `useCallback`/`useMemo` o si el proveedor es una clase con `shouldComponentUpdate` que compara props (y la función cambia en cada render). React.memo y `useMemo` ayudan en componentes funcionales.

**Relación con Hooks**: hoy en día, muchos casos de render props se resuelven más limpiamente con hooks personalizados. Pero el patrón sigue siendo útil cuando se necesita control total sobre el renderizado desde el consumidor (por ejemplo, en componentes de animación o librerías que ofrecen "render prop" y "hooks" como alternativa).

## Comparativa Children vs Render Prop
| **Aspecto**              | **`children`**                          | **Render Prop (prop con nombre)**         |
|--------------------------|-----------------------------------------|--------------------------------------------|
| Propósito                | Composición de contenido estático/dinámico | Inyectar datos/estado y delegar el renderizado |
| Número de slots          | Uno (el contenido principal)            | Puede haber múltiples props-función        |
| Legibilidad              | Sintaxis de anidado natural             | Llamada a función explícita, puede ser más verbosa |
| Uso típico               | Contenedores, layouts                   | Lógica compartida con control de UI        |

Ambos son formas de composición y a menudo se combinan: un componente puede usar `children` para un slot y una prop `renderHeader` para otro.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composición vs. Herencia](04-composicion-vs-herencia.md) | [🏠 Inicio](../index.md) | [Higher-Order Components (HOCs) ▶](06-higher-order-components-hocs.md) |
