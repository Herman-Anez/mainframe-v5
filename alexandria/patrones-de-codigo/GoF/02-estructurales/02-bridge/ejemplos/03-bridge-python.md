# Bridge python

Implementación similar en Python usando ABC.

```python
from abc import ABC, abstractmethod

# ---------- Implementor ----------
class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius: float) -> None:
        pass

    @abstractmethod
    def render_rectangle(self, width: float, height: float) -> None:
        pass

# ---------- ConcreteImplementors ----------
class VectorRenderer(Renderer):
    def render_circle(self, radius: float) -> None:
        print(f"Dibujando círculo vectorial de radio {radius}")

    def render_rectangle(self, width: float, height: float) -> None:
        print(f"Dibujando rectángulo vectorial {width}x{height}")

class RasterRenderer(Renderer):
    def render_circle(self, radius: float) -> None:
        print(f"Dibujando círculo rasterizado (píxeles) de radio {radius}")

    def render_rectangle(self, width: float, height: float) -> None:
        print(f"Dibujando rectángulo rasterizado {width}x{height}")

# ---------- Abstraction ----------
class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self.renderer = renderer

    @abstractmethod
    def draw(self) -> None:
        pass

# ---------- RefinedAbstractions ----------
class Circle(Shape):
    def __init__(self, renderer: Renderer, radius: float):
        super().__init__(renderer)
        self.radius = radius

    def draw(self) -> None:
        self.renderer.render_circle(self.radius)

    def resize(self, factor: float) -> None:
        self.radius *= factor

class Square(Shape):
    def __init__(self, renderer: Renderer, side: float):
        super().__init__(renderer)
        self.side = side

    def draw(self) -> None:
        self.renderer.render_rectangle(self.side, self.side)

# ---------- Cliente ----------
if __name__ == "__main__":
    vector = VectorRenderer()
    raster = RasterRenderer()

    circle_vec = Circle(vector, 5)
    circle_ras = Circle(raster, 5)
    square_vec = Square(vector, 10)

    circle_vec.draw()
    circle_ras.draw()
    square_vec.draw()
```

Con esta separación, añadir una nueva forma (triángulo) o un nuevo renderizador (OpenGL) solo requiere crear una nueva clase sin modificar las existentes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bridge java](02-bridge-java.md) | [🏠 Inicio](../../../index.md) | [Composite ▶](../../03-composite/01-composite.md) |
