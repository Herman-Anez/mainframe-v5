# Iterator python

Python ya tiene el protocolo de iteración nativo. Mostraremos cómo implementar una colección personalizada que sea iterable de dos maneras: usando clases de iterador explícito y usando un generador.

## Ejemplo con clase iterador explícito

```python
# ---------- Iterador concreto ----------
class NumberIterator:
    def __init__(self, collection: 'NumberCollection'):
        self._collection = collection
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index < self._collection.size():
            value = self._collection.get(self._index)
            self._index += 1
            return value
        raise StopIteration

# ---------- Colección (Agregado) ----------
class NumberCollection:
    def __init__(self, capacity: int):
        self._numbers = [None] * capacity
        self._size = 0

    def add(self, number: int) -> None:
        if self._size < len(self._numbers):
            self._numbers[self._size] = number
            self._size += 1

    def size(self) -> int:
        return self._size

    def get(self, index: int) -> int:
        if 0 <= index < self._size:
            return self._numbers[index]
        raise IndexError("Índice fuera de rango")

    def __iter__(self):
        """Retorna un iterador para esta colección."""
        return NumberIterator(self)

# ---------- Cliente ----------
if __name__ == "__main__":
    numbers = NumberCollection(5)
    numbers.add(10)
    numbers.add(20)
    numbers.add(30)

    # Uso explícito del iterador
    it = iter(numbers)
    while True:
        try:
            num = next(it)
            print(num)
        except StopIteration:
            break

    # O bien con for (Python llama a iter() y next() automáticamente)
    for num in numbers:
        print(num)
```

## Ejemplo con generador (más pitónico)

```python
class NumberCollection:
    def __init__(self, capacity):
        self._numbers = []
        self._capacity = capacity

    def add(self, number):
        if len(self._numbers) < self._capacity:
            self._numbers.append(number)

    def __iter__(self):
        """Generador que itera sobre los elementos."""
        for num in self._numbers:
            yield num
```

Con el generador, no necesitamos una clase iterador separada; Python maneja el estado automáticamente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Iterator java](02-iterator-java.md) | [🏠 Inicio](../../../index.md) | [Mediator ▶](../../05-mediator/01-mediator.md) |
