# Abstract factory java

## Ejemplo: Fábrica de controles GUI multiplataforma

Implementaremos una fábrica abstracta para crear botones y ventanas, con dos familias concretas: estilo Windows y estilo Mac.

```java
// ---------- Productos abstractos ----------
interface Button {
    void render();
}

interface Window {
    void render();
}

// ---------- Productos concretos (familia Windows) ----------
class WinButton implements Button {
    @Override
    public void render() {
        System.out.println("Renderizando botón estilo Windows.");
    }
}

class WinWindow implements Window {
    @Override
    public void render() {
        System.out.println("Renderizando ventana estilo Windows.");
    }
}

// ---------- Productos concretos (familia Mac) ----------
class MacButton implements Button {
    @Override
    public void render() {
        System.out.println("Renderizando botón estilo Mac.");
    }
}

class MacWindow implements Window {
    @Override
    public void render() {
        System.out.println("Renderizando ventana estilo Mac.");
    }
}

// ---------- Fábrica abstracta ----------
interface GUIFactory {
    Button createButton();
    Window createWindow();
}

// ---------- Fábricas concretas ----------
class WinFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WinButton();
    }

    @Override
    public Window createWindow() {
        return new WinWindow();
    }
}

class MacFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacButton();
    }

    @Override
    public Window createWindow() {
        return new MacWindow();
    }
}

// ---------- Cliente ----------
public class Application {
    private Button button;
    private Window window;

    public Application(GUIFactory factory) {
        // El cliente solo depende de la interfaz abstracta
        button = factory.createButton();
        window = factory.createWindow();
    }

    public void render() {
        button.render();
        window.render();
    }

    // Punto de entrada. La elección de la fábrica se hace en función del SO
    public static void main(String[] args) {
        GUIFactory factory;
        String osName = System.getProperty("os.name").toLowerCase();
        if (osName.contains("windows")) {
            factory = new WinFactory();
        } else {
            factory = new MacFactory(); // por defecto, o bien detectar Mac
        }

        Application app = new Application(factory);
        app.render();
    }
}
```

**Características importantes**:
- El código cliente (`Application`) está completamente desacoplado de `WinButton`, `MacWindow`, etc.
- La decisión de la familia concreta se toma en un único punto (`main`), facilitando el cambio.
- Si se añade una nueva familia Linux, se implementa `LinuxFactory`, `LinuxButton`, `LinuxWindow` y se modifica solo el punto de selección. Las clases existentes no se modifican (OCP).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ abstract-factory.puml](../diagramas/04-abstract-factorypuml.md) | [🏠 Inicio](../../../index.md) | [Abstract factory python ▶](03-abstract-factory-python.md) |
