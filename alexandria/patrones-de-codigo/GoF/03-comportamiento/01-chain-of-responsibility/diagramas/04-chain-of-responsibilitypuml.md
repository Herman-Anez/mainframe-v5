# chain-of-responsibility.puml

## Diagrama genérico del patrón

```plantuml
@startuml
title Chain of Responsibility - Estructura Genérica

abstract class Handler {
    - successor : Handler
    + handleRequest()
}

class ConcreteHandler1 extends Handler {
    + handleRequest()
}

class ConcreteHandler2 extends Handler {
    + handleRequest()
}

Handler -> Handler : successor
Client --> Handler : envía petición
@enduml
```

## Diagrama del ejemplo de logging

```plantuml
@startuml
title Chain of Responsibility - Ejemplo Logging

abstract class Logger {
    - nextLogger : Logger
    - level : LogLevel
    + setNext(Logger)
    + logMessage(request : LogRequest)
    # {abstract} write(message : String)
}

class ConsoleLogger extends Logger {
    + write(message : String)
}

class FileLogger extends Logger {
    + write(message : String)
}

class ErrorLogger extends Logger {
    + write(message : String)
}

Logger -> Logger : nextLogger
Client --> Logger : logMessage()
@enduml
```

¿Continuamos con **Command**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Chain of responsibility](../01-chain-of-responsibility.md) | [🏠 Inicio](../../../index.md) | [Chain of responsibility java ▶](../ejemplos/02-chain-of-responsibility-java.md) |
