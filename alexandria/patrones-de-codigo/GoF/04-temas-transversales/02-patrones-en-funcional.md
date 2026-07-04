# Patrones en funcional

## 1. Introducción: dos paradigmas, mismos problemas

Los 23 patrones del GoF están concebidos para la programación orientada a objetos, donde el polimorfismo, la herencia y la encapsulación son los mecanismos principales de abstracción. En la programación funcional (FP), las herramientas fundamentales son las funciones puras, la inmutabilidad, las funciones de orden superior, el pattern matching y los tipos algebraicos.

Muchos patrones GoF se vuelven innecesarios o quedan reducidos a simples funciones porque el lenguaje ya los soporta de forma nativa. Otros se adaptan mediante composición de funciones en lugar de composición de objetos. En ningún caso los problemas que los patrones solucionan desaparecen; simplemente se resuelven con diferentes abstracciones.

## 2. Patrones que se vuelven invisibles (absorbidos por el lenguaje)

**Iterator**
- En FP, los iteradores son reemplazados por funciones de orden superior como `map`, `filter`, `fold` (reduce), `take`, `drop`, etc. No se necesita una interfaz `Iterator` separada porque las colecciones son recorridas mediante funciones que reciben una operación a aplicar (iterador interno).
- Ejemplo: `list.map(f).filter(p).reduce(acc, g)` en lugar de `while (iter.hasNext()) { ... }`.
- Las secuencias perezosas (lazy sequences) en Scala, Haskell o Clojure eliminan la necesidad de iteradores explícitos.

**Command**
- Un comando es simplemente una función (o un closure). En lugar de una clase con `execute()`, se pasa una lambda: `() -> doSomething()`.
- El patrón Command se reduce a almacenar y llamar funciones de orden superior. Las colas de comandos se convierten en colas de funciones.

**Strategy**
- Una estrategia es una función que se pasa como parámetro. Ejemplo: `sort(list, compareFunction)`.
- No se necesita una interfaz `Strategy` ni múltiples clases concretas; se usa una función `(A, A) -> Int` o similar.
- La composición de estrategias puede lograrse con `compose` o `andThen`.

**Observer**
- Se reemplaza por programación reactiva funcional (FRP) y streams. Los observables (RxJS, Reactor, `Stream` en Scala) manejan la propagación de cambios de forma declarativa.
- Las señales y los *event streams* son ciudadanos de primera clase.

**Template Method**
- En FP, el esqueleto del algoritmo puede ser una función de orden superior que recibe las funciones de los pasos variables como argumentos.
- Ejemplo: `def processData(read: () => Data, analyze: Data => Report): Report = { ... }`. El "método plantilla" es una función que orquesta otras funciones, eliminando la necesidad de herencia.

**Abstract Factory / Factory Method**
- Las factorías se convierten en simples funciones constructoras. Una función `() -> Product` es un Factory Method.
- Para familias de productos, una función de orden superior que devuelve un registro de funciones constructoras actúa como Abstract Factory.

**Singleton**
- En FP pura no hay estado mutable global. La unicidad se gestiona mediante el entorno o el módulo (un módulo en Haskell/ML es un Singleton natural).
- Cuando se necesita un único valor compartido, se puede pasar como parte del entorno (Reader monad) en lugar de acceder globalmente.

## 3. Patrones que se transforman

**Composite**
- Se modela mediante tipos algebraicos (sum types + pattern matching). En lugar de una interfaz `Component` con `Leaf` y `Composite` como subclases, se define un tipo `Tree a = Leaf a | Node [Tree a]` (Haskell) o `enum Tree { Leaf(i32), Node(Vec<Tree>) }` (Rust).
- Las operaciones sobre el árbol se implementan con funciones recursivas que usan pattern matching en lugar del método `operation()` de cada clase.

**Decorator**
- Los decoradores se transforman en composición de funciones. Decorar una función `f` con otra `g` es simplemente `g(f(x))` o, si se quiere añadir comportamiento antes/después, `wrap(f, before, after)`.
- A nivel de tipos, los *monads* y los *functors* permiten "decorar" valores con contexto adicional (Maybe, Either, Reader).

**Chain of Responsibility**
- Se puede implementar como una composición de funciones parciales. Una función `handler: Request -> Maybe Response` se encadena con otras mediante `orElse`. Si la primera devuelve `None`, se prueba la siguiente.
- En Scala: `handler1.orElse(handler2).orElse(handler3)(request)`.

**State**
- La máquina de estados se representa con tipos algebraicos y funciones de transición puras: `transition: State -> Event -> State`.
- No se necesita un objeto contexto que mute; el estado se pasa explícitamente.

**Memento**
- En FP, como los estados son inmutables, cualquier estado anterior ya es un "memento". Para deshacer, simplemente se vuelve al valor anterior de una lista de estados pasados. El historial es una lista de estados inmutables, no una copia oculta.

**Adapter**
- Sigue siendo necesario cuando se integran librerías con interfaces incompatibles. En FP, el adaptador es una función que traduce de una interfaz a otra: `adapt: (A -> B) -> (C -> D)`.

**Facade**
- Igual que en OOP, es una función o módulo que simplifica el acceso a un conjunto de funciones complejas.

**Bridge**
- Se puede lograr con funciones de orden superior y tipos existenciales, pero la idea de separar abstracción de implementación sigue siendo válida.

**Prototype**
- En FP, al ser los objetos inmutables, no hay clonación. La "copia" es simplemente la misma referencia; para modificar, se crea un nuevo valor con los cambios (structural sharing). El concepto de prototipo se diluye.

**Flyweight**
- La compartición es natural en FP gracias a la inmutabilidad y al structural sharing (persistent data structures). No se necesita un patrón explícito; el runtime puede compartir datos automáticamente.

**Visitor**
- El pattern matching sobre tipos algebraicos es el sustituto directo y más elegante de Visitor. En lugar de crear una clase `Visitor` con un método por tipo, se escribe una función que hace pattern matching sobre las variantes del tipo:
  ```scala
  def evaluate(expr: Expr): Int = expr match {
    case Num(v) => v
    case Add(l, r) => evaluate(l) + evaluate(r)
  }
  ```
- Añadir una nueva operación es añadir una nueva función; añadir un nuevo tipo obliga a modificar todas las funciones (el mismo compromiso que Visitor). La diferencia es que la sintaxis es más concisa y todo el código permanece en un mismo archivo.

**Mediator**
- Se puede implementar con un bus de mensajes funcional o con el patrón *Actor* (Erlang/Elixir, Akka). Los actores reciben mensajes y los procesan, centralizando la coordinación.

## 4. Patrones propios de la programación funcional

La FP ha desarrollado sus propios patrones (a menudo llamados *functional patterns* o *algebraic patterns*):

- **Functor**: Permite aplicar una función a un valor dentro de un contexto (ej. mapear sobre `Option`, `List`). Es como un Decorator genérico.
- **Monad**: Encadena computaciones que producen un contexto (ej. `flatMap` en `Option`, `Either`, `Future`). Sustituye al patrón Command encadenado y al Template Method.
- **Applicative**: Aplica funciones dentro de un contexto a valores dentro de un contexto.
- **Monoid**: Combina valores de un tipo con una operación asociativa y un elemento neutro; útil para agregación (Composite, pero sobre datos inmutables).
- **Lens**: Acceso composable a partes de estructuras inmutables (soluciona el problema del acceso a campos que en OOP se haría con getters/setters).

## 5. Conclusión

Los patrones GoF no desaparecen en la programación funcional, pero su implementación cambia radicalmente. Muchos se vuelven **invisibles** porque el lenguaje los absorbe como funciones de orden superior, pattern matching o módulos. La FP ofrece un conjunto de abstracciones más potente que reduce la necesidad de crear jerarquías de clases y delegación manual. Sin embargo, **el conocimiento de los patrones GoF sigue siendo valioso** porque los problemas de diseño que resuelven (desacoplamiento, extensibilidad, gestión de la complejidad) son universales, y las soluciones funcionales son más fáciles de entender si se conoce el patrón original.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrones y microservicios](01-patrones-y-microservicios.md) | [🏠 Inicio](../index.md) | [Evolucion lenguajes modernos ▶](03-evolucion-lenguajes-modernos.md) |
