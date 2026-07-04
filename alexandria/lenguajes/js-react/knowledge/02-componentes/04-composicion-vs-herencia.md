# Composición vs. Herencia

React tiene una postura clara: **la composición es el patrón principal para reutilizar código y componentes; la herencia entre componentes está desaconsejada**. Esta filosofía viene de experiencias previas con frameworks donde las jerarquías de herencia profunda generaban rigidez y fragilidad.

## Composición
La composición consiste en ensamblar componentes hijos dentro de un componente padre, ya sea pasándolos como props o anidándolos en el JSX. React proporciona herramientas para varios escenarios:

1. **Contención** (con `children`): un componente que no conoce de antemano lo que se renderizará en su interior puede declarar `{children}` y el padre decide el contenido.
   ```jsx
   function Panel({ children }) {
     return <div className="panel">{children}</div>;
   }
   // Uso:
   <Panel>
     <h2>Título</h2>
     <p>Contenido dinámico...</p>
   </Panel>
   ```
2. **Especialización**: un componente genérico se personaliza pasándole props concretas. No se crea una subclase que extienda; simplemente se reutiliza con diferentes configuraciones.
   ```jsx
   function Dialogo({ titulo, mensaje }) { ... }
   // "Especializaciones" como componentes que usan Dialogo:
   function DialogoBienvenida() {
     return <Dialogo titulo="Bienvenido" mensaje="Gracias por registrarte" />;
   }
   ```
3. **Slots múltiples**: si un componente necesita varios "huecos", se pueden pasar como props en lugar de `children`. Es común en patrones de diseño de componentes compuestos (compound components).
   ```jsx
   function Layout({ sidebar, main }) {
     return <div className="layout">{sidebar}{main}</div>;
   }
   ```
4. **Composición con renderizado condicional**: combinada con la especialización permite variaciones complejas sin necesidad de herencia.

## ¿Por qué no herencia?
Intentar modelar componentes con herencia (`class Boton extends ComponenteBase`) tiene varios inconvenientes:
- **Acoplamiento fuerte**: la subclase depende de los detalles internos de la superclase; cambios en la base pueden romper todas las subclases.
- **Dificultad de composición**: los comportamientos se rigidizan en una cadena jerárquica; no puedes combinar múltiples aspectos de forma independiente.
- **El patrón de mixins** (usado antes de ES6 en React) introducía colisiones de métodos y dependencias implícitas. React los desaconsejó a favor de HOCs y hooks.
- React está diseñado para que la UI se vea como una función de datos, no como una taxonomía de objetos. La composición es natural en funciones y JSX.

## Ejemplo de lo que NO hacer
```jsx
// No recomendado
class BotonBase extends React.Component { ... }
class BotonPeligro extends BotonBase { ... }  // Mala idea
```
En su lugar, se utiliza una prop `variante` o se crea un componente `Boton` con configuración, o se pasa contenido personalizado.

La composición es el mecanismo universal para extender funcionalidad. Los hooks vienen a reforzar esto al permitir reutilizar **lógica de estado** sin necesidad de componentes contenedores (HOCs/render props), manteniendo la jerarquía de componentes limpia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Props y PropTypes](03-props-y-proptypes.md) | [🏠 Inicio](../index.md) | [Children y Render Props ▶](05-children-y-render-props.md) |
