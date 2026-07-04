# Historia y gof

## Orígenes: de la arquitectura al software

- **1977-1979**: Christopher Alexander publica *A Pattern Language* y *The Timeless Way of Building*, estableciendo la idea de patrones en el diseño arquitectónico civil.
- **1987**: Ward Cunningham y Kent Beck, influidos por Alexander, comienzan a experimentar con “patrones” para diseño de interfaces de usuario en Smalltalk.
- **1991-1993**: La comunidad de OOPSLA (Object-Oriented Programming, Systems, Languages & Applications) celebra talleres sobre patrones. Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides —los cuatro autores— empiezan a catalogar soluciones recurrentes.
- **1994**: Se publica *Design Patterns: Elements of Reusable Object-Oriented Software* (Addison-Wesley). Los autores pasan a ser conocidos como el **Gang of Four (GoF)**.

## El libro del GoF

- **Contenido**: 23 patrones clasificados en creacionales, estructurales y de comportamiento.
- **Formato**: Cada patrón se documenta con un estándar que luego se convirtió en el modelo *patrón de patrón*: nombre, clasificación, intención, también conocido como, motivación, aplicabilidad, estructura (OMT/UML), participantes, colaboraciones, consecuencias, implementación, código de ejemplo, usos conocidos y patrones relacionados.
- **Impacto**: se convirtió en uno de los libros más influyentes de la ingeniería de software. Introdujo el concepto de “programar contra interfaces”, “composición frente a herencia” y “delegación”.

## Evolución posterior al GoF

- **Patrones de arquitectura empresarial** (Fowler, *Patterns of Enterprise Application Architecture*, 2002): Repository, Unit of Work, MVC, etc.
- **Patrones de integración** (Hohpe, Woolf, *Enterprise Integration Patterns*, 2003): Message Broker, Pipes & Filters, Splitter, Aggregator.
- **Patrones de microservicios** (Richardson, *Microservices Patterns*, 2018): Saga, API Gateway, CQRS, Event Sourcing.
- **Patrones en lenguajes funcionales**: muchos patrones GoF se vuelven innecesarios o quedan absorbidos por características del lenguaje (closures, pattern matching, higher-order functions). Surgieron patrones propios como Monad, Functor, Lenses.

## El contexto histórico del GoF

Los patrones del GoF reflejan el estado de la tecnología a principios de los 90: C++ y Smalltalk dominaban, la herencia era la principal herramienta de reutilización, y no existían genéricos, lambdas ni reflexión avanzada. Hoy muchos de estos patrones están implementados de forma nativa en lenguajes modernos (Observer → eventos, Iterator → `for-of`, Command → funciones de orden superior). Conocer su forma clásica sigue siendo valioso porque:

1. El legado de millones de líneas de código aún los usa.
2. La intención de diseño es independiente de la sintaxis.
3. Entender la esencia permite reconocer cuándo un lenguaje ya los absorbió y cuándo hay que implementarlos manualmente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Que son los patrones](01-que-son-los-patrones.md) | [🏠 Inicio](../index.md) | [Principios solid y patrones ▶](03-principios-solid-y-patrones.md) |
