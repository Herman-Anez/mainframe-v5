# proxy.puml

## Diagrama genérico del patrón Proxy

```plantuml
@startuml
title Proxy - Estructura Genérica

interface Subject {
    + request()
}

class RealSubject implements Subject {
    + request()
}

class Proxy implements Subject {
    - realSubject : RealSubject
    + request()
}

Proxy --> RealSubject : delega
Client --> Subject
@enduml
```

## Diagrama del ejemplo de proxy virtual (imagen)

```plantuml
@startuml
title Proxy Virtual - Ejemplo Imagen

interface Image {
    + display()
}

class RealImage implements Image {
    - filename : String
    + display()
}

class ImageProxy implements Image {
    - filename : String
    - realImage : RealImage
    + display()
}

ImageProxy --> RealImage : crea y delega
Client --> Image
@enduml
```

## Diagrama del ejemplo de proxy de protección (documento)

```plantuml
@startuml
title Proxy de Protección - Ejemplo Documento

interface Document {
    + view()
    + edit(content : String)
}

class RealDocument implements Document {
    - content : String
    + view()
    + edit(content : String)
}

class ProtectionProxy implements Document {
    - document : RealDocument
    - userRole : String
    + view()
    + edit(content : String)
}

ProtectionProxy --> RealDocument : controla acceso
Client --> Document
@enduml
```

Con esto completamos el contenido detallado del patrón Proxy y, a su vez, todos los patrones estructurales. ¿Quieres que continuemos con los patrones de comportamiento, empezando por **Chain of Responsibility**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Proxy](../01-proxy.md) | [🏠 Inicio](../../../index.md) | [Proxy java ▶](../ejemplos/02-proxy-java.md) |
