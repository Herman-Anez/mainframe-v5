# Proxy java

Mostraremos dos variantes clásicas: el **proxy virtual** (carga diferida de una imagen) y el **proxy de protección** (control de acceso a un documento).

## Ejemplo 1: Proxy virtual (imagen)

```java
// ---------- Subject ----------
interface Image {
    void display();
}

// ---------- RealSubject (costoso de cargar) ----------
class RealImage implements Image {
    private String filename;

    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Cargando imagen desde disco: " + filename);
    }

    @Override
    public void display() {
        System.out.println("Mostrando imagen: " + filename);
    }
}

// ---------- Proxy virtual ----------
class ImageProxy implements Image {
    private String filename;
    private RealImage realImage; // inicialmente null

    public ImageProxy(String filename) {
        this.filename = filename;
    }

    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename); // carga perezosa
        }
        realImage.display();
    }
}

// ---------- Cliente ----------
public class ProxyVirtualDemo {
    public static void main(String[] args) {
        // El cliente usa la interfaz Image, no sabe si es real o proxy
        Image image1 = new ImageProxy("foto1.jpg");
        Image image2 = new ImageProxy("foto2.jpg");

        // La imagen no se carga hasta que se muestra
        System.out.println("--- Primera visualización ---");
        image1.display(); // aquí se carga y se muestra

        System.out.println("--- Segunda visualización ---");
        image1.display(); // ya está cargada, solo muestra
    }
}
```

**Salida esperada:**
```
--- Primera visualización ---
Cargando imagen desde disco: foto1.jpg
Mostrando imagen: foto1.jpg
--- Segunda visualización ---
Mostrando imagen: foto1.jpg
```

## Ejemplo 2: Proxy de protección

```java
// ---------- Subject ----------
interface Document {
    void view();
    void edit(String content);
}

// ---------- RealSubject ----------
class RealDocument implements Document {
    private String content;

    public RealDocument(String content) {
        this.content = content;
    }

    @Override
    public void view() {
        System.out.println("Contenido: " + content);
    }

    @Override
    public void edit(String content) {
        this.content = content;
        System.out.println("Documento editado.");
    }
}

// ---------- Proxy de protección ----------
class ProtectionProxy implements Document {
    private RealDocument document;
    private String userRole;

    public ProtectionProxy(RealDocument document, String userRole) {
        this.document = document;
        this.userRole = userRole;
    }

    @Override
    public void view() {
        // Todos pueden ver
        document.view();
    }

    @Override
    public void edit(String content) {
        if ("ADMIN".equalsIgnoreCase(userRole)) {
            document.edit(content);
        } else {
            System.out.println("ERROR: Acceso denegado. Solo ADMIN puede editar.");
        }
    }
}

// ---------- Cliente ----------
public class ProxyProtectionDemo {
    public static void main(String[] args) {
        RealDocument realDoc = new RealDocument("Informe confidencial");

        // Usuario lector
        Document readerProxy = new ProtectionProxy(realDoc, "USER");
        readerProxy.view();
        readerProxy.edit("Nuevo contenido"); // denegado

        // Usuario administrador
        Document adminProxy = new ProtectionProxy(realDoc, "ADMIN");
        adminProxy.view();
        adminProxy.edit("Contenido actualizado"); // permitido
    }
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ proxy.puml](../diagramas/04-proxypuml.md) | [🏠 Inicio](../../../index.md) | [Proxy python ▶](03-proxy-python.md) |
