# Taxonomia y clasificacion

La taxonomía clásica del GoF clasifica los 23 patrones según dos criterios: **propósito** (qué hace el patrón) y **ámbito** (sobre qué actúa: clases u objetos). Esta clasificación ayuda a encontrar el patrón adecuado durante el diseño.

## 1. Clasificación por propósito

| Propósito       | Descripción |
|-----------------|-------------|
| **Creacionales** | Abstraen el proceso de creación de objetos. Oculten cómo se crean, componen y representan los objetos. Favorecen la independencia del sistema respecto a las clases concretas que se instancian. |
| **Estructurales** | Tratan la composición de clases y objetos para formar estructuras más complejas. Los de *clase* usan herencia para componer interfaces o implementaciones; los de *objeto* usan composición para conseguir flexibilidad en tiempo de ejecución. |
| **De comportamiento** | Se ocupan de la comunicación entre objetos y de cómo se distribuyen las responsabilidades. Caracterizan flujos de control complejos que es difícil seguir en tiempo de ejecución. |

## 2. Clasificación por ámbito

El ámbito distingue si el patrón se aplica principalmente a relaciones estáticas entre clases (herencia) o a relaciones dinámicas entre objetos (composición y delegación).

- **Patrones de clase**: relaciones fijadas en tiempo de compilación mediante herencia. Son menos flexibles pero más fáciles de entender.
  - *Creacionales de clase*: **Factory Method**.
  - *Estructurales de clase*: **Adapter de clase** (requiere herencia múltiple).
  - *Comportamiento de clase*: **Interpreter**, **Template Method**.

- **Patrones de objeto**: relaciones que pueden cambiarse en tiempo de ejecución mediante composición.
  - *Creacionales de objeto*: **Abstract Factory**, **Builder**, **Prototype**, **Singleton**.
  - *Estructurales de objeto*: **Adapter de objeto**, **Bridge**, **Composite**, **Decorator**, **Facade**, **Flyweight**, **Proxy**.
  - *Comportamiento de objeto*: **Chain of Responsibility**, **Command**, **Iterator**, **Mediator**, **Memento**, **Observer**, **State**, **Strategy**, **Visitor**.

Esta distinción es importante porque los patrones de objeto tienden a estar más alineados con el principio de “composición sobre herencia”.

## 3. Tabla de clasificación completa (propósito vs ámbito)

|                  | Creacionales       | Estructurales       | Comportamiento                     |
|------------------|---------------------|----------------------|------------------------------------|
| **Clase**        | Factory Method      | Adapter (de clase)   | Interpreter, Template Method       |
| **Objeto**       | Abstract Factory, Builder, Prototype, Singleton | Adapter (de objeto), Bridge, Composite, Decorator, Facade, Flyweight, Proxy | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Visitor |

## 4. Otros ejes de clasificación

Además de la taxonomía GoF, se pueden clasificar los patrones por:

- **Frecuencia de uso y aplicabilidad real**: algunos patrones se han vuelto casi obsoletos por el avance de los lenguajes (Iterator, Observer), otros son ubicuos (Strategy, Decorator, Composite).
- **Relación con principios SOLID**: cada patrón favorece uno o varios principios, lo que ayuda a seleccionar el patrón según el principio que se desee reforzar.
- **Patrones que trabajan juntos**: muchas soluciones del mundo real usan combinaciones (Composite + Visitor, Factory Method + Template Method, Observer + Mediator, Decorator + Strategy).

## 5. Críticas y evolución de la clasificación

La taxonomía GoF fue revolucionaria en 1994 pero tiene limitaciones:
- Algunos patrones son muy similares (State vs Strategy, Decorator vs Proxy); la diferencia reside en la intención, no en la estructura.
- La clasificación no cubre patrones de concurrencia, distribución o arquitectura.
- Hoy en día se habla más de **estilos arquitectónicos** y **patrones de diseño a nivel de sistema** que de patrones de grano fino.

A pesar de ello, el mapa conceptual del GoF sigue siendo la puerta de entrada al pensamiento de diseño orientado a objetos y la base sobre la que se han construido todos los catálogos posteriores.

---

¿Necesitas que profundice en alguno de estos temas aún más, o pasamos a generar el contenido de otra carpeta?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Antipatrones comunes](04-antipatrones-comunes.md) | [🏠 Inicio](../index.md) | [Abstract factory ▶](../01-creacionales/01-abstract-factory/01-abstract-factory.md) |
