# Factory method python

En Python, el patrón se implementa típicamente con clases abstractas (usando `ABC`) y subclases que sobrescriben el método de fábrica. También se pueden usar funciones sueltas o inyección de callables.

## Ejemplo clásico con herencia

```python
from abc import ABC, abstractmethod

# ---------- Producto abstracto ----------
class Transport(ABC):
    @abstractmethod
    def deliver(self) -> None:
        pass

# ---------- Productos concretos ----------
class Truck(Transport):
    def deliver(self):
        print("Entrega por carretera con un camión.")

class Ship(Transport):
    def deliver(self):
        print("Entrega por mar con un barco.")

# ---------- Creador abstracto ----------
class Logistics(ABC):
    @abstractmethod
    def create_transport(self) -> Transport:
        """Factory Method"""
        pass

    def plan_delivery(self):
        transport = self.create_transport()
        transport.deliver()

# ---------- Creadores concretos ----------
class RoadLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Truck()

class SeaLogistics(Logistics):
    def create_transport(self) -> Transport:
        return Ship()

# ---------- Cliente ----------
if __name__ == "__main__":
    mode = "sea"
    if mode == "road":
        logistics = RoadLogistics()
    elif mode == "sea":
        logistics = SeaLogistics()
    else:
        raise ValueError(f"Modo desconocido: {mode}")

    logistics.plan_delivery()
```

## Variante con Factory Method parametrizado

```python
class FlexibleLogistics:
    def create_transport(self, transport_type: str) -> Transport:
        if transport_type == "truck":
            return Truck()
        elif transport_type == "ship":
            return Ship()
        else:
            raise ValueError(f"Tipo no válido: {transport_type}")

# Uso
logistics = FlexibleLogistics()
truck = logistics.create_transport("truck")
truck.deliver()
```

## Variante funcional: inyectando una función creadora

```python
class FunctionalLogistics:
    def __init__(self, factory_func):
        self._factory_func = factory_func

    def plan_delivery(self):
        transport = self._factory_func()
        transport.deliver()

# Uso
road_logistics = FunctionalLogistics(Truck)
sea_logistics = FunctionalLogistics(Ship)
road_logistics.plan_delivery()
sea_logistics.plan_delivery()
```

En Python, al ser las clases objetos de primera clase, la inyección de la clase directamente (`Truck`) o de una lambda es una forma muy limpia de evitar jerarquías innecesarias.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Factory method java](02-factory-method-java.md) | [🏠 Inicio](../../../index.md) | [Prototype ▶](../../04-prototype/01-prototype.md) |
