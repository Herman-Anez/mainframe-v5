# Principios solid y patrones

Los principios SOLID, enunciados por Robert C. Martin, son directrices de diseño que subyacen en la mayoría de los patrones GoF. Conocerlos permite entender *por qué* un patrón funciona y cuándo aplicarlo.

## 1. Single Responsibility Principle (SRP) – Principio de responsabilidad única

> Una clase debe tener una única razón para cambiar.

**Relación con patrones**:
- **Decorator**: añade responsabilidades sin modificar la clase original, evitando que una clase acumule múltiples razones de cambio.
- **Facade**: centraliza el acceso a un subsistema, confinando la responsabilidad de mediación en una clase específica.
- **Observer**: separa la notificación de cambios de la lógica de negocio; el sujeto no conoce cómo reaccionan los observadores.

## 2. Open/Closed Principle (OCP) – Abierto para extensión, cerrado para modificación

> Las entidades de software deben estar abiertas a la extensión pero cerradas a la modificación.

Es el principio más directamente ligado a los patrones.
- **Strategy**: encapsula algoritmos en clases separadas; añadir una nueva estrategia no modifica el contexto ni las estrategias existentes.
- **Template Method**: la estructura del algoritmo es fija (cerrada), pero los pasos se pueden redefinir en subclases (abierto).
- **Visitor**: permite añadir nuevas operaciones sobre una estructura sin modificar los elementos.
- **Abstract Factory** y **Factory Method**: añadir nuevas familias de productos o nuevos productos se logra creando nuevas subclases sin tocar el código cliente.

## 3. Liskov Substitution Principle (LSP) – Principio de sustitución de Liskov

> Los objetos de una subclase deben ser sustituibles por objetos de la superclase sin alterar las propiedades deseables del programa.

**Relación con patrones**:
- **Composite**: Leaf y Composite deben ser intercambiables desde la perspectiva del cliente (ambos implementan `Component`).
- **Decorator**: el decorador envuelve un `Component` y es a su vez un `Component`; el cliente no nota la diferencia.
- **Proxy**: el proxy y el sujeto real comparten la misma interfaz, garantizando sustituibilidad.

El LSP es lo que permite que el código escrito contra interfaces funcione con cualquier implementación concreta.

## 4. Interface Segregation Principle (ISP) – Principio de segregación de interfaz

> Un cliente no debe verse forzado a depender de interfaces que no usa.

**Relación con patrones**:
- **Adapter**: adapta una interfaz ancha y ajena a una interfaz específica que el cliente necesita, ocultando los métodos no usados.
- **Facade**: ofrece una interfaz simplificada de grano grueso, aislando al cliente de las complejidades de un subsistema con muchas interfaces.
- **Command**: la interfaz `Command` suele tener solo `execute()` (y `undo()`), segregada de otros posibles métodos del receptor.

## 5. Dependency Inversion Principle (DIP) – Inversión de dependencias

> Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones. Las abstracciones no deben depender de los detalles, sino al revés.

Este es el principio estructural más importante que promueve el bajo acoplamiento.

**Relación con patrones**:
- **Abstract Factory**: el cliente depende de la interfaz `AbstractFactory`, no de las fábricas concretas.
- **Bridge**: la abstracción y la implementación dependen de la interfaz `Implementor`; ambos lados varían independientemente.
- **Observer**: el sujeto depende de la interfaz `Observer`, no de los observadores concretos.
- **Template Method**: las subclases dependen de las abstracciones definidas por la clase base; el módulo de alto nivel (clase base) no depende de las subclases.

## Otros principios transversales en los patrones GoF

- **Principio de composición sobre herencia** (Favor composition over inheritance): Documentado explícitamente en el libro del GoF; visible en Strategy, Decorator, Bridge, State.
- **Ley de Demeter** (Principio de menor conocimiento): Mediator y Facade ayudan a cumplirla al reducir la interacción directa entre objetos lejanos.
- **Hollywood Principle** (“No nos llames, nosotros te llamamos”): Característico de Template Method y Observer.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Historia y gof](02-historia-y-gof.md) | [🏠 Inicio](../index.md) | [Antipatrones comunes ▶](04-antipatrones-comunes.md) |
