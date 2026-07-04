# State java

## Ejemplo: Máquina expendedora

Implementaremos una máquina expendedora con cuatro estados: `SinDinero`, `DineroInsertado`, `ProductoEntregado`, `Agotado`. El contexto `VendingMachine` delega las operaciones `insertarMoneda()`, `expulsarMoneda()`, `seleccionarProducto()` y `entregarProducto()` al estado actual.

```java
// ---------- State ----------
interface State {
    void insertarMoneda(VendingMachine maquina);
    void expulsarMoneda(VendingMachine maquina);
    void seleccionarProducto(VendingMachine maquina);
    void entregarProducto(VendingMachine maquina);
}

// ---------- ConcreteStates ----------
class SinDinero implements State {
    @Override
    public void insertarMoneda(VendingMachine maquina) {
        System.out.println("Moneda insertada.");
        maquina.setEstado(new DineroInsertado());
    }

    @Override
    public void expulsarMoneda(VendingMachine maquina) {
        System.out.println("No hay moneda que expulsar.");
    }

    @Override
    public void seleccionarProducto(VendingMachine maquina) {
        System.out.println("Primero inserte moneda.");
    }

    @Override
    public void entregarProducto(VendingMachine maquina) {
        System.out.println("Primero inserte moneda y seleccione producto.");
    }
}

class DineroInsertado implements State {
    @Override
    public void insertarMoneda(VendingMachine maquina) {
        System.out.println("Ya ha insertado una moneda. Use otra operación.");
    }

    @Override
    public void expulsarMoneda(VendingMachine maquina) {
        System.out.println("Moneda expulsada.");
        maquina.setEstado(new SinDinero());
    }

    @Override
    public void seleccionarProducto(VendingMachine maquina) {
        System.out.println("Producto seleccionado. Entregando...");
        maquina.setEstado(new ProductoEntregado());
    }

    @Override
    public void entregarProducto(VendingMachine maquina) {
        System.out.println("Primero seleccione un producto.");
    }
}

class ProductoEntregado implements State {
    @Override
    public void insertarMoneda(VendingMachine maquina) {
        System.out.println("Espere, entregando producto.");
    }

    @Override
    public void expulsarMoneda(VendingMachine maquina) {
        System.out.println("No se puede expulsar moneda durante la entrega.");
    }

    @Override
    public void seleccionarProducto(VendingMachine maquina) {
        System.out.println("Ya se está entregando un producto.");
    }

    @Override
    public void entregarProducto(VendingMachine maquina) {
        System.out.println("Producto entregado. Disfrútelo.");
        maquina.setEstado(new SinDinero());
    }
}

class Agotado implements State {
    @Override
    public void insertarMoneda(VendingMachine maquina) {
        System.out.println("Máquina agotada. Inserte moneda devuelta.");
    }

    @Override
    public void expulsarMoneda(VendingMachine maquina) {
        System.out.println("No hay moneda insertada.");
    }

    @Override
    public void seleccionarProducto(VendingMachine maquina) {
        System.out.println("Máquina agotada.");
    }

    @Override
    public void entregarProducto(VendingMachine maquina) {
        System.out.println("No hay productos.");
    }
}

// ---------- Context ----------
class VendingMachine {
    private State estadoActual;

    public VendingMachine() {
        // Estado inicial
        estadoActual = new SinDinero();
    }

    public void setEstado(State estado) {
        this.estadoActual = estado;
    }

    public void insertarMoneda() {
        estadoActual.insertarMoneda(this);
    }

    public void expulsarMoneda() {
        estadoActual.expulsarMoneda(this);
    }

    public void seleccionarProducto() {
        estadoActual.seleccionarProducto(this);
    }

    public void entregarProducto() {
        estadoActual.entregarProducto(this);
    }
}

// ---------- Cliente ----------
public class StateDemo {
    public static void main(String[] args) {
        VendingMachine maquina = new VendingMachine();

        maquina.insertarMoneda();
        maquina.seleccionarProducto();
        maquina.entregarProducto();

        System.out.println("---");
        maquina.insertarMoneda();
        maquina.expulsarMoneda();

        System.out.println("---");
        maquina.seleccionarProducto(); // sin dinero
    }
}
```

**Salida esperada:**
```
Moneda insertada.
Producto seleccionado. Entregando...
Producto entregado. Disfrútelo.
---
Moneda insertada.
Moneda expulsada.
---
Primero inserte moneda.
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ state.puml](../diagramas/04-statepuml.md) | [🏠 Inicio](../../../index.md) | [State python ▶](03-state-python.md) |
