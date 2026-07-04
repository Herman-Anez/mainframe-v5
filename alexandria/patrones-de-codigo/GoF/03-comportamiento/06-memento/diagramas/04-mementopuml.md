# memento.puml

## Diagrama genérico del patrón Memento

```plantuml
@startuml
title Memento - Estructura Genérica

class Originator {
    - state
    + createMemento() : Memento
    + setMemento(m : Memento)
}

class Memento {
    - state
    + getState() (opcional)
}

class Caretaker {
    - mementos : List<Memento>
    + addMemento(m : Memento)
    + getMemento() : Memento
}

Originator ..> Memento : crea
Caretaker o--> Memento : almacena
Caretaker --> Originator : pide restaurar
@enduml
```

## Diagrama del ejemplo del editor de texto

```plantuml
@startuml
title Memento - Ejemplo Editor de Texto

class TextEditor {
    - content : StringBuilder
    + write(text : String)
    + getContent() : String
    + createMemento() : TextEditorMemento
    + restoreFromMemento(m : TextEditorMemento)
}

class TextEditorMemento {
    - savedContent : String
    - getSavedContent() : String
}

class History {
    - mementos : Stack<TextEditorMemento>
    + save(editor : TextEditor)
    + undo(editor : TextEditor) : boolean
}

TextEditor ..> TextEditorMemento : crea
History o--> TextEditorMemento : almacena
History --> TextEditor : solicita restaurar
@enduml
```

¿Pasamos a **Observer**?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Memento](../01-memento.md) | [🏠 Inicio](../../../index.md) | [Memento java ▶](../ejemplos/02-memento-java.md) |
