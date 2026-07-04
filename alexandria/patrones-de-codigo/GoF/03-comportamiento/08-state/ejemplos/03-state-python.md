# State python

```python
from abc import ABC, abstractmethod

# ---------- State ----------
class State(ABC):
    @abstractmethod
    def insertar_moneda(self, maquina: 'VendingMachine') -> None:
        pass

    @abstractmethod
    def expulsar_moneda(self, maquina: 'VendingMachine') -> None:
        pass

    @abstractmethod
    def seleccionar_producto(self, maquina: 'VendingMachine') -> None:
        pass

    @abstractmethod
    def entregar_producto(self, maquina: 'VendingMachine') -> None:
        pass

# ---------- ConcreteStates ----------
class SinDinero(State):
    def insertar_moneda(self, maquina: 'VendingMachine') -> None:
        print("Moneda insertada.")
        maquina.estado = DineroInsertado()

    def expulsar_moneda(self, maquina: 'VendingMachine') -> None:
        print("No hay moneda que expulsar.")

    def seleccionar_producto(self, maquina: 'VendingMachine') -> None:
        print("Primero inserte moneda.")

    def entregar_producto(self, maquina: 'VendingMachine') -> None:
        print("Primero inserte moneda y seleccione producto.")

class DineroInsertado(State):
    def insertar_moneda(self, maquina: 'VendingMachine') -> None:
        print("Ya ha insertado una moneda. Use otra operación.")

    def expulsar_moneda(self, maquina: 'VendingMachine') -> None:
        print("Moneda expulsada.")
        maquina.estado = SinDinero()

    def seleccionar_producto(self, maquina: 'VendingMachine') -> None:
        print("Producto seleccionado. Entregando...")
        maquina.estado = ProductoEntregado()

    def entregar_producto(self, maquina: 'VendingMachine') -> None:
        print("Primero seleccione un producto.")

class ProductoEntregado(State):
    def insertar_moneda(self, maquina: 'VendingMachine') -> None:
        print("Espere, entregando producto.")

    def expulsar_moneda(self, maquina: 'VendingMachine') -> None:
        print("No se puede expulsar moneda durante la entrega.")

    def seleccionar_producto(self, maquina: 'VendingMachine') -> None:
        print("Ya se está entregando un producto.")

    def entregar_producto(self, maquina: 'VendingMachine') -> None:
        print("Producto entregado. Disfrútelo.")
        maquina.estado = SinDinero()

class Agotado(State):
    def insertar_moneda(self, maquina: 'VendingMachine') -> None:
        print("Máquina agotada. Inserte moneda devuelta.")

    def expulsar_moneda(self, maquina: 'VendingMachine') -> None:
        print("No hay moneda insertada.")

    def seleccionar_producto(self, maquina: 'VendingMachine') -> None:
        print("Máquina agotada.")

    def entregar_producto(self, maquina: 'VendingMachine') -> None:
        print("No hay productos.")

# ---------- Context ----------
class VendingMachine:
    def __init__(self):
        self.estado: State = SinDinero()

    def insertar_moneda(self) -> None:
        self.estado.insertar_moneda(self)

    def expulsar_moneda(self) -> None:
        self.estado.expulsar_moneda(self)

    def seleccionar_producto(self) -> None:
        self.estado.seleccionar_producto(self)

    def entregar_producto(self) -> None:
        self.estado.entregar_producto(self)

# ---------- Cliente ----------
if __name__ == "__main__":
    maquina = VendingMachine()

    maquina.insertar_moneda()
    maquina.seleccionar_producto()
    maquina.entregar_producto()

    print("---")
    maquina.insertar_moneda()
    maquina.expulsar_moneda()

    print("---")
    maquina.seleccionar_producto()
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ State java](02-state-java.md) | [🏠 Inicio](../../../index.md) | [Strategy ▶](../../09-strategy/01-strategy.md) |
