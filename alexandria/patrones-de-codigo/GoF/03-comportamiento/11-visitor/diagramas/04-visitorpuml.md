# visitor.puml

## Diagrama genérico del patrón Visitor

```plantuml
@startuml
title Visitor - Estructura Genérica

interface Visitor {
    + visitElementA(a : ConcreteElementA)
    + visitElementB(b : ConcreteElementB)
}

class ConcreteVisitor1 implements Visitor {
    + visitElementA(a)
    + visitElementB(b)
}

class ConcreteVisitor2 implements Visitor {
    + visitElementA(a)
    + visitElementB(b)
}

interface Element {
    + accept(v : Visitor)
}

class ConcreteElementA implements Element {
    + accept(v : Visitor)
}

class ConcreteElementB implements Element {
    + accept(v : Visitor)
}

ConcreteElementA : accept(v) llama a v.visitElementA(this)
ConcreteElementB : accept(v) llama a v.visitElementB(this)

Client --> Visitor
Client --> Element
@enduml
```

## Diagrama del ejemplo de expresiones aritméticas

```plantuml
@startuml
title Visitor - Ejemplo Expresiones

interface ExpressionVisitor {
    + visit(number : Number) : R
    + visit(addition : Addition) : R
}

class ExpressionPrinter implements ExpressionVisitor {
    + visit(Number) : String
    + visit(Addition) : String
}

class ExpressionEvaluator implements ExpressionVisitor {
    + visit(Number) : Integer
    + visit(Addition) : Integer
}

interface Expression {
    + accept(visitor : ExpressionVisitor) : R
}

class Number implements Expression {
    - value : int
    + accept(visitor) : R
}

class Addition implements Expression {
    - left : Expression
    - right : Expression
    + accept(visitor) : R
}

Number : accept(v) llama a v.visit(this)
Addition : accept(v) llama a v.visit(this)
@enduml
```

Con esto se completan los 23 patrones GoF con el mismo nivel de profundidad y extensión.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Visitor](../01-visitor.md) | [🏠 Inicio](../../../index.md) | [Visitor java ▶](../ejemplos/02-visitor-java.md) |
