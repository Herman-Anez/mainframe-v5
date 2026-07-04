# Proxy python

Implementación de los mismos dos ejemplos en Python.

## Proxy virtual

```python
from abc import ABC, abstractmethod

# ---------- Subject ----------
class Image(ABC):
    @abstractmethod
    def display(self) -> None:
        pass

# ---------- RealSubject ----------
class RealImage(Image):
    def __init__(self, filename: str):
        self.filename = filename
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        print(f"Cargando imagen desde disco: {self.filename}")

    def display(self) -> None:
        print(f"Mostrando imagen: {self.filename}")

# ---------- Proxy virtual ----------
class ImageProxy(Image):
    def __init__(self, filename: str):
        self.filename = filename
        self._real_image: RealImage | None = None

    def display(self) -> None:
        if self._real_image is None:
            self._real_image = RealImage(self.filename)  # carga perezosa
        self._real_image.display()

# ---------- Cliente ----------
if __name__ == "__main__":
    image1 = ImageProxy("foto1.jpg")
    image2 = ImageProxy("foto2.jpg")

    print("--- Primera visualización ---")
    image1.display()

    print("--- Segunda visualización ---")
    image1.display()
```

## Proxy de protección

```python
from abc import ABC, abstractmethod

# ---------- Subject ----------
class Document(ABC):
    @abstractmethod
    def view(self) -> None:
        pass

    @abstractmethod
    def edit(self, content: str) -> None:
        pass

# ---------- RealSubject ----------
class RealDocument(Document):
    def __init__(self, content: str):
        self._content = content

    def view(self) -> None:
        print(f"Contenido: {self._content}")

    def edit(self, content: str) -> None:
        self._content = content
        print("Documento editado.")

# ---------- Proxy de protección ----------
class ProtectionProxy(Document):
    def __init__(self, document: RealDocument, user_role: str):
        self._document = document
        self._user_role = user_role

    def view(self) -> None:
        self._document.view()

    def edit(self, content: str) -> None:
        if self._user_role.upper() == "ADMIN":
            self._document.edit(content)
        else:
            print("ERROR: Acceso denegado. Solo ADMIN puede editar.")

# ---------- Cliente ----------
if __name__ == "__main__":
    real_doc = RealDocument("Informe confidencial")

    reader = ProtectionProxy(real_doc, "USER")
    reader.view()
    reader.edit("Nuevo")  # denegado

    admin = ProtectionProxy(real_doc, "ADMIN")
    admin.view()
    admin.edit("Actualizado")  # permitido
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Proxy java](02-proxy-java.md) | [🏠 Inicio](../../../index.md) | [Chain of responsibility ▶](../../../03-comportamiento/01-chain-of-responsibility/01-chain-of-responsibility.md) |
