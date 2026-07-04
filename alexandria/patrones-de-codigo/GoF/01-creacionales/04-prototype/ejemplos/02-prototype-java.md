# Prototype java

## Ejemplo: Clonación de formas gráficas desde un registro

Implementaremos una jerarquía de formas con un método `clone()`. Usaremos un `ShapeRegistry` (Prototype Manager) que almacena prototipos y los clona bajo demanda.

```java
// ---------- Prototype (interfaz con clone) ----------
interface Shape extends Cloneable {
    Shape clone();
    void draw();
}

// ---------- ConcretePrototype 1 ----------
class Circle implements Shape {
    private String color;
    private int radius;

    public Circle(String color, int radius) {
        this.color = color;
        this.radius = radius;
    }

    // Constructor de copia (alternativa moderna a clone)
    public Circle(Circle source) {
        this.color = source.color;
        this.radius = source.radius;
    }

    @Override
    public Shape clone() {
        return new Circle(this);
    }

    @Override
    public void draw() {
        System.out.println("Dibujando círculo [" + color + "] radio=" + radius);
    }

    // Setters para modificar la copia
    public void setColor(String color) { this.color = color; }
    public void setRadius(int radius) { this.radius = radius; }
}

// ---------- ConcretePrototype 2 ----------
class Rectangle implements Shape {
    private String color;
    private int width;
    private int height;

    public Rectangle(String color, int width, int height) {
        this.color = color;
        this.width = width;
        this.height = height;
    }

    public Rectangle(Rectangle source) {
        this.color = source.color;
        this.width = source.width;
        this.height = source.height;
    }

    @Override
    public Shape clone() {
        return new Rectangle(this);
    }

    @Override
    public void draw() {
        System.out.println("Dibujando rectángulo [" + color + "] " + width + "x" + height);
    }

    public void setColor(String color) { this.color = color; }
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
}

// ---------- Prototype Manager (Registry) ----------
class ShapeRegistry {
    private Map<String, Shape> prototypes = new HashMap<>();

    public ShapeRegistry() {
        // Cargar prototipos por defecto
        prototypes.put("circle-red", new Circle("red", 50));
        prototypes.put("rectangle-blue", new Rectangle("blue", 100, 60));
    }

    public void addPrototype(String key, Shape shape) {
        prototypes.put(key, shape);
    }

    public Shape getClone(String key) {
        Shape prototype = prototypes.get(key);
        if (prototype == null) {
            throw new IllegalArgumentException("Prototipo no encontrado: " + key);
        }
        return prototype.clone();
    }
}

// ---------- Cliente ----------
public class DrawingApp {
    public static void main(String[] args) {
        ShapeRegistry registry = new ShapeRegistry();

        // Obtener clones y modificarlos
        Shape circle1 = registry.getClone("circle-red");
        circle1.draw();

        Shape circle2 = registry.getClone("circle-red");
        ((Circle) circle2).setColor("green");  // cambiamos color en la copia
        ((Circle) circle2).setRadius(80);
        circle2.draw();

        Shape rect1 = registry.getClone("rectangle-blue");
        rect1.draw();

        // circle1 no se ve afectado por circle2
        circle1.draw();  // sigue siendo rojo, radio=50
    }
}
```

**Notas sobre la implementación:**
- Se usa un **constructor de copia** en lugar del obsoleto `Object.clone()`. Es más seguro y explícito.
- La interfaz `Cloneable` es solo un marcador; aquí se define `clone()` manualmente en la interfaz `Shape` para garantizar el contrato.
- El `ShapeRegistry` centraliza los prototipos; en una aplicación real podría cargarlos desde un archivo de configuración.

**Variante con clonación profunda genérica (serialización)**

Si la estructura interna fuera compleja, se podría usar serialización para evitar escribir constructores de copia manuales:

```java
import java.io.*;

class DeepCloneable implements Serializable {
    @SuppressWarnings("unchecked")
    public <T> T deepClone() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(this);
            ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bais);
            return (T) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException("Error en clonación profunda", e);
        }
    }
}
// Las clases deben implementar Serializable y extender DeepCloneable
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ prototype.puml](../diagramas/04-prototypepuml.md) | [🏠 Inicio](../../../index.md) | [Prototype python ▶](03-prototype-python.md) |
