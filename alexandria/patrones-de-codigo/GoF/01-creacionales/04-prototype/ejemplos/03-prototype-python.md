# Prototype python

En Python, la clonación se implementa típicamente usando el módulo `copy` con `copy.copy()` (superficial) o `copy.deepcopy()` (profunda). También se puede definir un método `clone()` explícito.

```python
import copy
from abc import ABC, abstractmethod

# ---------- Prototype (interfaz) ----------
class Shape(ABC):
    @abstractmethod
    def clone(self) -> 'Shape':
        pass

    @abstractmethod
    def draw(self) -> None:
        pass

# ---------- ConcretePrototype 1 ----------
class Circle(Shape):
    def __init__(self, color: str, radius: int):
        self.color = color
        self.radius = radius

    # Método clone usando deepcopy (seguro para estructuras anidadas)
    def clone(self) -> 'Circle':
        return copy.deepcopy(self)

    def draw(self):
        print(f"Dibujando círculo [{self.color}] radio={self.radius}")

    def set_color(self, color: str):
        self.color = color

    def set_radius(self, radius: int):
        self.radius = radius

# ---------- ConcretePrototype 2 ----------
class Rectangle(Shape):
    def __init__(self, color: str, width: int, height: int):
        self.color = color
        self.width = width
        self.height = height

    def clone(self) -> 'Rectangle':
        return copy.deepcopy(self)

    def draw(self):
        print(f"Dibujando rectángulo [{self.color}] {self.width}x{self.height}")

    def set_color(self, color: str):
        self.color = color

    def set_width(self, width: int):
        self.width = width

    def set_height(self, height: int):
        self.height = height

# ---------- Prototype Manager ----------
class ShapeRegistry:
    def __init__(self):
        self._prototypes = {}
        # Cargar prototipos por defecto
        self._prototypes["circle-red"] = Circle("red", 50)
        self._prototypes["rectangle-blue"] = Rectangle("blue", 100, 60)

    def add_prototype(self, key: str, shape: Shape):
        self._prototypes[key] = shape

    def get_clone(self, key: str) -> Shape:
        prototype = self._prototypes.get(key)
        if not prototype:
            raise KeyError(f"Prototipo no encontrado: {key}")
        return prototype.clone()

# ---------- Cliente ----------
if __name__ == "__main__":
    registry = ShapeRegistry()

    circle1 = registry.get_clone("circle-red")
    circle1.draw()

    circle2 = registry.get_clone("circle-red")
    circle2.set_color("green")
    circle2.set_radius(80)
    circle2.draw()

    rect1 = registry.get_clone("rectangle-blue")
    rect1.draw()

    # El prototipo original no se modifica
    circle1.draw()  # sigue siendo rojo, radio=50
```

**Variante Pythonica ligera (sin Registry formal)**

En muchos scripts, basta con tener un diccionario con los prototipos y usar `copy.deepcopy` directamente:

```python
import copy

prototypes = {
    "circle-red": Circle("red", 50),
    "rectangle-blue": Rectangle("blue", 100, 60),
}

new_shape = copy.deepcopy(prototypes["circle-red"])
new_shape.set_color("yellow")
new_shape.draw()
```

Python simplifica enormemente la implementación gracias a `copy.deepcopy`, que maneja automáticamente estructuras anidadas y referencias circulares (con ciertas limitaciones). Sin embargo, para objetos con recursos externos (archivos, sockets) se debe implementar `__deepcopy__` para controlar el proceso.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Prototype java](02-prototype-java.md) | [🏠 Inicio](../../../index.md) | [Singleton ▶](../../05-singleton/01-singleton.md) |
