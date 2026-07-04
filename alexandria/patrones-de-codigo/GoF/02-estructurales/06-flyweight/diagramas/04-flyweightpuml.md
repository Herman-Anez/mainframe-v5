# flyweight.puml

## Diagrama genérico del patrón Flyweight

```plantuml
@startuml
title Flyweight - Estructura Genérica

interface Flyweight {
    + operation(extrinsicState)
}

class ConcreteFlyweight implements Flyweight {
    - intrinsicState
    + operation(extrinsicState)
}

class UnsharedConcreteFlyweight implements Flyweight {
    - allState
    + operation(extrinsicState)
}

class FlyweightFactory {
    - flyweights : Map<key, Flyweight>
    + getFlyweight(key) : Flyweight
}

class Client {
    - extrinsicState
    + operation()
}

FlyweightFactory o--> Flyweight : gestiona
Client --> FlyweightFactory : solicita
Client --> Flyweight : usa
@enduml
```

## Diagrama del ejemplo de caracteres

```plantuml
@startuml
title Flyweight - Ejemplo Caracteres

interface Glyph {
    + draw(x : int, y : int, font : String)
}

class CharacterGlyph implements Glyph {
    - symbol : char
    + draw(x : int, y : int, font : String)
}

class GlyphFactory {
    - glyphs : Map<char, Glyph>
    + getGlyph(character : char) : Glyph
}

class TextEditor {
    - factory : GlyphFactory
    + renderText(text : String, startX : int, startY : int, font : String)
}

GlyphFactory o--> CharacterGlyph : crea/gestiona
TextEditor --> GlyphFactory
TextEditor --> Glyph : usa
@enduml
```

¿Avanzamos con el último estructural, **Proxy**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Flyweight](../01-flyweight.md) | [🏠 Inicio](../../../index.md) | [Flyweight java ▶](../ejemplos/02-flyweight-java.md) |
