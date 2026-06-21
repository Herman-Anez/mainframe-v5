# Props y PropTypes

## Props
Las **props** (abreviatura de *properties*) son el mecanismo para pasar datos de un componente padre a un hijo. Son un **objeto de solo lectura**; React impone que un componente nunca debe modificar sus propias props. Esta inmutabilidad es la base del flujo unidireccional.

```jsx
// Padre
<Usuario nombre="Ana" edad={30} activo />

// Hijo
function Usuario({ nombre, edad, activo }) {
  return <p>{nombre} tiene {edad} años y está {activo ? 'activo' : 'inactivo'}</p>;
}
```

**Características:**
- Cualquier tipo de valor: strings, números, booleanos, arrays, objetos, funciones (callbacks), elementos JSX e incluso otros componentes.
- Si se omite un prop booleano, su valor es `true` (ej. `<MiComponente activo />` → `activo={true}`).
- La destructuración en la firma del componente es la forma más limpia de acceder a ellas.
- **Props por defecto**: históricamente se usaba `Component.defaultProps` (en clases) o la propiedad `defaultProps` en funciones. Con funciones modernas, los parámetros por defecto de ES6 son suficientes y preferibles:
  ```jsx
  function Saludo({ nombre = 'Invitado' }) { ... }
  ```
- `props.children` es una prop especial que contiene lo que esté entre las etiquetas de apertura y cierre del componente.

## PropTypes
Es una biblioteca (independiente desde React 15.5: `prop-types`) que permite **validación de tipos en tiempo de ejecución** para las props de un componente. Se usa asignando una propiedad `propTypes` al componente.

```jsx
import PropTypes from 'prop-types';

function Tarjeta({ titulo, descripcion, puntuacion, opciones }) { ... }

Tarjeta.propTypes = {
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  puntuacion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  opciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      texto: PropTypes.string,
    })
  ),
  onClick: PropTypes.func,
};
```

**Tipos disponibles:**
- Básicos: `any`, `bool`, `number`, `string`, `func`, `object`, `symbol`, `node` (cualquier cosa renderizable), `element` (un solo elemento React), `instanceOf`, `oneOf`, `oneOfType`, `arrayOf`, `objectOf`, `shape`, `exact`.
- Todos pueden llevar `isRequired`.
- También se pueden definir validadores personalizados.

**Ventajas y uso actual:**
- Útil en modo desarrollo: lanza advertencias en consola si los tipos no coinciden.
- Facilita la documentación viva de la API del componente.
- Con TypeScript, las validaciones de tipos se trasladan a tiempo de compilación, haciendo PropTypes menos necesario. Sin embargo, en proyectos sin TS o para validar datos externos (ej. API responses) puede seguir usándose. En componentes de librería publicados, PropTypes aún es útil para consumidores que no usan TypeScript.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Componentes de clase](02-componentes-de-clase.md) | [🏠 Inicio](../index.md) | [Composición vs. Herencia ▶](04-composicion-vs-herencia.md) |
