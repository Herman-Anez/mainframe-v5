# Adapter python

Python permite tanto Adapter de objeto como de clase (gracias a la herencia múltiple). Mostramos ambos usando el mismo ejemplo del editor gráfico.

## Adapter de objeto (composición)

```python
from abc import ABC, abstractmethod

# ---------- Target ----------
class Shape(ABC):
    @abstractmethod
    def draw(self) -> None:
        pass

    @abstractmethod
    def resize(self, factor: float) -> None:
        pass

# ---------- Adaptee (clase incompatible) ----------
class TextView:
    def __init__(self, text: str, x: int, y: int, width: int, height: int):
        self.text = text
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def render_text(self):
        print(f"Renderizando texto '{self.text}' en ({self.x},{self.y})")

    def set_extent(self, width: int, height: int):
        self.width = width
        self.height = height
        print(f"Redimensionando TextView a {width}x{height}")

# ---------- Adapter de objeto ----------
class TextShape(Shape):
    def __init__(self, text_view: TextView):
        self._text_view = text_view  # composición

    def draw(self):
        # Traduce draw a la operación de TextView
        self._text_view.render_text()

    def resize(self, factor: float):
        new_w = int(self._text_view.x * factor)  # simplificación
        new_h = int(self._text_view.y * factor)
        self._text_view.set_extent(new_w, new_h)

# ---------- Cliente ----------
class DrawingEditor:
    def render_shape(self, shape: Shape):
        shape.draw()

if __name__ == "__main__":
    text_view = TextView("Hola Python", 10, 20, 100, 50)
    adapted = TextShape(text_view)
    editor = DrawingEditor()
    editor.render_shape(adapted)
    adapted.resize(1.5)
```

## Adapter de clase (herencia múltiple)

```python
class TextShapeClassAdapter(Shape, TextView):
    def __init__(self, text: str, x: int, y: int, width: int, height: int):
        TextView.__init__(self, text, x, y, width, height)

    def draw(self):
        # Hereda render_text() de TextView
        self.render_text()

    def resize(self, factor: float):
        new_w = int(self.x * factor)
        new_h = int(self.y * factor)
        self.set_extent(new_w, new_h)
```

**Uso:**
```python
adapted2 = TextShapeClassAdapter("Hola clase", 0, 0, 200, 100)
adapted2.draw()
adapted2.resize(2.0)
```

**Nota Pythonica:**
Debido al *duck typing*, en muchos casos no es necesario un adaptador formal si la clase ya tiene métodos con el mismo nombre o si se puede cambiar la interfaz esperada. Sin embargo, cuando se integra con código que exige una interfaz específica (por ejemplo, un framework que chequea con `isinstance`), el patrón Adapter proporciona seguridad.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Adapter java](02-adapter-java.md) | [🏠 Inicio](../../../index.md) | [Bridge ▶](../../02-bridge/01-bridge.md) |
