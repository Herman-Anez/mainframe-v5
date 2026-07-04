# decorator.puml

## Diagrama genérico del patrón Decorator

```plantuml
@startuml
title Decorator - Estructura Genérica

interface Component {
    + operation()
}

class ConcreteComponent implements Component {
    + operation()
}

abstract class Decorator implements Component {
    - component : Component
    + operation()
}

class ConcreteDecoratorA extends Decorator {
    - addedState
    + operation()
}

class ConcreteDecoratorB extends Decorator {
    + operation()
    + addedBehavior()
}

Decorator o-- Component : envuelve
@enduml
```

## Diagrama del ejemplo de ventanas

```plantuml
@startuml
title Decorator - Ejemplo Ventana

interface Window {
    + draw()
    + getDescription() : String
}

class SimpleWindow implements Window {
    + draw()
    + getDescription() : String
}

abstract class WindowDecorator implements Window {
    - decoratedWindow : Window
    + draw()
    + getDescription() : String
}

class BorderDecorator extends WindowDecorator {
    + draw()
    + getDescription() : String
}

class ScrollDecorator extends WindowDecorator {
    + draw()
    + getDescription() : String
}

WindowDecorator o-- Window : envuelve
@enduml
```

¿Continuamos con **Facade**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Decorator](../01-decorator.md) | [🏠 Inicio](../../../index.md) | [Decorator java ▶](../ejemplos/02-decorator-java.md) |
