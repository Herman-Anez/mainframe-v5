# bridge.puml

## Diagrama genérico del patrón Bridge

```plantuml
@startuml
title Bridge - Estructura Genérica

abstract class Abstraction {
    - impl : Implementor
    + operation()
}

class RefinedAbstraction extends Abstraction {
    + operation()
}

interface Implementor {
    + operationImpl()
}

class ConcreteImplementorA implements Implementor {
    + operationImpl()
}

class ConcreteImplementorB implements Implementor {
    + operationImpl()
}

Abstraction o-- Implementor : puente
note left of Abstraction : operation() llama a impl.operationImpl()
@enduml
```

## Diagrama del ejemplo Formas y Renderizadores

```plantuml
@startuml
title Bridge - Ejemplo Formas

abstract class Shape {
    - renderer : Renderer
    + draw()
}

class Circle extends Shape {
    - radius : double
    + draw()
    + resize(factor : double)
}

class Square extends Shape {
    - side : double
    + draw()
}

interface Renderer {
    + renderCircle(radius : double)
    + renderRectangle(width : double, height : double)
}

class VectorRenderer implements Renderer {
    + renderCircle(radius : double)
    + renderRectangle(width : double, height : double)
}

class RasterRenderer implements Renderer {
    + renderCircle(radius : double)
    + renderRectangle(width : double, height : double)
}

Shape o-- Renderer : <<puente>>
@enduml
```

¿Seguimos con **Composite**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bridge](../01-bridge.md) | [🏠 Inicio](../../../index.md) | [Bridge java ▶](../ejemplos/02-bridge-java.md) |
