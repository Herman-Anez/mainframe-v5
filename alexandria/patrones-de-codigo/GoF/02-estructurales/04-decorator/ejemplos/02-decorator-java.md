# Decorator java

## Ejemplo: Ventana con decoradores (bordes y barras de desplazamiento)

```java
// ---------- Component ----------
interface Window {
    void draw();
    String getDescription();
}

// ---------- ConcreteComponent ----------
class SimpleWindow implements Window {
    @Override
    public void draw() {
        System.out.println("Dibujando ventana simple");
    }

    @Override
    public String getDescription() {
        return "ventana simple";
    }
}

// ---------- Decorator (abstracto) ----------
abstract class WindowDecorator implements Window {
    protected Window decoratedWindow;

    public WindowDecorator(Window window) {
        this.decoratedWindow = window;
    }

    @Override
    public void draw() {
        decoratedWindow.draw();
    }

    @Override
    public String getDescription() {
        return decoratedWindow.getDescription();
    }
}

// ---------- ConcreteDecorator 1 ----------
class BorderDecorator extends WindowDecorator {
    public BorderDecorator(Window window) {
        super(window);
    }

    @Override
    public void draw() {
        super.draw();
        drawBorder();
    }

    private void drawBorder() {
        System.out.println("Dibujando borde");
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " con borde";
    }
}

// ---------- ConcreteDecorator 2 ----------
class ScrollDecorator extends WindowDecorator {
    public ScrollDecorator(Window window) {
        super(window);
    }

    @Override
    public void draw() {
        super.draw();
        drawScroll();
    }

    private void drawScroll() {
        System.out.println("Dibujando barras de desplazamiento");
    }

    @Override
    public String getDescription() {
        return super.getDescription() + " con scroll";
    }
}

// ---------- Cliente ----------
public class DecoratorDemo {
    public static void main(String[] args) {
        // Ventana simple
        Window simple = new SimpleWindow();
        simple.draw();
        System.out.println("Descripción: " + simple.getDescription());

        // Ventana con borde
        Window bordered = new BorderDecorator(new SimpleWindow());
        bordered.draw();
        System.out.println("Descripción: " + bordered.getDescription());

        // Ventana con borde y scroll (apilando decoradores)
        Window fullFeatured = new ScrollDecorator(new BorderDecorator(new SimpleWindow()));
        fullFeatured.draw();
        System.out.println("Descripción: " + fullFeatured.getDescription());
    }
}
```

**Salida:**
```
Dibujando ventana simple
Descripción: ventana simple
Dibujando ventana simple
Dibujando borde
Descripción: ventana simple con borde
Dibujando ventana simple
Dibujando borde
Dibujando barras de desplazamiento
Descripción: ventana simple con borde con scroll
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ decorator.puml](../diagramas/04-decoratorpuml.md) | [🏠 Inicio](../../../index.md) | [Decorator python ▶](03-decorator-python.md) |
