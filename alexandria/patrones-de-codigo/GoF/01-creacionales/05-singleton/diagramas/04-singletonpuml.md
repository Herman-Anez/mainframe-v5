# singleton.puml

El diagrama de clases para Singleton es el más simple de todos.

```plantuml
@startuml
title Singleton - Estructura

class Singleton {
  - {static} instance : Singleton
  - Singleton()
  + {static} getInstance() : Singleton
  + operation()
}

note right of Singleton
  Constructor privado
  para impedir new()
end note

Client -> Singleton : getInstance()
Client -> Singleton : operation()
@enduml
```

Si se desea incluir la variante Enum (Java):

```plantuml
@startuml
title Singleton como Enum (Java)

enum AppContext {
  INSTANCE
  - appName : String
  - maxUsers : int
  + getAppName() : String
  + setAppName(name : String)
  + getMaxUsers() : int
}

Client -> AppContext : INSTANCE
@enduml
```

Con esto completamos el contenido detallado del patrón Singleton. ¿Pasamos ahora a los patrones estructurales con **Adapter**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Singleton](../01-singleton.md) | [🏠 Inicio](../../../index.md) | [Singleton java ▶](../ejemplos/02-singleton-java.md) |
