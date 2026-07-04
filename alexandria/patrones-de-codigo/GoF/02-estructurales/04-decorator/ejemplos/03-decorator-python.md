# Decorator python

## Ejemplo: Ventana con decoradores

```python
from abc import ABC, abstractmethod

# ---------- Component ----------
class Window(ABC):
    @abstractmethod
    def draw(self) -> None:
        pass

    @abstractmethod
    def description(self) -> str:
        pass

# ---------- ConcreteComponent ----------
class SimpleWindow(Window):
    def draw(self) -> None:
        print("Dibujando ventana simple")

    def description(self) -> str:
        return "ventana simple"

# ---------- Decorator (abstracto) ----------
class WindowDecorator(Window):
    def __init__(self, window: Window):
        self._window = window

    def draw(self) -> None:
        self._window.draw()

    def description(self) -> str:
        return self._window.description()

# ---------- ConcreteDecorator 1 ----------
class BorderDecorator(WindowDecorator):
    def draw(self) -> None:
        super().draw()
        self._draw_border()

    def _draw_border(self) -> None:
        print("Dibujando borde")

    def description(self) -> str:
        return super().description() + " con borde"

# ---------- ConcreteDecorator 2 ----------
class ScrollDecorator(WindowDecorator):
    def draw(self) -> None:
        super().draw()
        self._draw_scroll()

    def _draw_scroll(self) -> None:
        print("Dibujando barras de desplazamiento")

    def description(self) -> str:
        return super().description() + " con scroll"

# ---------- Cliente ----------
if __name__ == "__main__":
    simple = SimpleWindow()
    simple.draw()
    print("Descripción:", simple.description())

    bordered = BorderDecorator(SimpleWindow())
    bordered.draw()
    print("Descripción:", bordered.description())

    full = ScrollDecorator(BorderDecorator(SimpleWindow()))
    full.draw()
    print("Descripción:", full.description())
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Decorator java](02-decorator-java.md) | [🏠 Inicio](../../../index.md) | [Facade ▶](../../05-facade/01-facade.md) |
