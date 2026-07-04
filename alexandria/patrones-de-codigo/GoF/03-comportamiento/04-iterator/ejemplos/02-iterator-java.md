# Iterator java

Implementaremos un iterador personalizado para una colección simple de números. Aunque en Java se usaría `Iterator` estándar, mostramos la estructura del patrón para entender sus tripas.

## Ejemplo: Colección de números con iterador propio

```java
// ---------- Iterator (interfaz) ----------
interface MyIterator<T> {
    boolean hasNext();
    T next();
}

// ---------- Aggregate (interfaz) ----------
interface MyCollection<T> {
    MyIterator<T> createIterator();
}

// ---------- ConcreteAggregate ----------
class NumberCollection implements MyCollection<Integer> {
    private Integer[] numbers;
    private int size;

    public NumberCollection(int capacity) {
        numbers = new Integer[capacity];
        size = 0;
    }

    public void add(Integer number) {
        if (size < numbers.length) {
            numbers[size++] = number;
        }
    }

    public int size() {
        return size;
    }

    // Obtener elemento en posición (para el iterador)
    public Integer get(int index) {
        if (index >= 0 && index < size) {
            return numbers[index];
        }
        return null;
    }

    @Override
    public MyIterator<Integer> createIterator() {
        return new NumberIterator(this);
    }
}

// ---------- ConcreteIterator ----------
class NumberIterator implements MyIterator<Integer> {
    private NumberCollection collection;
    private int position;

    public NumberIterator(NumberCollection collection) {
        this.collection = collection;
        this.position = 0;
    }

    @Override
    public boolean hasNext() {
        return position < collection.size();
    }

    @Override
    public Integer next() {
        if (hasNext()) {
            return collection.get(position++);
        }
        return null;
    }
}

// ---------- Cliente ----------
public class IteratorDemo {
    public static void main(String[] args) {
        NumberCollection numbers = new NumberCollection(5);
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        MyIterator<Integer> iterator = numbers.createIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
```

**Salida:**
```
10
20
30
```

## Adaptación a la API estándar de Java

En la práctica, haríamos que `NumberCollection` implemente `Iterable<Integer>` y `NumberIterator` implemente `Iterator<Integer>`, lo que permite usar el bucle for-each. Pero a nivel de aprendizaje, la versión anterior muestra la esencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ iterator.puml](../diagramas/04-iteratorpuml.md) | [🏠 Inicio](../../../index.md) | [Iterator python ▶](03-iterator-python.md) |
