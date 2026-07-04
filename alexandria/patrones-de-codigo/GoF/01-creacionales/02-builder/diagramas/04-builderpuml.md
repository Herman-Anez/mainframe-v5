# builder.puml

## Diagrama genérico del patrón Builder (con Director)

```plantuml
@startuml
title Builder - Estructura Genérica

interface Builder {
    + buildPartA()
    + buildPartB()
    + getResult() : Product
}

class ConcreteBuilder implements Builder {
    - product : Product
    + buildPartA()
    + buildPartB()
    + getResult() : Product
}

class Product {
    - parts
}

class Director {
    - builder : Builder
    + construct()
}

Director o-- Builder : usa
ConcreteBuilder ..> Product : crea
Client -> Director : construct()
Client -> Builder : getResult()

note right of Director : El Director invoca los pasos\nen el orden adecuado
@enduml
```

## Diagrama del ejemplo concreto (pizza)

```plantuml
@startuml
title Builder - Ejemplo de Pizza

' Producto
class Pizza {
    - dough : String
    - sauce : String
    - cheese : boolean
    - pepperoni : boolean
    - mushrooms : boolean
    - bacon : boolean
    + toString() : String
}

' Builder abstracto
interface PizzaBuilder {
    + setDough(dough : String)
    + setSauce(sauce : String)
    + addCheese()
    + addPepperoni()
    + addMushrooms()
    + addBacon()
    + getPizza() : Pizza
}

' Builder concreto
class ItalianPizzaBuilder implements PizzaBuilder {
    - builder : Pizza.PizzaBuilder
    + setDough(...)
    + setSauce(...)
    + addCheese()
    + addPepperoni()
    + addMushrooms()
    + addBacon()
    + getPizza() : Pizza
}

' Director
class ChefDirector {
    + buildChefSpecial(builder : PizzaBuilder) : Pizza
}

ChefDirector o-- PizzaBuilder : usa
ItalianPizzaBuilder ..> Pizza : crea

' Nota opcional: uso del cliente
note bottom of ChefDirector : El cliente configura el director\ncon un builder concreto y obtiene la pizza
@enduml
```

Guarda estos archivos en la estructura de carpetas indicada y se podrán visualizar fácilmente con cualquier renderizador PlantUML.

¿Continuamos con `factory-method`?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Builder](../01-builder.md) | [🏠 Inicio](../../../index.md) | [Builder java ▶](../ejemplos/02-builder-java.md) |
