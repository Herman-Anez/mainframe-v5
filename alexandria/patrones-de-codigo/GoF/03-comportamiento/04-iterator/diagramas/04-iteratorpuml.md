# iterator.puml

## Diagrama genérico del patrón Iterator

```plantuml
@startuml
title Iterator - Estructura Genérica

interface Iterator {
    + first()
    + next()
    + isDone() : boolean
    + currentItem() : Object
}

class ConcreteIterator implements Iterator {
    - aggregate : ConcreteAggregate
    + next()
    + isDone() : boolean
    + currentItem() : Object
}

interface Aggregate {
    + createIterator() : Iterator
}

class ConcreteAggregate implements Aggregate {
    + createIterator() : Iterator
}

ConcreteIterator o-- ConcreteAggregate : recorre
Client --> Iterator
Client --> Aggregate
@enduml
```

## Diagrama del ejemplo de colección de números

```plantuml
@startuml
title Iterator - Ejemplo Colección de Números

interface MyIterator {
    + hasNext() : boolean
    + next() : Object
}

class NumberIterator implements MyIterator {
    - collection : NumberCollection
    - position : int
    + hasNext() : boolean
    + next() : Object
}

interface MyCollection {
    + createIterator() : MyIterator
}

class NumberCollection implements MyCollection {
    - numbers : Integer[]
    - size : int
    + add(number : Integer)
    + get(index : int) : Integer
    + createIterator() : MyIterator
}

NumberIterator o-- NumberCollection
Client --> MyIterator
Client --> MyCollection
@enduml
```

¿Proseguimos con **Mediator**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iterator](../01-iterator.md) | [🏠 Inicio](../../../index.md) | [Iterator java ▶](../ejemplos/02-iterator-java.md) |
