# Memento java

## Ejemplo: Editor de texto con deshacer

Implementaremos un editor simple que guarda el contenido en mementos cada vez que se escribe algo. Un cuidador mantiene una pila de mementos para deshacer.

```java
import java.util.Stack;

// ---------- Memento (clase interna privada para encapsular) ----------
// Lo definiremos como clase interna del Originator para máxima opacidad

// ---------- Originator ----------
class TextEditor {
    private StringBuilder content = new StringBuilder();

    public void write(String text) {
        content.append(text);
    }

    public String getContent() {
        return content.toString();
    }

    // Crear memento con el estado actual
    public TextEditorMemento createMemento() {
        return new TextEditorMemento(content.toString());
    }

    // Restaurar desde un memento
    public void restoreFromMemento(TextEditorMemento memento) {
        content = new StringBuilder(memento.getSavedContent());
    }

    // ---------- Memento (clase interna estática) ----------
    public static class TextEditorMemento {
        private final String savedContent;

        private TextEditorMemento(String content) {
            this.savedContent = content;
        }

        // Método privado accesible solo por el originador (está en la misma clase)
        private String getSavedContent() {
            return savedContent;
        }
    }
}

// ---------- Caretaker (Historial) ----------
class History {
    private Stack<TextEditor.TextEditorMemento> mementos = new Stack<>();

    public void save(TextEditor editor) {
        mementos.push(editor.createMemento());
    }

    public boolean undo(TextEditor editor) {
        if (!mementos.isEmpty()) {
            TextEditor.TextEditorMemento memento = mementos.pop();
            editor.restoreFromMemento(memento);
            return true;
        }
        return false;
    }
}

// ---------- Cliente ----------
public class MementoDemo {
    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        History history = new History();

        editor.write("Hola ");
        history.save(editor);  // estado: "Hola "

        editor.write("Mundo ");
        history.save(editor);  // estado: "Hola Mundo "

        editor.write("!");
        System.out.println("Actual: " + editor.getContent()); // "Hola Mundo !"

        // Deshacer una vez
        history.undo(editor);
        System.out.println("Después de undo 1: " + editor.getContent()); // "Hola Mundo "

        // Deshacer otra vez
        history.undo(editor);
        System.out.println("Después de undo 2: " + editor.getContent()); // "Hola "

        // Intentar deshacer otra vez (no hay más mementos)
        boolean result = history.undo(editor);
        System.out.println("Deshacer adicional: " + result); // false
    }
}
```

**Salida esperada:**
```
Actual: Hola Mundo !
Después de undo 1: Hola Mundo 
Después de undo 2: Hola 
Deshacer adicional: false
```

La clase `TextEditorMemento` es `public static` pero sus métodos de acceso son privados; solo `TextEditor` puede leer el contenido. El cuidador `History` nunca examina el memento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ memento.puml](../diagramas/04-mementopuml.md) | [🏠 Inicio](../../../index.md) | [Memento python ▶](03-memento-python.md) |
