# Composite python

Mismo ejemplo con `File` (hoja) y `Directory` (compuesto). Usaremos `ABC` para la interfaz común y excepciones para las operaciones no soportadas en hojas.

```python
from abc import ABC, abstractmethod

# ---------- Component ----------
class FileSystemComponent(ABC):
    @abstractmethod
    def show_details(self, indent: str = "") -> None:
        pass

    def add(self, component: 'FileSystemComponent') -> None:
        raise NotImplementedError("Operación no soportada")

    def remove(self, component: 'FileSystemComponent') -> None:
        raise NotImplementedError("Operación no soportada")

# ---------- Leaf ----------
class File(FileSystemComponent):
    def __init__(self, name: str, size: int):
        self.name = name
        self.size = size

    def show_details(self, indent: str = "") -> None:
        print(f"{indent}Archivo: {self.name} ({self.size} KB)")

# ---------- Composite ----------
class Directory(FileSystemComponent):
    def __init__(self, name: str):
        self.name = name
        self.children: list[FileSystemComponent] = []

    def add(self, component: FileSystemComponent) -> None:
        self.children.append(component)

    def remove(self, component: FileSystemComponent) -> None:
        self.children.remove(component)

    def show_details(self, indent: str = "") -> None:
        print(f"{indent}Directorio: {self.name}")
        for child in self.children:
            child.show_details(indent + "  ")

# ---------- Cliente ----------
if __name__ == "__main__":
    file1 = File("documento.txt", 120)
    file2 = File("foto.jpg", 2048)
    file3 = File("musica.mp3", 5120)

    root = Directory("/")
    home = Directory("home")
    user = Directory("usuario")

    root.add(home)
    home.add(user)
    user.add(file1)
    user.add(file2)
    root.add(file3)

    root.show_details()
```

**Salida esperada:**
```
Directorio: /
  Directorio: home
    Directorio: usuario
      Archivo: documento.txt (120 KB)
      Archivo: foto.jpg (2048 KB)
  Archivo: musica.mp3 (5120 KB)
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composite java](02-composite-java.md) | [🏠 Inicio](../../../index.md) | [Decorator ▶](../../04-decorator/01-decorator.md) |
