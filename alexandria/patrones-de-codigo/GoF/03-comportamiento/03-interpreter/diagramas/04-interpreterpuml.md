# interpreter.puml

## Diagrama genérico del patrón Interpreter

```plantuml
@startuml
title Interpreter - Estructura Genérica

abstract class AbstractExpression {
    + interpret(Context) : Object
}

class TerminalExpression extends AbstractExpression {
    + interpret(Context) : Object
}

class NonterminalExpression extends AbstractExpression {
    - expressions : List<AbstractExpression>
    + interpret(Context) : Object
}

class Context {
    + lookup(var : String) : Object
    + assign(var : String, value : Object)
}

AbstractExpression <|-- TerminalExpression
AbstractExpression <|-- NonterminalExpression
NonterminalExpression o-- AbstractExpression : contiene
Client --> AbstractExpression
Client --> Context
@enduml
```

## Diagrama del ejemplo de expresiones booleanas

```plantuml
@startuml
title Interpreter - Ejemplo Expresiones Booleanas

interface Expression {
    + interpret(context : Context) : boolean
}

class Constant implements Expression {
    - value : boolean
    + interpret(Context) : boolean
}

class Variable implements Expression {
    - name : String
    + interpret(Context) : boolean
}

class NotExpression implements Expression {
    - expression : Expression
    + interpret(Context) : boolean
}

class AndExpression implements Expression {
    - left : Expression
    - right : Expression
    + interpret(Context) : boolean
}

class OrExpression implements Expression {
    - left : Expression
    - right : Expression
    + interpret(Context) : boolean
}

class Context {
    - variables : Map<String, Boolean>
    + setVariable(name : String, value : boolean)
    + lookup(name : String) : boolean
}

AndExpression o-- Expression : left, right
OrExpression o-- Expression : left, right
NotExpression o-- Expression
Client --> Expression
Client --> Context
@enduml
```

¿Seguimos con **Iterator**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Interpreter](../01-interpreter.md) | [🏠 Inicio](../../../index.md) | [Interpreter java ▶](../ejemplos/02-interpreter-java.md) |
