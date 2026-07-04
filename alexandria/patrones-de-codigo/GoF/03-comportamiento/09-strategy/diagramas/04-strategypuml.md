# strategy.puml

## Diagrama genérico del patrón Strategy

```plantuml
@startuml
title Strategy - Estructura Genérica

class Context {
    - strategy : Strategy
    + setStrategy(s : Strategy)
    + executeStrategy()
}

interface Strategy {
    + algorithmInterface()
}

class ConcreteStrategyA implements Strategy {
    + algorithmInterface()
}

class ConcreteStrategyB implements Strategy {
    + algorithmInterface()
}

Context o--> Strategy : delega
@enduml
```

## Diagrama del ejemplo de pagos

```plantuml
@startuml
title Strategy - Ejemplo Métodos de Pago

class ShoppingCart {
    - paymentStrategy : PaymentStrategy
    + setPaymentStrategy(s : PaymentStrategy)
    + checkout(amount : double)
}

interface PaymentStrategy {
    + pay(amount : double)
}

class CreditCardPayment implements PaymentStrategy {
    - cardNumber, expiryDate, cvv
    + pay(amount : double)
}

class PayPalPayment implements PaymentStrategy {
    - email : String
    + pay(amount : double)
}

class BankTransferPayment implements PaymentStrategy {
    - iban : String
    + pay(amount : double)
}

ShoppingCart o--> PaymentStrategy : delega
Client -> ShoppingCart : setPaymentStrategy(...)
@enduml
```

¿Pasamos al siguiente: **Template Method**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strategy](../01-strategy.md) | [🏠 Inicio](../../../index.md) | [Strategy java ▶](../ejemplos/02-strategy-java.md) |
