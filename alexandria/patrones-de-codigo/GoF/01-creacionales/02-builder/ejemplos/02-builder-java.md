# Builder java

## Ejemplo: Construcción de un pedido de pizza

Ilustraremos el patrón con un producto `Pizza` que tiene varios atributos (masa, salsa, ingredientes, etc.). Mostraremos primero la variante **sin director** (fluent builder), muy común en Java moderno, y luego la variante **con director** para un algoritmo fijo.

### Variante 1: Fluent Builder (sin Director)

```java
// Producto: Pizza (inmutable)
public class Pizza {
    private final String dough;
    private final String sauce;
    private final boolean cheese;
    private final boolean pepperoni;
    private final boolean mushrooms;
    private final boolean bacon;

    // Constructor privado, solo el Builder lo usa
    private Pizza(PizzaBuilder builder) {
        this.dough = builder.dough;
        this.sauce = builder.sauce;
        this.cheese = builder.cheese;
        this.pepperoni = builder.pepperoni;
        this.mushrooms = builder.mushrooms;
        this.bacon = builder.bacon;
    }

    // Getters (sin setters, inmutable)
    public String getDough() { return dough; }
    public String getSauce() { return sauce; }
    public boolean hasCheese() { return cheese; }
    public boolean hasPepperoni() { return pepperoni; }
    public boolean hasMushrooms() { return mushrooms; }
    public boolean hasBacon() { return bacon; }

    @Override
    public String toString() {
        return "Pizza [dough=" + dough + ", sauce=" + sauce +
               ", cheese=" + cheese + ", pepperoni=" + pepperoni +
               ", mushrooms=" + mushrooms + ", bacon=" + bacon + "]";
    }

    // Builder estático interno
    public static class PizzaBuilder {
        // Parámetros obligatorios (podrían estar en el constructor del builder)
        private String dough = "thin";  // valores por defecto
        private String sauce = "tomato";
        private boolean cheese = false;
        private boolean pepperoni = false;
        private boolean mushrooms = false;
        private boolean bacon = false;

        public PizzaBuilder() {}

        // Métodos de configuración, devuelven this para encadenamiento
        public PizzaBuilder withDough(String dough) {
            this.dough = dough;
            return this;
        }

        public PizzaBuilder withSauce(String sauce) {
            this.sauce = sauce;
            return this;
        }

        public PizzaBuilder addCheese() {
            this.cheese = true;
            return this;
        }

        public PizzaBuilder addPepperoni() {
            this.pepperoni = true;
            return this;
        }

        public PizzaBuilder addMushrooms() {
            this.mushrooms = true;
            return this;
        }

        public PizzaBuilder addBacon() {
            this.bacon = true;
            return this;
        }

        // Método build() con validaciones opcionales
        public Pizza build() {
            // Validación: si no tiene ni queso ni pepperoni, error
            if (!cheese && !pepperoni) {
                throw new IllegalStateException("La pizza debe tener al menos queso o pepperoni");
            }
            return new Pizza(this);
        }
    }
}

// Uso del cliente
public class PizzaShop {
    public static void main(String[] args) {
        Pizza pizza = new Pizza.PizzaBuilder()
                .withDough("thick")
                .withSauce("barbecue")
                .addCheese()
                .addPepperoni()
                .addBacon()
                .build();
        System.out.println(pizza);
    }
}
```

**Características**:
- El `PizzaBuilder` es una clase interna estática (convención muy extendida en Java).
- Los métodos `with...` / `add...` devuelven el builder para encadenamiento (fluent interface).
- El constructor de `Pizza` es privado, garantizando que solo el builder puede instanciar.
- Validación en `build()`: se lanza excepción si no se cumplen reglas de negocio.

### Variante 2: Con Director (algoritmo fijo)

Supongamos un proceso estándar para “Pizza del Chef” que siempre lleva masa fina, salsa de tomate, queso y pepperoni, y luego opcionales según el chef elija. El director implementa esa receta.

```java
// Builder abstracto (interfaz)
interface PizzaBuilder {
    void setDough(String dough);
    void setSauce(String sauce);
    void addCheese();
    void addPepperoni();
    void addMushrooms();
    void addBacon();
    Pizza getPizza();  // producto final
}

// ConcreteBuilder para pizza estilo italiano
class ItalianPizzaBuilder implements PizzaBuilder {
    private Pizza.PizzaBuilder builder = new Pizza.PizzaBuilder();

    @Override
    public void setDough(String dough) {
        builder.withDough(dough);
    }

    @Override
    public void setSauce(String sauce) {
        builder.withSauce(sauce);
    }

    @Override
    public void addCheese() {
        builder.addCheese();
    }

    @Override
    public void addPepperoni() {
        builder.addPepperoni();
    }

    @Override
    public void addMushrooms() {
        builder.addMushrooms();
    }

    @Override
    public void addBacon() {
        builder.addBacon();
    }

    @Override
    public Pizza getPizza() {
        return builder.build();
    }
}

// Director: ejecuta la receta
class ChefDirector {
    public Pizza buildChefSpecial(PizzaBuilder builder) {
        builder.setDough("thin");
        builder.setSauce("tomato");
        builder.addCheese();
        builder.addPepperoni();
        // el chef añade setas si el builder lo permite
        builder.addMushrooms();
        return builder.getPizza();
    }
}

// Uso
public class Kitchen {
    public static void main(String[] args) {
        ChefDirector chef = new ChefDirector();
        PizzaBuilder italianBuilder = new ItalianPizzaBuilder();
        Pizza pizza = chef.buildChefSpecial(italianBuilder);
        System.out.println("Chef's special: " + pizza);
    }
}
```

En este caso el director desacopla completamente la secuencia de construcción de la representación concreta. Si quisiéramos una pizza americana (con bacon), crearíamos otro `ConcreteBuilder` y el mismo director podría usarlo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ builder.puml](../diagramas/04-builderpuml.md) | [🏠 Inicio](../../../index.md) | [Builder python ▶](03-builder-python.md) |
