# Componentes funcionales

Un **componente funcional** es, literalmente, una función de JavaScript que recibe un único argumento (llamado `props` por convención) y retorna un elemento React (JSX). Antes de la llegada de los hooks (React 16.8), estos componentes eran conocidos como *stateless functional components* porque carecían de estado interno y ciclo de vida; se limitaban a recibir props y renderizar. Hoy, gracias a hooks como `useState`, `useEffect` y demás, son capaces de manejar estado, efectos, contexto y cualquier otra capacidad que antes estaba reservada a las clases. De hecho, los componentes funcionales con hooks son la **forma recomendada** por el equipo de React para escribir componentes.

## Anatomía mínima
```jsx
function Saludo(props) {
  return <h1>Hola, {props.nombre}!</h1>;
}

// Con arrow function (común):
const Saludo = ({ nombre }) => <h1>Hola, {nombre}!</h1>;
```

## Propiedades fundamentales
- **Son funciones puras de renderizado**: para un mismo conjunto de `props`, deben devolver el mismo árbol de elementos. Los efectos secundarios (mutaciones, suscripciones, peticiones) se colocan en hooks, no en el cuerpo principal.
- **No tienen `this`**: esto elimina por completo los problemas de binding de métodos que aquejan a las clases. Todo es léxico.
- **Estado con hooks**: `useState` proporciona una variable de estado y su setter. El estado se conserva entre renderizados gracias a la lista enlazada que React mantiene internamente.
- **Ciclo de vida con `useEffect`**: permite sincronizar con sistemas externos, limpiar suscripciones, etc.
- **Pueden ser componentes puros**: envolverlos con `React.memo` evita renderizados innecesarios si las props no cambian (comparación superficial).

## Evolución y por qué se impusieron
Inicialmente, los componentes de clase eran los únicos capaces de tener estado y métodos de ciclo de vida. Los funcionales eran simples funciones de renderizado. Con la llegada de los hooks, los funcionales adquirieron toda la potencia de las clases, pero con una API más simple y composable. Ventajas:
- Menos código boilerplate (sin constructor, `super`, `this`).
- Mejor organización de lógica relacionada (en hooks personalizados) en lugar de esparcirla entre `componentDidMount`, `componentDidUpdate` y `componentWillUnmount`.
- Facilidad de prueba: son funciones puras que reciben props y devuelven JSX; se pueden probar con renderizado y consulta, sin necesidad de instanciar clases.
- Mejor compatibilidad con el future concurrent mode y React Server Components.

## Buenas prácticas
- Nombra el componente con `PascalCase`.
- Desestructura las props en la firma para claridad.
- Extrae lógica en hooks personalizados en lugar de amontonar `useEffect` y `useState` en el cuerpo.
- Si el componente crece, divídelo en subcomponentes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ JSX: Transformación, expresiones y escapado](../01-fundamentos/05-jsx-transformacion-expresiones-y-escapado.md) | [🏠 Inicio](../index.md) | [Componentes de clase ▶](02-componentes-de-clase.md) |
