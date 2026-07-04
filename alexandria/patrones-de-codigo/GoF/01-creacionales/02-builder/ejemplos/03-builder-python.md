# Builder python

Python permite implementaciones muy flexibles. Mostraremos las mismas variantes.

### Variante 1: Fluent Builder sin Director

```python
class Pizza:
    def __init__(self, builder: 'PizzaBuilder'):
        self.dough = builder.dough
        self.sauce = builder.sauce
        self.cheese = builder.cheese
        self.pepperoni = builder.pepperoni
        self.mushrooms = builder.mushrooms
        self.bacon = builder.bacon

    def __str__(self):
        return (f"Pizza [dough={self.dough}, sauce={self.sauce}, "
                f"cheese={self.cheese}, pepperoni={self.pepperoni}, "
                f"mushrooms={self.mushrooms}, bacon={self.bacon}]")


class PizzaBuilder:
    def __init__(self):
        self.dough = "thin"
        self.sauce = "tomato"
        self.cheese = False
        self.pepperoni = False
        self.mushrooms = False
        self.bacon = False

    def with_dough(self, dough: str) -> 'PizzaBuilder':
        self.dough = dough
        return self

    def with_sauce(self, sauce: str) -> 'PizzaBuilder':
        self.sauce = sauce
        return self

    def add_cheese(self) -> 'PizzaBuilder':
        self.cheese = True
        return self

    def add_pepperoni(self) -> 'PizzaBuilder':
        self.pepperoni = True
        return self

    def add_mushrooms(self) -> 'PizzaBuilder':
        self.mushrooms = True
        return self

    def add_bacon(self) -> 'PizzaBuilder':
        self.bacon = True
        return self

    def build(self) -> Pizza:
        if not self.cheese and not self.pepperoni:
            raise ValueError("La pizza debe tener al menos queso o pepperoni")
        return Pizza(self)


# Uso
if __name__ == "__main__":
    pizza = (PizzaBuilder()
             .with_dough("thick")
             .with_sauce("barbecue")
             .add_cheese()
             .add_pepperoni()
             .add_bacon()
             .build())
    print(pizza)
```

### Variante 2: Con Director

```python
from abc import ABC, abstractmethod

# Builder abstracto
class PizzaBuilder(ABC):
    @abstractmethod
    def set_dough(self, dough: str) -> None:
        pass

    @abstractmethod
    def set_sauce(self, sauce: str) -> None:
        pass

    @abstractmethod
    def add_cheese(self) -> None:
        pass

    @abstractmethod
    def add_pepperoni(self) -> None:
        pass

    @abstractmethod
    def add_mushrooms(self) -> None:
        pass

    @abstractmethod
    def add_bacon(self) -> None:
        pass

    @abstractmethod
    def get_pizza(self) -> Pizza:
        pass


class ItalianPizzaBuilder(PizzaBuilder):
    def __init__(self):
        self._builder = PizzaBuilderImpl()  # reutiliza el fluent builder

    def set_dough(self, dough: str):
        self._builder.with_dough(dough)

    def set_sauce(self, sauce: str):
        self._builder.with_sauce(sauce)

    def add_cheese(self):
        self._builder.add_cheese()

    def add_pepperoni(self):
        self._builder.add_pepperoni()

    def add_mushrooms(self):
        self._builder.add_mushrooms()

    def add_bacon(self):
        self._builder.add_bacon()

    def get_pizza(self) -> Pizza:
        return self._builder.build()

# Director
class ChefDirector:
    def make_chef_special(self, builder: PizzaBuilder) -> Pizza:
        builder.set_dough("thin")
        builder.set_sauce("tomato")
        builder.add_cheese()
        builder.add_pepperoni()
        builder.add_mushrooms()
        return builder.get_pizza()

# Uso
if __name__ == "__main__":
    chef = ChefDirector()
    builder = ItalianPizzaBuilder()
    pizza = chef.make_chef_special(builder)
    print("Chef's special:", pizza)
```

> [!NOTE]
> **Nota**: En Python se podría simplificar pasando parámetros con nombre o usando `dataclasses` con método `build()`, pero el patrón Builder es útil cuando hay lógica de construcción no trivial o validación intermedia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Builder java](02-builder-java.md) | [🏠 Inicio](../../../index.md) | [Factory method ▶](../../03-factory-method/01-factory-method.md) |
