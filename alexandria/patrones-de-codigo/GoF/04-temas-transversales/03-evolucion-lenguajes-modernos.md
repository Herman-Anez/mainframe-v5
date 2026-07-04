# Evolucion lenguajes modernos

## 1. Los patrones como parche a las limitaciones del lenguaje

Peter Norvig, en su célebre ensayo "Design Patterns in Dynamic Languages", demostró que muchos patrones GoF desaparecen o se simplifican en lenguajes con mayor poder expresivo. Los patrones no son verdades eternas; a menudo son **compensaciones por las carencias de los lenguajes de su época** (C++ y Smalltalk a principios de los 90).

Características de los lenguajes modernos que diluyen los patrones GoF:

- **Funciones de primera clase y lambdas** (Java 8+, C# 3.0+, Python, JavaScript, Kotlin, Swift, Rust)
- **Genéricos y tipos parametrizados** (Java 5+, C#, Kotlin, Swift, Rust)
- **Pattern matching** (Scala, Kotlin, Swift, Rust, Haskell)
- **Mixin, traits y herencia múltiple** (Scala, Kotlin, Python, Rust traits)
- **Inyección de dependencias nativa** (Angular, Dagger, Spring, contexto implícito en Scala)
- **Metaprogramación y reflexión** (Python, Ruby, Java reflections)
- **Extension methods** (C#, Kotlin)
- **Data classes y records** (Kotlin data class, Java records, C# records, Scala case class)
- **Programación asíncrona y reactiva** (corrutinas en Kotlin, async/await en Python/JS/C#, streams reactivos)

Analicemos patrón por patrón cómo los lenguajes modernos han absorbido o simplificado su implementación.

## 2. Patrones creacionales

**Singleton**
- Los contenedores de inyección de dependencias (Spring, Guice, Dagger) gestionan el ciclo de vida de los objetos y permiten declarar un bean como `@Singleton` sin necesidad de implementar el patrón manualmente.
- `enum` en Java es una forma segura de implementar Singleton sin código boilerplate.
- En Kotlin, `object` define un Singleton de forma nativa.

**Factory Method / Abstract Factory**
- Las lambdas y referencias a métodos permiten pasar una función constructora como parámetro: `Supplier<Product>` o `() -> Product` en Kotlin/Python.
- La inyección de dependencias hace innecesarias muchas fábricas manuales; el contenedor construye el grafo de objetos.

**Builder**
- Los *named parameters* y *default parameters* (Python, Kotlin, C#) reducen la necesidad de un Builder separado para objetos con muchos parámetros.
- Las *data classes* con `copy()` (Kotlin, Scala) permiten crear copias modificadas sin Builder.
- Los builders siguen siendo útiles para construcciones complejas con validación intermedia, pero los casos simples se simplifican enormemente.

**Prototype**
- La clonación profunda genérica se logra con serialización/deserialización (JSON, Protobuf) o con `copy()` de data classes.
- Los lenguajes con inmutabilidad estructural (Clojure, Scala, Kotlin con `data class`) no necesitan clonación porque comparten estructura.

## 3. Patrones estructurales

**Adapter**
- Los *extension methods* (C#, Kotlin) permiten añadir métodos a una clase existente sin crear un adaptador explícito.
- Las funciones de extensión en Kotlin: `fun TextView.drawBorder() { ... }` actúa como un adaptador transparente.
- El duck typing en Python y los *implicit conversions* en Scala también reducen la necesidad de adaptadores formales.

**Bridge**
- La separación de interfaces y la inyección de dependencias hacen que el Bridge sea un diseño natural, sin necesidad de llamarlo explícitamente patrón.
- Los genéricos permiten tipar el puente sin recurrir a herencia múltiple.

**Composite**
- Los tipos algebraicos y el pattern matching (Scala, Kotlin, Rust) permiten representar árboles de forma más concisa, sin necesidad de una interfaz `Component` con operaciones no aplicables a las hojas.
- Las extension functions permiten añadir operaciones al Composite sin violar OCP.

**Decorator**
- Los *delegates* en Kotlin (`class Decorator(base: Component) : Component by base`) implementan automáticamente la delegación de todos los métodos de la interfaz, eliminando el código boilerplate del decorador.
- Las funciones de orden superior y los closures permiten decorar funciones sin crear clases.

**Facade**
- No cambia; es un concepto arquitectónico más que un patrón dependiente del lenguaje.

**Flyweight**
- La memoria disponible y las estructuras de datos persistentes en lenguajes funcionales hacen que Flyweight sea menos necesario. Sin embargo, en juegos y sistemas de partículas, sigue siendo relevante y se implementa igual.

**Proxy**
- Los *dynamic proxies* (Java `java.lang.reflect.Proxy`, C# `RealProxy`) permiten crear proxies en tiempo de ejecución sin escribir una clase por cada interfaz.
- Los decoradores de funciones (Python) y los interceptores AOP (AspectJ, Spring AOP) permiten añadir comportamiento sin modificar el código original, difuminando la línea entre Proxy y Decorator.

## 4. Patrones de comportamiento

**Chain of Responsibility**
- Las funciones parciales y el encadenamiento con `orElse` (Scala), o las funciones que devuelven `Optional` en Java, permiten encadenar manejadores sin una jerarquía de clases.
- El middleware en frameworks web (Express.js, Ktor) es una implementación nativa de este patrón.

**Command**
- Las lambdas y `Runnable` / `Supplier` / `Function` reemplazan a los objetos comando.
- Las corrutinas y la programación asíncrona permiten ejecutar comandos diferidos sin clases separadas.

**Interpreter**
- Las librerías de parsing combinator (Scala, Haskell) y los DSL internos (Kotlin, Groovy) evitan tener que construir manualmente el árbol sintáctico. El intérprete se convierte en una función de evaluación sobre un AST generado.

**Iterator**
- Los protocolos de iteración nativos (`Iterable` en Java/Kotlin, `__iter__` en Python, `Iterator` trait en Rust) hacen que rara vez se implemente manualmente.
- Los streams y las secuencias (Java Streams, Kotlin Sequences, Python generators) ofrecen iteración perezosa con operaciones funcionales.

**Mediator**
- Los buses de eventos y los frameworks reactivos (EventBus, RxJava, Reactor) proporcionan una implementación nativa del mediador.
- En Android, `ViewModel` y `LiveData` actúan como mediadores entre la UI y el modelo.

**Memento**
- La serialización automática y las data classes con `copy()` permiten guardar y restaurar estados sin necesidad de un Memento explícito.
- Las librerías de undo/redo (como `UndoManager`) encapsulan el patrón.

**Observer**
- Los `Observable`/`Flowable` de RxJava, los `LiveData` de Android, los `PropertyChangeListener` de Java, y los `ObservableObject` de SwiftUI son implementaciones nativas.
- La programación reactiva es la evolución natural del patrón.

**State**
- Las máquinas de estados finitos (FSM) se pueden implementar con *sealed classes* y `when` exhaustivo (Kotlin) o con *enums* y pattern matching.
- Las librerías de state machine (Spring State Machine, Tinder StateMachine) proporcionan implementaciones completas.

**Strategy**
- Las lambdas permiten pasar una estrategia como un parámetro más.
- El patrón se reduce a usar `Function<Input, Output>`.

**Template Method**
- Las funciones de orden superior y los *higher-order functions* reemplazan la herencia. Se pasa una función con la parte variable del algoritmo.
- En Kotlin, se pueden usar *lambdas with receiver* para construir DSLs que son Template Methods.

**Visitor**
- El pattern matching sobre *sealed classes* o *enums* (Java 17+, Kotlin, Scala, Swift) proporciona una alternativa más concisa y segura (el compilador verifica exhaustividad).
- Ejemplo en Java 17:
  ```java
  int result = switch (expression) {
      case Number n -> n.value();
      case Addition a -> evaluate(a.left()) + evaluate(a.right());
  };
  ```

## 5. Conclusión

Los patrones GoF no han muerto, pero han sido **absorbidos, simplificados o automatizados** por los lenguajes modernos. Un diseñador actual debe conocerlos para entender los fundamentos del diseño, pero debe implementarlos con las herramientas del lenguaje que utiliza, que a menudo los reducen a una línea de código. El verdadero valor del conocimiento de los patrones es entender el *problema* que resuelven y las *consecuencias* de su aplicación, no memorizar la estructura de clases.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrones en funcional](02-patrones-en-funcional.md) | [🏠 Inicio](../index.md) | [Combinacion de patrones ▶](04-combinacion-de-patrones.md) |
