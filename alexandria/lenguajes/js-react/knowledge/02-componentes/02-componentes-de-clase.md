# Componentes de clase

Los componentes de clase fueron la forma principal de crear componentes con estado y ciclo de vida desde React 0.13 hasta la llegada de los hooks. Aún se mantienen en bases de código existentes y son completamente compatibles, pero se consideran **legacy** para nuevos desarrollos.

## Estructura
Se definen extendiendo `React.Component` (o `React.PureComponent` para optimización superficial de props/estado) y deben implementar, como mínimo, el método `render()` que devuelve JSX.

```jsx
import React, { Component } from 'react';

class Contador extends Component {
  constructor(props) {
    super(props);
    this.state = { cuenta: 0 };
    // Binding manual de métodos que se pasan como callbacks
    this.incrementar = this.incrementar.bind(this);
  }

  incrementar() {
    this.setState(prevState => ({ cuenta: prevState.cuenta + 1 }));
  }

  render() {
    return (
      <div>
        <p>Cuenta: {this.state.cuenta}</p>
        <button onClick={this.incrementar}>+</button>
      </div>
    );
  }
}
```

## Conceptos clave
- **Estado (`this.state`)**: es un objeto que pertenece a la instancia. Para actualizarlo se usa `this.setState(updater[, callback])`. `setState` es asíncrono en comportamiento; React puede agrupar múltiples llamadas para optimizar. El *updater* puede ser un objeto parcial o una función que recibe el estado previo y las props.
- **Ciclo de vida**: la clase tiene métodos específicos que se invocan en fases:
  - Montaje: `constructor`, `static getDerivedStateFromProps`, `render`, `componentDidMount`.
  - Actualización: `getDerivedStateFromProps`, `shouldComponentUpdate`, `render`, `getSnapshotBeforeUpdate`, `componentDidUpdate`.
  - Desmontaje: `componentWillUnmount`.
  - Manejo de errores: `static getDerivedStateFromError`, `componentDidCatch`.
- **`this` y binding**: en JavaScript, los métodos de clase no ligan `this` automáticamente. Si pasas un método como callback sin bindear (o sin usar arrow functions), `this` será `undefined` o el contexto global. Soluciones:
  - Bind en el constructor: `this.metodo = this.metodo.bind(this)`.
  - Declarar el método como campo de clase con arrow function (sintaxis experimental, pero muy usada en Create React App/TypeScript): `metodo = () => { ... }`.
  - Usar arrow functions en el JSX: `onClick={() => this.metodo()}`, aunque crea una nueva función en cada render.
- **`PureComponent`**: similar a `Component` pero implementa `shouldComponentUpdate` con una comparación superficial de props y estado, evitando renderizados innecesarios. Equivalente a `React.memo` para funciones.

## Limitaciones que motivaron los hooks
- **Lógica dispersa**: un mismo caso de uso (ej. suscribirse a una API y limpiar) requería código en `componentDidMount` y `componentWillUnmount`, separando la lógica por métodos en lugar de agruparla por funcionalidad.
- **Compartir lógica entre componentes** era difícil y llevaba a patrones complejos como HOCs y render props, que podían provocar *wrapper hell* (anidamiento excesivo).
- **El `this`** y el binding manual añadían ruido mental y errores.
- **Dificultad para el compilador** de optimizar, porque las clases son más difíciles de analizar que las funciones.

## Vigencia actual
Aunque no están obsoletos, el equipo de React recomienda usar funciones con hooks para todo nuevo código. Las clases siguen funcionando y no se eliminarán, pero todas las nuevas características (Concurrent Mode, Suspense avanzado, Server Components) se piensan primero para funciones. Los errores boundary aún requieren clase porque no hay hook equivalente; se espera que en el futuro se agregue una API funcional.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componentes funcionales](01-componentes-funcionales.md) | [🏠 Inicio](../index.md) | [Props y PropTypes ▶](03-props-y-proptypes.md) |
