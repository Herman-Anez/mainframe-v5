# Algoritmo de Diffing (Reconciliación)

Cuando el estado o las props cambian, React genera un nuevo árbol de elementos. El **algoritmo de reconciliación** (también llamado *diffing*) compara el árbol nuevo con el anterior y decide qué operaciones aplicar al DOM. Su complejidad es **O(n)** gracias a dos heurísticas:

## Heurística 1: Dos elementos de diferente tipo producen árboles diferentes
Si en la misma posición del árbol el `type` cambia (ej. de `<div>` a `<span>`, o de `<Button>` a `<Link>`), React **destruye por completo el árbol antiguo** y monta uno nuevo desde cero.

- Los componentes viejos se desmontan (`componentWillUnmount` / limpieza de efectos).
- El estado interno se pierde.
- Se construye una nueva instancia del componente, se monta y se ejecutan sus efectos iniciales.

```jsx
// Cambio de <div> a <header>: todo el subárbol se reemplaza
{condicion ? <div><Contenido /></div> : <header><Contenido /></header>}
```
Aunque `<Contenido />` sea el mismo, se desmonta y se vuelve a montar porque su ancestro cambió de tipo.

## Heurística 2: Las keys permiten identificar elementos entre hermanos
Cuando React itera sobre una lista de hijos, usa la prop `key` para saber qué elementos se han añadido, eliminado o movido. Sin `key`, React usa el índice como identificador y puede causar comportamientos no deseados (ver siguiente sección).

## Algoritmo paso a paso
1. **Compara el tipo del elemento raíz**:
   - Si son iguales (ej. ambos `<div>`): React conserva el nodo DOM y solo actualiza los atributos que cambiaron (`className`, `style`, etc.). Luego recursa en los hijos.
   - Si son distintos: desmonta el viejo, monta el nuevo. No hay recursión; todo el subárbol se reemplaza.
2. **Comparación de hijos**:
   - React recorre la lista de hijos en paralelo (nuevo y viejo) y aplica las reglas anteriores.
   - Si hay `key`, empareja por `key` en lugar de por índice. Permite detectar inserciones, eliminaciones y reordenamientos sin reemplazar todo.

## Operaciones resultantes
- **Actualizar**: mismo tipo, mismas keys. Se mantiene el nodo DOM, se actualizan props, se continúa con los hijos.
- **Insertar**: un nuevo elemento con una key no vista antes. Se crea un nuevo nodo DOM.
- **Eliminar**: una key existente ya no está en el nuevo árbol. Se destruye el nodo DOM.
- **Mover**: una key cambió de posición. React reordena los nodos DOM en lugar de destruir y crear.

## Reconciliación en componentes de función y hooks
Cuando un componente de función se re-renderiza (mismo tipo, misma posición en el árbol), React llama a la función otra vez, y gracias a la lista de hooks, asocia el estado y los efectos correctos. Por eso la regla del orden de hooks es crucial: React depende de la secuencia de llamadas para enlazar el estado entre renders.

## Implicaciones para el rendimiento
El diffing es rápido porque evita comparar árboles enteros nodo a nodo. Sin embargo, puedes ayudar a React:
- Usa `React.memo` para evitar renderizados de componentes cuando sus props no cambian.
- Proporciona `key` estables y únicas en listas.
- Evita cambiar el tipo de un componente en re-renderizados (ej. definir componentes dentro de otro componente sin memoización).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Virtual DOM](01-virtual-dom.md) | [🏠 Inicio](../index.md) | [Keys y listas ▶](03-keys-y-listas.md) |
