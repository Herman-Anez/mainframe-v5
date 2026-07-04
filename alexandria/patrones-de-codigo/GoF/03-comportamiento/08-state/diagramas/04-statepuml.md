# state.puml

## Diagrama genérico del patrón State

```plantuml
@startuml
title State - Estructura Genérica

class Context {
    - state : State
    + request()
    + setState(State)
}

interface State {
    + handle()
}

class ConcreteStateA implements State {
    + handle()
}

class ConcreteStateB implements State {
    + handle()
}

Context --> State : delega
Context : request() llama a state.handle()
ConcreteStateA --> Context : puede cambiar estado
ConcreteStateB --> Context : puede cambiar estado
@enduml
```

## Diagrama del ejemplo de la máquina expendedora

```plantuml
@startuml
title State - Ejemplo Máquina Expendedora

class VendingMachine {
    - estadoActual : State
    + setEstado(State)
    + insertarMoneda()
    + expulsarMoneda()
    + seleccionarProducto()
    + entregarProducto()
}

interface State {
    + insertarMoneda(VendingMachine)
    + expulsarMoneda(VendingMachine)
    + seleccionarProducto(VendingMachine)
    + entregarProducto(VendingMachine)
}

class SinDinero implements State
class DineroInsertado implements State
class ProductoEntregado implements State
class Agotado implements State

VendingMachine --> State : estadoActual
State <|.. SinDinero
State <|.. DineroInsertado
State <|.. ProductoEntregado
State <|.. Agotado
@enduml
```

¿Continuamos con **Strategy**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ State](../01-state.md) | [🏠 Inicio](../../../index.md) | [State java ▶](../ejemplos/02-state-java.md) |
