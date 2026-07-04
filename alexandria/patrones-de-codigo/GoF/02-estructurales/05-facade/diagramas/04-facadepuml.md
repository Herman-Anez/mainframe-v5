# facade.puml

## Diagrama genérico del patrón Facade

```plantuml
@startuml
title Facade - Estructura Genérica

class Facade {
    + operation()
}

class SubsystemClassA {
    + opA()
}

class SubsystemClassB {
    + opB()
}

class SubsystemClassC {
    + opC()
}

class Client {
}

Client --> Facade
Facade --> SubsystemClassA
Facade --> SubsystemClassB
Facade --> SubsystemClassC
@enduml
```

## Diagrama del ejemplo del compilador

```plantuml
@startuml
title Facade - Ejemplo Compilador

class Compiler {
    - lexer : Lexer
    - parser : Parser
    - codeGenerator : CodeGenerator
    - linker : Linker
    + compile(source : String) : String
}

class Lexer {
    + tokenize(source : String)
}

class Parser {
    + parse(tokens : String)
}

class CodeGenerator {
    + generateCode(parseTree : String) : String
}

class Linker {
    + link(objectCode : String) : String
}

class Client {
}

Client --> Compiler
Compiler --> Lexer
Compiler --> Parser
Compiler --> CodeGenerator
Compiler --> Linker
@enduml
```

¿Pasamos ahora a **Flyweight**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Facade](../01-facade.md) | [🏠 Inicio](../../../index.md) | [Facade java ▶](../ejemplos/02-facade-java.md) |
