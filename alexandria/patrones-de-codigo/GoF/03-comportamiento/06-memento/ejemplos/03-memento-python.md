# Memento python

En Python, la encapsulación estricta es más débil (no hay `private` real), pero podemos simularla usando nombres con doble guión bajo (`__`) para hacer los atributos inaccesibles desde fuera de la clase. El cuidador, por convención, no accederá a los detalles.

```python
# ---------- Originator ----------
class TextEditor:
    def __init__(self):
        self._content = ""

    def write(self, text: str) -> None:
        self._content += text

    @property
    def content(self) -> str:
        return self._content

    def create_memento(self) -> 'TextEditorMemento':
        return TextEditorMemento(self._content)

    def restore_from_memento(self, memento: 'TextEditorMemento') -> None:
        self._content = memento.saved_content  # acceso dentro de la clase amiga

# ---------- Memento ----------
class TextEditorMemento:
    def __init__(self, content: str):
        self.__saved_content = content  # atributo "privado"

    @property
    def saved_content(self) -> str:
        return self.__saved_content

    # No hay setter público; solo el originator puede acceder
    # pero Python no impide realmente el acceso, aunque por convención no se hace.

# ---------- Caretaker ----------
class History:
    def __init__(self):
        self._mementos = []

    def save(self, editor: TextEditor) -> None:
        self._mementos.append(editor.create_memento())

    def undo(self, editor: TextEditor) -> bool:
        if self._mementos:
            memento = self._mementos.pop()
            editor.restore_from_memento(memento)
            return True
        return False

# ---------- Cliente ----------
if __name__ == "__main__":
    editor = TextEditor()
    history = History()

    editor.write("Hola ")
    history.save(editor)

    editor.write("Mundo ")
    history.save(editor)

    editor.write("!")
    print(f"Actual: {editor.content}")  # Hola Mundo !

    history.undo(editor)
    print(f"Después de undo 1: {editor.content}")  # Hola Mundo 

    history.undo(editor)
    print(f"Después de undo 2: {editor.content}")  # Hola 

    history.undo(editor)
    print(f"Deshacer adicional: {history.undo(editor)}")  # False
```

**Nota sobre encapsulación en Python:**
El doble guión bajo `__saved_content` activa el *name mangling*; realmente se puede acceder con `_TextEditorMemento__saved_content`, pero la convención es no hacerlo. El cuidador `History` no manipula el memento, y el originador accede a través del property `saved_content` que está pensado como semi-privado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Memento java](02-memento-java.md) | [🏠 Inicio](../../../index.md) | [Observer ▶](../../07-observer/01-observer.md) |
