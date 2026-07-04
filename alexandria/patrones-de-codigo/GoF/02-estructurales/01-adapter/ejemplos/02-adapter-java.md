# Adapter java

Mostraremos el ejemplo del editor gráfico que usa `Shape` como interfaz esperada y `TextView` como clase incompatible. Implementaremos un **Adapter de objeto**.

## Ejemplo: Adapter de objeto para adaptar TextView a Shape

```java
// ---------- Target (interfaz que el cliente espera) ----------
interface Shape {
    void draw();
    void resize(double factor);
}

// ---------- Adaptee (clase incompatible, por ejemplo de librería externa) ----------
class TextView {
    private String text;
    private int x, y;
    private int width, height;

    public TextView(String text, int x, int y, int width, int height) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Métodos específicos de TextView
    public void renderText() {
        System.out.println("Renderizando texto '" + text + "' en (" + x + "," + y + ")");
    }

    public void setExtent(int width, int height) {
        this.width = width;
        this.height = height;
        System.out.println("Redimensionando TextView a " + width + "x" + height);
    }

    public String getText() { return text; }
    public int getX() { return x; }
    public int getY() { return y; }
}

// ---------- Adapter de objeto ----------
class TextShape implements Shape {
    private TextView textView;  // composición: adaptador contiene el Adaptee

    public TextShape(TextView textView) {
        this.textView = textView;
    }

    @Override
    public void draw() {
        // Traducir draw() a la llamada específica de TextView
        textView.renderText();
    }

    @Override
    public void resize(double factor) {
        // Traducir resize() usando métodos de TextView
        // Supongamos que necesitamos calcular nuevas dimensiones
        int newWidth = (int) (textView.getX() * factor); // simplificación
        int newHeight = (int) (textView.getY() * factor);
        textView.setExtent(newWidth, newHeight);
    }
}

// ---------- Cliente (editor gráfico) ----------
public class DrawingEditor {
    public static void main(String[] args) {
        // Cliente usa Shapes, pero queremos insertar un TextView
        TextView externalTextView = new TextView("Hola Mundo", 10, 20, 100, 50);

        // Envolvemos con el adaptador para que se comporte como Shape
        Shape textShape = new TextShape(externalTextView);

        // El cliente trata a textShape como cualquier otra Shape
        textShape.draw();
        textShape.resize(1.5);

        // También podemos tener otras figuras nativas
        Shape circle = new Circle();
        circle.draw();
    }
}

// Clase auxiliar para completar el ejemplo
class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Dibujando círculo.");
    }

    @Override
    public void resize(double factor) {
        System.out.println("Redimensionando círculo por factor " + factor);
    }
}
```

**Nota sobre Adapter de clase en Java:**
Java no permite herencia múltiple de clases, por lo que el Adapter de clase puro es inviable. Si `Target` fuera una interfaz y `Adaptee` una clase, el adaptador podría implementar `Target` y extender `Adaptee` simultáneamente:

```java
class TextShapeClassAdapter extends TextView implements Shape {
    public TextShapeClassAdapter(String text, int x, int y, int w, int h) {
        super(text, x, y, w, h);
    }
    @Override
    public void draw() {
        renderText();
    }
    @Override
    public void resize(double factor) {
        // ...
    }
}
```

Esto funciona porque Java permite extender una clase e implementar múltiples interfaces. Si `Target` fuera una clase abstracta, no sería posible sin herencia múltiple.

## Variante funcional con lambdas (Java 8+)

Si la interfaz `Shape` tuviera un solo método abstracto, se podría adaptar con una lambda:

```java
// Supongamos Shape es @FunctionalInterface
Shape adapted = () -> externalTextView.renderText(); // simplificado
```

Para interfaces con múltiples métodos, la adaptación con lambdas no es directa; el patrón clásico sigue siendo necesario.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ adapter.puml](../diagramas/04-adapterpuml.md) | [🏠 Inicio](../../../index.md) | [Adapter python ▶](03-adapter-python.md) |
