# factory-method.puml

## Diagrama genérico del patrón Factory Method

```plantuml
@startuml
title Factory Method - Estructura Genérica

abstract class Creator {
    + someOperation()
    + {abstract} factoryMethod() : Product
}

class ConcreteCreator extends Creator {
    + factoryMethod() : Product
}

interface Product {
}

class ConcreteProduct implements Product {
}

Creator : someOperation() llama a factoryMethod()
ConcreteCreator ..> ConcreteProduct : <<crea>>
Client -> Creator : someOperation()
Client -> Product

@enduml
```

## Diagrama del ejemplo de logística

```plantuml
@startuml
title Factory Method - Ejemplo de Logística

abstract class Logistics {
    + planDelivery()
    + {abstract} createTransport() : Transport
}

class RoadLogistics extends Logistics {
    + createTransport() : Transport
}

class SeaLogistics extends Logistics {
    + createTransport() : Transport
}

interface Transport {
    + deliver() : void
}

class Truck implements Transport {
    + deliver() : void
}

class Ship implements Transport {
    + deliver() : void
}

RoadLogistics ..> Truck : <<crea>>
SeaLogistics ..> Ship : <<crea>>

Logistics : planDelivery() llama a createTransport()\ny luego a transport.deliver()

@enduml
```

Este diagrama UML refleja exactamente el diseño implementado en los ejemplos Java y Python.

¿Proseguimos con **Prototype**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Factory method](../01-factory-method.md) | [🏠 Inicio](../../../index.md) | [Factory method java ▶](../ejemplos/02-factory-method-java.md) |
