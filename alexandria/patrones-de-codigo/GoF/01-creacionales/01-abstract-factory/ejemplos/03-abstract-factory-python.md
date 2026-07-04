# Abstract factory python

Python no tiene interfaces formales en tiempo de ejecución (aunque se pueden usar `ABC`), pero la idea se mantiene con clases abstractas y herencia.

```python
from abc import ABC, abstractmethod

# ---------- Productos abstractos (interfaces) ----------
class Button(ABC):
    @abstractmethod
    def render(self) -> None:
        pass

class Window(ABC):
    @abstractmethod
    def render(self) -> None:
        pass

# ---------- Productos concretos (familia Windows) ----------
class WinButton(Button):
    def render(self):
        print("Renderizando botón estilo Windows.")

class WinWindow(Window):
    def render(self):
        print("Renderizando ventana estilo Windows.")

# ---------- Productos concretos (familia Mac) ----------
class MacButton(Button):
    def render(self):
        print("Renderizando botón estilo Mac.")

class MacWindow(Window):
    def render(self):
        print("Renderizando ventana estilo Mac.")

# ---------- Fábrica abstracta ----------
class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass

    @abstractmethod
    def create_window(self) -> Window:
        pass

# ---------- Fábricas concretas ----------
class WinFactory(GUIFactory):
    def create_button(self) -> Button:
        return WinButton()

    def create_window(self) -> Window:
        return WinWindow()

class MacFactory(GUIFactory):
    def create_button(self) -> Button:
        return MacButton()

    def create_window(self) -> Window:
        return MacWindow()

# ---------- Cliente ----------
class Application:
    def __init__(self, factory: GUIFactory):
        self.button = factory.create_button()
        self.window = factory.create_window()

    def render(self):
        self.button.render()
        self.window.render()

# ---------- Selección de fábrica ----------
def get_factory(platform: str = "windows") -> GUIFactory:
    if platform.lower() == "windows":
        return WinFactory()
    else:
        return MacFactory()

if __name__ == "__main__":
    import sys
    # Simplificación: elegir fábrica según argumento
    platform = sys.argv[1] if len(sys.argv) > 1 else "windows"
    factory = get_factory(platform)
    app = Application(factory)
    app.render()
```

**Variante Pythonica**:
- En Python se podría incluso evitar las clases fábrica concretas y usar un diccionario que mapea nombres de productos a clases, junto con una fábrica genérica. Sin embargo, Abstract Factory formal garantiza el mismo propósito cuando se necesita consistencia de familias. La versión aquí presentada mantiene la estructura clásica.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Abstract factory java](02-abstract-factory-java.md) | [🏠 Inicio](../../../index.md) | [Builder ▶](../../02-builder/01-builder.md) |
