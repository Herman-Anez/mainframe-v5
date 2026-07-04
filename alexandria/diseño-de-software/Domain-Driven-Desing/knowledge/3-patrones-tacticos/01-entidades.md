# Entidades

## Definición y fundamento ontológico

Una **entidad** es un objeto del modelo de dominio que posee una **identidad** continua que lo distingue de todos los demás objetos, incluso si sus atributos son idénticos. La identidad no es un artefacto técnico, sino un reflejo del mundo real o del negocio: dos personas distintas pueden llamarse igual y vivir en la misma dirección, pero son individuos diferentes. Esa distinción es lo que la entidad captura.

## Identidad: más que un campo ID

- **Tipos de identidad:**
  - *Identidad natural:* proporcionada por el dominio (DNI, ISBN, código de vuelo). Es única fuera del sistema y frecuentemente inmutable, aunque puede cambiar si el negocio lo permite (ej. un cambio de ISBN en reediciones raras).
  - *Identidad técnica:* generada por el sistema (UUID, secuencia autoincremental). No tiene significado de negocio pero garantiza unicidad global. Preferible en la mayoría de los casos porque evita acoplamiento a reglas externas y cambios en identificadores naturales.
  - *Identidad compuesta:* combinación de atributos que juntos son únicos. Solo recomendable si los atributos son inmutables y el conjunto es realmente identificativo en el dominio; suele ser frágil.

- **Momento de asignación:**
  - *Temprana:* el cliente o el negocio proporciona el ID antes de persistir (ej. el usuario elige un nombre de usuario único). La entidad se crea con el ID.
  - *Tardía:* el repositorio o la base de datos genera el ID al guardar. La entidad puede no tener ID hasta ser persistida, lo que dificulta su uso en el dominio antes de guardar. Se recomienda usar un `DomainId` generado por el dominio (por ejemplo, `UUID.randomUUID()`) para independizarse de la infraestructura.
  - *Inmediata:* se genera en el constructor (UUID). Es la opción más limpia para DDD: la entidad siempre tiene identidad válida desde su creación.

- **Modelado de la identidad como Value Object:** `PedidoId`, `ClienteId` son value objects inmutables que envuelven el valor primitivo. Aportan tipado fuerte, validación (no pueden ser nulos) y evitan la confusión entre IDs de distintos agregados.

## Mutabilidad controlada y encapsulamiento

Las entidades son mutables por naturaleza: su ciclo de vida implica cambios de estado. Sin embargo, los cambios **no se realizan mediante setters públicos indiscriminados**, sino mediante métodos con significado de negocio:

```java
public class Pedido {
    public void confirmar() { ... }
    public void añadirLinea(Producto producto, Cantidad cantidad) { ... }
    public void cancelar(MotivoCancelacion motivo) { ... }
}
```

- Los setters públicos rompen el encapsulamiento y permiten transiciones de estado inválidas.
- Los métodos de comportamiento realizan validaciones de invariantes y pueden disparar eventos de dominio.
- Para la persistencia, se recomienda que el ORM acceda a campos privados (en Java, anotar campos directamente; en EF Core, `HasField`, `OwnsOne`).

## Comparación con otros patrones

| Característica | Entidad | Value Object | DTO de aplicación |
|----------------|---------|--------------|-------------------|
| Identidad | Sí | No | No (o irrelevante) |
| Mutabilidad | Controlada | Inmutable | Mutable (transporte) |
| Comportamiento de negocio | Sí | Sí, normalmente autónomo | No |
| Persistencia directa | Sí | Como parte de entidad | No |

## Entidades y ORM: prácticas para no manchar el dominio

- **Constructores protegidos privados:** muchos ORMs necesitan un constructor sin parámetros. Se puede declarar `protected` y no usarlo en el código de dominio.
- **Mapeo a campos privados:** evita exponer setters. En JPA se puede usar `@Access(AccessType.FIELD)`; en EF Core, `modelBuilder.Entity<Pedido>().Property("_estado")`.
- **No heredar de clases base de infraestructura:** la entidad no debe extender `EntityBase` con `Id`, `CreatedAt`, etc., si esos son detalles de persistencia. En su lugar, se pueden usar componentes de infraestructura que envuelvan la entidad o configuraciones externas de auditoría.

## Ciclo de vida de la entidad y estados

Las entidades suelen tener un conjunto finito de estados con transiciones permitidas. Esto se puede modelar con:
- **Enumeración simple** para estados lineales.
- **Máquinas de estados** internas mediante el patrón State si la lógica de transición es compleja y variable según el estado. La entidad delega en objetos estado, pero siempre manteniendo la identidad.

Ejemplo con estado interno:
```java
public class Pedido {
    private EstadoPedido estado;
    public void confirmar() {
        estado = estado.confirmar(this); // el estado devuelve el siguiente
    }
}
```

## Identidad y equals/hashCode

La implementación de `equals` y `hashCode` en entidades debe basarse **únicamente en el identificador** (y preferiblemente en su tipo). Nunca en atributos mutables. Además, se debe considerar el caso de que el ID sea nulo antes de persistirse; se suele recurrir a una comparación por instancia si el ID es nulo.

```java
public final boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Pedido)) return false;
    Pedido other = (Pedido) o;
    return id != null && id.equals(other.id);
}
```

## Ejemplo de entidad con invariantes y eventos

Se omite por brevedad pero se incluiría un caso completo en Java con `Pedido`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Big ball of mud](../2-diseno-estrategico/patrones-context-mapping/09-big-ball-of-mud.md) | [🏠 Inicio](../index.md) | [Value objects ▶](02-value-objects.md) |
