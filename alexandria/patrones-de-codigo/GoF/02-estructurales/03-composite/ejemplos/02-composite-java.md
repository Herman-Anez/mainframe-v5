# Composite java

## Ejemplo: Estructura de archivos (Directorios y Archivos)

Modelaremos un sistema de archivos simplificado donde `File` (hoja) y `Directory` (compuesto) implementan la interfaz `FileSystemComponent` con una operación `showDetails()`.

```java
import java.util.ArrayList;
import java.util.List;

// ---------- Component (interfaz común) ----------
interface FileSystemComponent {
    void showDetails();
    default void add(FileSystemComponent component) {
        throw new UnsupportedOperationException("Operación no soportada");
    }
    default void remove(FileSystemComponent component) {
        throw new UnsupportedOperationException("Operación no soportada");
    }
}

// ---------- Leaf (Archivo) ----------
class File implements FileSystemComponent {
    private String name;
    private int size; // en KB

    public File(String name, int size) {
        this.name = name;
        this.size = size;
    }

    @Override
    public void showDetails() {
        System.out.println("Archivo: " + name + " (" + size + " KB)");
    }
}

// ---------- Composite (Directorio) ----------
class Directory implements FileSystemComponent {
    private String name;
    private List<FileSystemComponent> children = new ArrayList<>();

    public Directory(String name) {
        this.name = name;
    }

    @Override
    public void add(FileSystemComponent component) {
        children.add(component);
    }

    @Override
    public void remove(FileSystemComponent component) {
        children.remove(component);
    }

    @Override
    public void showDetails() {
        System.out.println("Directorio: " + name);
        for (FileSystemComponent child : children) {
            child.showDetails();  // recursión
        }
    }
}

// ---------- Cliente ----------
public class FileSystemDemo {
    public static void main(String[] args) {
        // Hojas
        File file1 = new File("documento.txt", 120);
        File file2 = new File("foto.jpg", 2048);
        File file3 = new File("musica.mp3", 5120);

        // Compuestos
        Directory root = new Directory("/");
        Directory home = new Directory("home");
        Directory user = new Directory("usuario");

        // Construir árbol
        root.add(home);
        home.add(user);
        user.add(file1);
        user.add(file2);
        root.add(file3);  // directamente en raíz

        // Cliente usa interfaz común
        root.showDetails();
    }
}
```

**Salida esperada:**
```
Directorio: /
Directorio: home
Directorio: usuario
Archivo: documento.txt (120 KB)
Archivo: foto.jpg (2048 KB)
Archivo: musica.mp3 (5120 KB)
```

**Notas de implementación:**
- Los métodos `add` y `remove` se definen en la interfaz con implementación por defecto que lanza excepción (transparencia). Las hojas no los sobrescriben; el directorio sí.
- Se podría haber optado por seguridad máxima: mover `add`/`remove` solo a `Directory`. El cliente necesitaría hacer `if (component instanceof Directory) ((Directory)component).add(...);`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ composite.puml](../diagramas/04-compositepuml.md) | [🏠 Inicio](../../../index.md) | [Composite python ▶](03-composite-python.md) |
