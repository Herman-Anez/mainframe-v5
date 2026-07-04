# composite.puml

## Diagrama genérico del patrón Composite

```plantuml
@startuml
title Composite - Estructura Genérica

abstract class Component {
    + operation()
    + add(Component)
    + remove(Component)
    + getChild(int) : Component
}

class Leaf extends Component {
    + operation()
}

class Composite extends Component {
    - children : List<Component>
    + operation()
    + add(Component)
    + remove(Component)
    + getChild(int) : Component
}

Composite o-- Component : hijos
Client --> Component
@enduml
```

## Diagrama del ejemplo de sistema de archivos

```plantuml
@startuml
title Composite - Ejemplo Sistema de Archivos

interface FileSystemComponent {
    + showDetails()
    + add(FileSystemComponent)
    + remove(FileSystemComponent)
}

class File implements FileSystemComponent {
    - name : String
    - size : int
    + showDetails()
}

class Directory implements FileSystemComponent {
    - name : String
    - children : List<FileSystemComponent>
    + showDetails()
    + add(FileSystemComponent)
    + remove(FileSystemComponent)
}

Directory o-- FileSystemComponent : contiene
Client --> FileSystemComponent
@enduml
```

¿Continuamos con **Decorator**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composite](../01-composite.md) | [🏠 Inicio](../../../index.md) | [Composite java ▶](../ejemplos/02-composite-java.md) |
