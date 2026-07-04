# Keys y listas

Las `key` son el mecanismo que usa React para identificar de forma única cada elemento de una lista entre renderizados consecutivos. Son fundamentales para la **estabilidad del estado** y el **rendimiento**.

## Por qué el índice del arreglo es una mala key (generalmente)
Cuando usas el índice como key:
```jsx
{items.map((item, index) => <Item key={index} value={item} />)}
```
Si la lista cambia de orden o se inserta/elimina un elemento en el medio, las keys se desplazan. React emparejará el elemento con índice 0 del nuevo árbol con el índice 0 del viejo, aunque el dato haya cambiado. Esto provoca:
- **Re-renderizados innecesarios**: React actualiza el componente existente con nuevas props, lo que puede ser correcto pero ineficiente si lo que quieres es mover el elemento.
- **Pérdida de estado local no controlado**: si `<Item />` tiene estado interno (ej. un input, animaciones) basado en el índice, ese estado se asociará erróneamente al nuevo elemento en esa posición, en lugar de seguir al dato correspondiente.

Ejemplo problemático: una lista de tareas con un checkbox. Si reordenas, el estado "checked" se queda con el índice, no con la tarea.

## La key ideal
- **Única entre hermanos**: no es necesario que sea globalmente única, solo dentro de la lista.
- **Estable**: el mismo dato debe tener la misma key en cada render.
- **Predecible**: derivada del dato (ej. `item.id`).

```jsx
{items.map(item => <Item key={item.id} value={item} />)}
```

## Cuándo sí es aceptable el índice
- La lista es estática (no se reordena, no se añaden/eliminan elementos en el medio).
- Los elementos no tienen estado interno ni referencias al DOM que dependan de la identidad.
- La lista nunca cambiará de tamaño o contenido de manera que el orden importe.

En todo caso, si tienes una fuente de datos que garantiza un identificador único, es siempre preferible.

## Keys y componentes anidados
React solo usa las keys para comparar los hijos directos de un componente. Si tienes un componente que renderiza una lista, la key debe ir en el elemento raíz de esa lista, no dentro de los hijos.

```jsx
function Lista({ items }) {
  return (
    <ul>
      {items.map(item => (
        <Item key={item.id} ... />  // key aquí, en el hijo directo de ul
      ))}
    </ul>
  );
}
```

## Comportamiento con React.memo
Las keys ayudan a `React.memo` a decidir si un elemento cambió. Si la key es la misma y las props no cambiaron, se evita el renderizado del componente hijo. Si la key cambia, el componente se desmonta y monta de nuevo, incluso si las props son idénticas.

## Keys en fragmentos
Para listas de elementos sin envoltura DOM, puedes usar `React.Fragment` con key explícita (con la sintaxis `<React.Fragment key={...}>` o `<>` no acepta key, debes usar la forma larga).

```jsx
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
))}
```

## Errores comunes
- Usar `Math.random()` o `Date.now()` como key: cambiará en cada render, forzando desmontaje/montaje de todos los elementos.
- Olvidar la key completamente: React usa el índice y lanza una advertencia en consola.
- No propagar la key a elementos hijos: la key no forma parte de las props; si necesitas el identificador, pásalo explícitamente como prop.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Algoritmo de Diffing (Reconciliación)](02-algoritmo-de-diffing-reconciliacion.md) | [🏠 Inicio](../index.md) | [Renderizado condicional ▶](04-renderizado-condicional.md) |
