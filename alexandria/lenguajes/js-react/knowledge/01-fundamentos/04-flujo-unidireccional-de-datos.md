# Flujo unidireccional de datos

React impone un flujo de datos **de arriba hacia abajo (unidireccional)**:
- El estado reside en un componente (o en un store externo).
- Los componentes padres pasan datos a sus hijos mediante **props**.
- Los hijos no pueden modificar directamente las props recibidas; para comunicar cambios hacia arriba, el padre les pasa **callbacks**.
- Cuando un callback actualiza el estado del padre, React re-renderiza ese padre y todos sus descendientes afectados (a menos que se apliquen optimizaciones como `React.memo`).

Este modelo se resume en la frase: **"Data down, actions up"**.

## Comparación con enlace bidireccional (two-way binding)
Frameworks como Angular (en su forma clásica) o Vue con `v-model` ofrecen un enlace bidireccional entre la vista y el modelo: un cambio en el input actualiza la variable, y un cambio en la variable actualiza el input. Es cómodo para formularios, pero en aplicaciones grandes puede crear dependencias complejas y ciclos de actualización difíciles de depurar.

React opta por un flujo explícito:
```jsx
function Parent() {
  const [value, setValue] = useState('');

  return <Child value={value} onChange={setValue} />;
}

function Child({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```
El padre posee la fuente de verdad; el hijo es un "tonto" controlado. Esta claridad simplifica el debugging.

## Beneficios del flujo unidireccional
- **Predecibilidad**: puedes seguir la pista de un dato desde su origen hasta su representación visual.
- **Depuración**: herramientas como React DevTools muestran el árbol de componentes con props y estado, y cómo las acciones se propagan.
- **Composición segura**: los componentes no dependen del estado global; son reutilizables porque solo necesitan props.
- **Renderizado eficiente**: React sabe exactamente qué rama del árbol necesita actualizarse cuando un estado cambia (aunque los hijos pueden ser puras funciones que se re-ejecutan, la reconciliación solo toca el DOM necesario).

## Cómo escala
Cuando el estado debe ser compartido por muchos componentes lejanos, se evita el *prop drilling* (pasar props a través de muchos niveles) mediante la **API de Contexto** o librerías de estado global (Redux, Zustand, Jotai). Sin embargo, incluso con estas soluciones, el flujo conceptual sigue siendo unidireccional: el estado "vive" en el proveedor o store, los componentes leen de él (data down) y despachan acciones (actions up) que actualizan el store, lo que provoca que los consumidores se re-rendericen.

En arquitecturas más modernas con React Server Components (RSC), el flujo también es unidireccional: el servidor envía el árbol de componentes serializado al cliente, los componentes cliente pueden tener estado, pero los datos se reciben como props desde el servidor.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Programación declarativa en React](03-programacion-declarativa-en-react.md) | [🏠 Inicio](../index.md) | [JSX: Transformación, expresiones y escapado ▶](05-jsx-transformacion-expresiones-y-escapado.md) |
