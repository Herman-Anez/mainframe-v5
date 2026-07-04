# Bridge java

## Ejemplo: Formas y renderizadores

Implementaremos la abstracción `Shape` y la implementación `Renderer`. Las formas concretas (`Circle`, `Square`) usan un `Renderer` para dibujarse.

```java
// ---------- Implementor (interfaz para el renderizador) ----------
interface Renderer {
    void renderCircle(double radius);
    void renderRectangle(double width, double height);
}

// ---------- ConcreteImplementors ----------
class VectorRenderer implements Renderer {
    @Override
    public void renderCircle(double radius) {
        System.out.println("Dibujando círculo vectorial de radio " + radius);
    }

    @Override
    public void renderRectangle(double width, double height) {
        System.out.println("Dibujando rectángulo vectorial " + width + "x" + height);
    }
}

class RasterRenderer implements Renderer {
    @Override
    public void renderCircle(double radius) {
        System.out.println("Dibujando círculo rasterizado (píxeles) de radio " + radius);
    }

    @Override
    public void renderRectangle(double width, double height) {
        System.out.println("Dibujando rectángulo rasterizado " + width + "x" + height);
    }
}

// ---------- Abstraction ----------
abstract class Shape {
    protected Renderer renderer;  // el puente

    protected Shape(Renderer renderer) {
        this.renderer = renderer;
    }

    public abstract void draw();
}

// ---------- RefinedAbstractions ----------
class Circle extends Shape {
    private double radius;

    public Circle(Renderer renderer, double radius) {
        super(renderer);
        this.radius = radius;
    }

    @Override
    public void draw() {
        renderer.renderCircle(radius);
    }

    public void resize(double factor) {
        radius *= factor;
    }
}

class Square extends Shape {
    private double side;

    public Square(Renderer renderer, double side) {
        super(renderer);
        this.side = side;
    }

    @Override
    public void draw() {
        renderer.renderRectangle(side, side);
    }
}

// ---------- Cliente ----------
public class BridgeDemo {
    public static void main(String[] args) {
        Renderer vector = new VectorRenderer();
        Renderer raster = new RasterRenderer();

        Shape circleVector = new Circle(vector, 5);
        Shape circleRaster = new Circle(raster, 5);
        Shape squareVector = new Square(vector, 10);

        circleVector.draw();
        circleRaster.draw();
        squareVector.draw();
    }
}
```

**Salida esperada:**
```
Dibujando círculo vectorial de radio 5.0
Dibujando círculo rasterizado (píxeles) de radio 5.0
Dibujando rectángulo vectorial 10.0x10.0
```

La abstracción `Shape` no sabe si el renderizado es vectorial o rasterizado; el cliente configura el puente al crear la forma.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ bridge.puml](../diagramas/04-bridgepuml.md) | [🏠 Inicio](../../../index.md) | [Bridge python ▶](03-bridge-python.md) |
