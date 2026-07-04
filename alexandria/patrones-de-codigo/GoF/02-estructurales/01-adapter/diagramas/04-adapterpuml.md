# adapter.puml

## Diagrama genérico de Adapter (de objeto)

```plantuml
@startuml
title Adapter (Objeto) - Estructura Genérica

interface Target {
    + request()
}

class Client {
    + operation()
}

class Adapter implements Target {
    - adaptee : Adaptee
    + request()
}

class Adaptee {
    + specificRequest()
}

Client --> Target
Adapter --> Adaptee : delega

note right of Adapter : request() llama a\nadaptee.specificRequest()
@enduml
```

## Diagrama genérico de Adapter (de clase)

```plantuml
@startuml
title Adapter (Clase) - Estructura Genérica

abstract class Target {
    + request()
}

class Adaptee {
    + specificRequest()
}

class Adapter extends Target, Adaptee {
    + request()
}

Client --> Target
note left of Adapter : Herencia múltiple\nrequest() llama a specificRequest()
@enduml
```

## Diagrama del ejemplo concreto (Shape y TextView)

```plantuml
@startuml
title Adapter - Ejemplo Shape y TextView

interface Shape {
    + draw()
    + resize(factor : double)
}

class Circle implements Shape {
    + draw()
    + resize(factor : double)
}

class TextView {
    - text : String
    - x : int
    - y : int
    - width : int
    - height : int
    + renderText()
    + setExtent(w : int, h : int)
}

class TextShape implements Shape {
    - textView : TextView
    + draw()
    + resize(factor : double)
}

TextShape --> TextView : adapta
DrawingEditor --> Shape : usa
@enduml
```

He conservado la referencia al cliente (`DrawingEditor`) que usa la interfaz `Shape`.

Con esto queda cubierto el patrón Adapter en profundidad. ¿Continuamos con el siguiente estructural, **Bridge**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Adapter](../01-adapter.md) | [🏠 Inicio](../../../index.md) | [Adapter java ▶](../ejemplos/02-adapter-java.md) |
