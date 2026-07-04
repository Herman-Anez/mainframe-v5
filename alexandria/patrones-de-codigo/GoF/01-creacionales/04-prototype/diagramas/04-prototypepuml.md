# prototype.puml

## Diagrama genérico del patrón Prototype

```plantuml
@startuml
title Prototype - Estructura Genérica

interface Prototype {
    + clone() : Prototype
}

class ConcretePrototypeA implements Prototype {
    + clone() : Prototype
}

class ConcretePrototypeB implements Prototype {
    + clone() : Prototype
}

class Client {
    + operation()
}

class PrototypeManager {
    - prototypes : Map<String, Prototype>
    + getClone(key : String) : Prototype
    + addPrototype(key : String, p : Prototype)
}

Client -> PrototypeManager : solicita clon
PrototypeManager o-- Prototype : almacena prototipos
PrototypeManager ..> Prototype : clone()

note right of PrototypeManager : getClone() devuelve\nun clon del prototipo
@enduml
```

## Diagrama del ejemplo de formas gráficas

```plantuml
@startuml
title Prototype - Ejemplo de Formas

interface Shape {
    + clone() : Shape
    + draw() : void
}

class Circle implements Shape {
    - color : String
    - radius : int
    + clone() : Shape
    + draw() : void
}

class Rectangle implements Shape {
    - color : String
    - width : int
    - height : int
    + clone() : Shape
    + draw() : void
}

class ShapeRegistry {
    - prototypes : Map<String, Shape>
    + addPrototype(key : String, shape : Shape)
    + getClone(key : String) : Shape
}

class DrawingApp {
    + main()
}

DrawingApp -> ShapeRegistry : getClone(key)
ShapeRegistry o-- Shape : contiene prototipos
ShapeRegistry ..> Shape : clone()

@enduml
```

¿Continuamos con **Singleton**, el último patrón creacional?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Prototype](../01-prototype.md) | [🏠 Inicio](../../../index.md) | [Prototype java ▶](../ejemplos/02-prototype-java.md) |
