# Programación declarativa en React

## Imperativo vs Declarativo
En la programación imperativa tradicional (jQuery, vanilla JS), tú indicas paso a paso cómo modificar el DOM:
```javascript
const lista = document.getElementById('lista');
lista.innerHTML = '';
for (const item of items) {
  const li = document.createElement('li');
  li.textContent = item;
  lista.appendChild(li);
}
```
Este código asume que sabes el estado actual del DOM y que haces las mutaciones correctas. Si ocurre un error, el DOM queda en un estado inconsistente, difícil de rastrear.

En React, tú **describes el resultado deseado**:
```jsx
function Lista({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```
React se encarga de crear, actualizar o destruir los nodos del DOM para que reflejen esta descripción. No dices "añade este `li`", dices "siempre debe haber un `li` por cada elemento en `items`". Si `items` cambia, React recalcula la diferencia.

## Cómo funciona bajo el capó
Cada componente es una función (o un método `render` en clases) que recibe datos (`props`) y retorna una **descripción ligera de la UI** (elementos React). React toma esas descripciones, construye el Virtual DOM, y luego lo reconcilia con el DOM real.

La magia declarativa se apoya en tres pilares:
1. **Inmutabilidad del estado**: nunca mutas un objeto directamente; creas uno nuevo con los cambios. Esto facilita la detección de cambios (comparación de referencias) y habilita funcionalidades como viaje en el tiempo (*time-travel debugging*).
2. **Funciones puras de renderizado**: el resultado de un componente solo depende de sus `props` y su estado interno. Si el mismo input produce la misma UI, el sistema es predecible.
3. **El algoritmo de reconciliación**: hace viable el enfoque declarativo porque evita reemplazar todo el DOM en cada cambio; solo aplica parches mínimos.

## Ventajas
- **Mantenibilidad**: la UI se lee como un plano de lo que debe mostrarse, no como un conjunto de instrucciones frágiles.
- **Composición**: al ser declarativas, las piezas encajan de forma natural.
- **Testabilidad**: conociendo props y estado, se puede verificar la salida sin necesitar un navegador.
- **Colaboración**: los diseñadores pueden modificar el JSX como si fuera HTML (con cuidado), y los desarrolladores se centran en la lógica.

## El rol de JSX
JSX es la sintaxis que permite escribir esa declaración de manera familiar (parecida a HTML). Pero recuerda: no es HTML, es **syntactic sugar** para `React.createElement`. Esta capa declarativa adicional simplifica la lectura y escritura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Pensando en React](02-pensando-en-react.md) | [🏠 Inicio](../index.md) | [Flujo unidireccional de datos ▶](04-flujo-unidireccional-de-datos.md) |
