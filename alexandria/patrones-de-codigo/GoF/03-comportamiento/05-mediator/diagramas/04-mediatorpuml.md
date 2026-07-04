# mediator.puml

## Diagrama genérico del patrón Mediator

```plantuml
@startuml
title Mediator - Estructura Genérica

interface Mediator {
    + notify(sender : Colleague, event : String)
}

class ConcreteMediator implements Mediator {
    - colleague1 : Colleague
    - colleague2 : Colleague
    + notify(sender, event)
}

abstract class Colleague {
    - mediator : Mediator
    + setMediator(Mediator)
    + send(event : String)
    + receive(event : String)
}

class ConcreteColleague1 extends Colleague {
    + send(event)
    + receive(event)
}

class ConcreteColleague2 extends Colleague {
    + send(event)
    + receive(event)
}

ConcreteMediator --> Colleague : coordina
Colleague --> Mediator : notifica
@enduml
```

## Diagrama del ejemplo del chat

```plantuml
@startuml
title Mediator - Ejemplo Chat Room

interface ChatMediator {
    + sendMessage(message : String, sender : User)
    + addUser(user : User)
}

class ChatRoom implements ChatMediator {
    - users : List<User>
    + sendMessage(message, sender)
    + addUser(user)
}

abstract class User {
    - mediator : ChatMediator
    - name : String
    + send(message : String)
    + receive(message : String)
}

class ChatUser extends User {
    + send(message)
    + receive(message)
}

ChatRoom --> User : coordina
User --> ChatMediator : notifica
@enduml
```

¿Continuamos con **Memento**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mediator](../01-mediator.md) | [🏠 Inicio](../../../index.md) | [Mediator java ▶](../ejemplos/02-mediator-java.md) |
