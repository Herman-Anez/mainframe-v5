# Factory method java

## Ejemplo: Logística y transportes

Modelaremos un sistema de logística donde el creador base `Logistics` define un método `createTransport()` abstracto. Las subclases `RoadLogistics` y `SeaLogistics` lo implementan devolviendo camiones o barcos.

```java
// ---------- Producto abstracto ----------
interface Transport {
    void deliver();
}

// ---------- Productos concretos ----------
class Truck implements Transport {
    @Override
    public void deliver() {
        System.out.println("Entrega por carretera con un camión.");
    }
}

class Ship implements Transport {
    @Override
    public void deliver() {
        System.out.println("Entrega por mar con un barco.");
    }
}

// ---------- Creador abstracto ----------
abstract class Logistics {
    // Método de fábrica abstracto
    public abstract Transport createTransport();

    // Lógica de negocio que usa el producto
    public void planDelivery() {
        Transport transport = createTransport();
        // ... operaciones previas ...
        transport.deliver();
    }
}

// ---------- Creadores concretos ----------
class RoadLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Ship();
    }
}

// ---------- Cliente ----------
public class LogisticsApp {
    public static void main(String[] args) {
        Logistics logistics;
        String mode = "sea";  // podría venir de configuración

        if (mode.equals("road")) {
            logistics = new RoadLogistics();
        } else if (mode.equals("sea")) {
            logistics = new SeaLogistics();
        } else {
            throw new IllegalArgumentException("Modo de transporte no soportado");
        }

        logistics.planDelivery();
    }
}
```

**Variante: Factory Method parametrizado (rompe OCP pero reduce subclases)**

```java
class FlexibleLogistics {
    public Transport createTransport(String type) {
        if ("truck".equalsIgnoreCase(type)) {
            return new Truck();
        } else if ("ship".equalsIgnoreCase(type)) {
            return new Ship();
        }
        throw new IllegalArgumentException("Tipo desconocido: " + type);
    }
}
// El cliente usa: new FlexibleLogistics().createTransport("truck");
```

**Variante funcional: usando Supplier (Java 8+)**

```java
import java.util.function.Supplier;

class LogisticsWithSupplier {
    private Supplier<Transport> transportSupplier;

    public LogisticsWithSupplier(Supplier<Transport> supplier) {
        this.transportSupplier = supplier;
    }

    public void planDelivery() {
        Transport transport = transportSupplier.get();
        transport.deliver();
    }
}

// Uso:
public class ModernApp {
    public static void main(String[] args) {
        LogisticsWithSupplier roadLog = new LogisticsWithSupplier(Truck::new);
        roadLog.planDelivery();

        LogisticsWithSupplier seaLog = new LogisticsWithSupplier(Ship::new);
        seaLog.planDelivery();
    }
}
```
Esta última variante elimina la jerarquía de creadores y logra el mismo desacoplamiento, alineándose con el principio "composición sobre herencia".

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ factory-method.puml](../diagramas/04-factory-methodpuml.md) | [🏠 Inicio](../../../index.md) | [Factory method python ▶](03-factory-method-python.md) |
