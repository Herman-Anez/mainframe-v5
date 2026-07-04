# Iterator

## 1. Nombre y clasificación
- **Nombre**: Iterator (Iterador, también conocido como *Cursor*)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Proveer una forma de acceder secuencialmente a los elementos de un objeto agregado (colección) sin exponer su representación interna.** El iterador encapsula el recorrido, permitiendo que el cliente procese los elementos uno a uno sin conocer si se trata de una lista, un árbol, una tabla hash u otra estructura.

## 3. Motivación
Una aplicación debe recorrer los elementos de distintas colecciones: listas enlazadas, arrays, árboles binarios, conjuntos. Si cada colección expone sus métodos internos de recorrido (índices, punteros, nodos), el código cliente se acopla a la estructura concreta de cada una. Cambiar una lista por un árbol obligaría a modificar todo el código que la recorre.

El patrón Iterator define una interfaz común (`Iterator`) con operaciones como `hasNext()` y `next()`. Cada colección concreta proporciona su propio iterador, que implementa esa interfaz y conoce los detalles de la estructura interna. El cliente trabaja exclusivamente con la interfaz `Iterator`, desacoplando el recorrido de la colección concreta. Además, se pueden tener múltiples iteradores simultáneos sobre la misma colección sin interferencias.

## 4. Aplicabilidad
Usa Iterator para:
- Acceder a los elementos de un objeto agregado sin exponer su representación interna.
- Soportar múltiples recorridos simultáneos sobre la misma colección.
- Proporcionar una interfaz uniforme para recorrer diferentes estructuras (polimorfismo de iteradores).
- Permitir variar el algoritmo de recorrido (preorden, postorden, etc.) independientemente de la colección.

Nota: En los lenguajes modernos, este patrón está integrado en las bibliotecas estándar (Java `java.util.Iterator`, C# `IEnumerator`, Python `__iter__`). Normalmente no se implementa manualmente, pero entender su estructura es fundamental.

## 5. Estructura
```
┌─────────────┐         ┌──────────────────────┐
│   Client    │         │      Iterator        │ (interfaz)
└─────────────┘         ├──────────────────────┤
      │                 │ + first()            │
      │                 │ + next()             │
      │                 │ + isDone()           │
      │                 │ + currentItem()      │
      │                 └──────────────────────┘
      │                              △
      │                              │
      │                 ┌────────────┴────────────┐
      │                 │                         │
      │           ConcreteIterator          (otro ConcreteIterator)
      │           - aggregate : Aggregate
      │           + next(), etc.
      │
      ▼
┌─────────────────┐
│    Aggregate    │ (interfaz)
├─────────────────┤
│ + createIterator() : Iterator
└─────────────────┘
         △
         │
┌─────────────────┐
│ ConcreteAggregate│
├─────────────────┤
│ + createIterator() : Iterator
└─────────────────┘
```

- **Iterator**: Interfaz que declara las operaciones para recorrer la colección.
- **ConcreteIterator**: Implementa el recorrido para un `ConcreteAggregate` específico. Mantiene la posición actual.
- **Aggregate**: Interfaz de la colección que declara un método para crear un iterador.
- **ConcreteAggregate**: Implementa la colección y devuelve una instancia del `ConcreteIterator` adecuado.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-iteratorpuml.md).

## 6. Participantes
- **Iterator** (`Iterator`): Define la interfaz para acceder y recorrer los elementos.
- **ConcreteIterator** (`ListIterator`, `TreeIterator`): Implementa la interfaz `Iterator` y mantiene el estado del recorrido (índice, nodo actual, pila para árboles, etc.).
- **Aggregate** (`Collection`): Define una interfaz para crear un iterador.
- **ConcreteAggregate** (`List`, `BinaryTree`): Implementa la interfaz de creación del iterador para devolver un `ConcreteIterator` específico.

## 7. Colaboraciones
- El cliente solicita un iterador al agregado mediante `createIterator()`.
- El cliente usa el iterador para recorrer los elementos sin conocer la estructura interna del agregado.
- El `ConcreteIterator` mantiene la referencia a la colección y la posición actual del recorrido. Cuando se pide `next()`, avanza y devuelve el elemento correspondiente.

## 8. Consecuencias
**Ventajas:**
- **Oculta la representación interna**: La colección no necesita exponer sus detalles (array, lista enlazada, árbol).
- **Soporta variación en el recorrido**: Se pueden definir distintos iteradores para la misma colección (recorrido hacia adelante, hacia atrás, filtrado, etc.) sin modificar la colección.
- **Recorridos simultáneos**: Múltiples iteradores pueden coexistir sobre la misma colección sin interferir.
- **Interfaz uniforme**: El cliente trata todas las colecciones igual mediante la interfaz `Iterator` (polimorfismo).

**Desventajas:**
- **Sobrecarga de clases**: Añade nuevas clases (iteradores) al sistema.
- **Acoplamiento entre iterador y colección**: El iterador concreto suele estar acoplado a la implementación concreta de la colección (necesita conocer su estructura interna). En lenguajes que permiten clases anidadas (Java), esta relación es más íntima pero se encapsula en el mismo archivo.
- **En la práctica, el patrón está integrado** en la mayoría de lenguajes (`for-each` en Java, `for...in` en Python) y los programadores rara vez escriben sus propios iteradores desde cero, a menos que necesiten comportamientos muy personalizados.

## 9. Implementación
**a) Iterador externo vs interno**
- **Externo**: El cliente controla el avance llamando explícitamente a `next()` y verificando `hasNext()`. Es el enfoque clásico del patrón.
- **Interno**: El cliente pasa una operación (callback, función) al iterador, que se la aplica a cada elemento. Es común en lenguajes funcionales o con soporte de lambdas (por ejemplo, `forEach` en Java, `map`/`filter` en Python). El control del bucle reside dentro del iterador.

**b) Definición de la interfaz del iterador**
Mínimamente: `first()`, `next()`, `isDone()`, `currentItem()`. En Java: `hasNext()`, `next()`, y opcionalmente `remove()`. En C#: `MoveNext()`, `Current`, `Reset()`. En Python: `__iter__` y `__next__`.

**c) Seguridad frente a modificaciones concurrentes**
Si la colección es modificada mientras un iterador la recorre, puede quedar en un estado inconsistente. Muchas implementaciones lanzan una excepción (`ConcurrentModificationException`) si se detecta una modificación no controlada. Esto se puede implementar guardando un contador de versiones en el agregado y verificándolo en cada operación del iterador.

**d) Iteradores nulos**
Cuando no hay elementos, `next()` debe comportarse de manera predecible (lanzar `NoSuchElementException`, devolver `null`, o devolver un valor centinela). La interfaz debe documentarlo.

**e) Iteradores robustos y filtrados**
Se pueden crear iteradores que apliquen filtros (solo números pares) o transformaciones sin modificar la colección original, a menudo como decoradores sobre otro iterador.

**f) Iteradores en lenguajes modernos**
- **Java**: `Iterable<T>` con método `iterator()` que devuelve `Iterator<T>`. El bucle for-each (`for (T item : collection)`) usa implícitamente el iterador.
- **Python**: El protocolo de iteración: `__iter__()` devuelve un iterador; `__next__()` obtiene el siguiente elemento. Los generadores simplifican la creación de iteradores.
- **C++**: Los iteradores son un concepto central de la STL, con categorías (forward, bidirectional, random access) y algoritmos genéricos.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-iterator-java.md) y [Python](ejemplos/03-iterator-python.md).)

## 11. Usos conocidos
- **Java Collections Framework**: Toda colección implementa `Iterable` y devuelve un `Iterator`. Los bucles `for-each` se basan en ello.
- **C++ STL**: Los contenedores exponen iteradores (`begin()`, `end()`) que son objetos con punteros inteligentes.
- **Python**: Listas, diccionarios, conjuntos, cadenas son iterables. Los generadores son iteradores muy convenientes.
- **Bases de datos**: `ResultSet` en JDBC actúa como un iterador sobre filas de una consulta.
- **Streams**: `java.util.stream.Stream` es un iterador interno sobre elementos, con operaciones map/filter/reduce.

## 12. Patrones relacionados
- **Composite**: A menudo se usan iteradores para recorrer estructuras Composite (árboles) en diferentes órdenes.
- **Factory Method**: El método `createIterator()` es un Factory Method: cada colección concreta devuelve un iterador específico.
- **Memento**: Puede usarse para capturar el estado de un iterador y restaurarlo más tarde (útil para deshacer cambios en el recorrido).
- **Visitor**: Es una alternativa a Iterator cuando se necesita aplicar una operación a todos los elementos, pero con la capacidad de visitar estructuras complejas de tipo heterogéneo. Iterator solo recorre homogéneamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Interpreter python](../03-interpreter/ejemplos/03-interpreter-python.md) | [🏠 Inicio](../../index.md) | [iterator.puml ▶](diagramas/04-iteratorpuml.md) |
