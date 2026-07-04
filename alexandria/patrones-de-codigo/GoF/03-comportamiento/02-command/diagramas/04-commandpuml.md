# command.puml

## Diagrama genérico del patrón Command

```plantuml
@startuml
title Command - Estructura Genérica

interface Command {
    + execute()
    + undo()
}

class ConcreteCommand implements Command {
    - receiver : Receiver
    - state
    + execute()
    + undo()
}

class Invoker {
    - command : Command
    + setCommand(Command)
    + invoke()
}

class Receiver {
    + action()
}

class Client {
}

ConcreteCommand --> Receiver : delega
Invoker --> Command : usa
Client --> Receiver
Client --> ConcreteCommand : crea
Client --> Invoker : configura
@enduml
```

## Diagrama del ejemplo del control remoto

```plantuml
@startuml
title Command - Ejemplo Control Remoto

interface Command {
    + execute()
    + undo()
}

class LightOnCommand implements Command {
    - light : Light
    + execute()
    + undo()
}

class LightOffCommand implements Command {
    - light : Light
    + execute()
    + undo()
}

class MacroCommand implements Command {
    - commands : List<Command>
    + execute()
    + undo()
}

class RemoteControl {
    - lastCommand : Command
    + pressButton(Command)
    + pressUndo()
}

class Light {
    - isOn : boolean
    + turnOn()
    + turnOff()
}

LightOnCommand --> Light
LightOffCommand --> Light
MacroCommand o-- Command
RemoteControl --> Command
@enduml
```

¿Continuamos con **Interpreter**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Command](../01-command.md) | [🏠 Inicio](../../../index.md) | [Command java ▶](../ejemplos/02-command-java.md) |
