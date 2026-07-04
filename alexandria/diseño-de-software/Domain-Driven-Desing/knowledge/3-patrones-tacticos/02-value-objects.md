# Value objects

## Características esenciales

- **Inmutabilidad:** una vez creado, no cambia. Cualquier operación devuelve una nueva instancia.
- **Igualdad por valor:** dos value objects son iguales si todos sus atributos coinciden.
- **Auto-validación:** el constructor o métodos de fábrica lanzan excepciones si los argumentos no son válidos para el concepto que representan.
- **Sin identidad:** no existe un campo `id`. Si aparece un campo identificador por requerimientos de persistencia (ej. una tabla separada), es un artefacto técnico que el dominio ignora.

## Domain Primitives: la base del diseño seguro

Un *Domain Primitive* es un value object que envuelve un tipo primitivo (string, int, etc.) y lo dota de significado y reglas de validación. Ejemplos: `Email`, `PhoneNumber`, `Quantity`, `NonEmptyString`.

Beneficios:
- Evita la "obsesión por los primitivos" y la dispersión de validaciones.
- Convierte las reglas de negocio en objetos explícitos y reutilizables.
- Hace que las firmas de los métodos sean autoexplicativas: `void enviar(Email destino, Asunto asunto, Cuerpo cuerpo)`.

Implementación:
```java
public final class Email {
    private final String valor;
    public Email(String valor) {
        if (valor == null || !valor.matches("...")) throw new IllegalArgumentException();
        this.valor = valor;
    }
    // equals/hashCode/toString
}
```

## Composición de Value Objects

Los value objects pueden contener otros value objects, formando estructuras arbóreas inmutables. Por ejemplo, `Direccion` contiene `Calle`, `CodigoPostal`, `Pais`. La inmutabilidad se mantiene en cascada.

## Persistencia de Value Objects

- **Mapeo embebido:** en bases de datos relacionales, los atributos del value object se aplanan como columnas adicionales de la tabla que contiene la entidad raíz (ej. `DireccionEnvio_Calle`).
- **Serialización a JSON:** en BD NoSQL o en columnas JSON de SQL. Se guarda el VO como un documento. Al leer, se deserializa y se reconstruye, garantizando la validación.
- **Tabla separada con clave foránea:** técnicamente posible pero introduce un ID de BD, que debe ocultarse del dominio. Solo se justifica cuando hay colecciones de value objects que comparten datos (como una tabla de direcciones reutilizadas, aunque conceptualmente un VO no se reutiliza; si se reutiliza, quizás sea una entidad). La recomendación es evitar tablas separadas para VOs a menos que sea estrictamente necesario.

## Cómo elegir entre Entidad y Value Object

Preguntas guía:
- ¿Importa cuál es este objeto o solo qué valores tiene? Si es lo segundo, es VO.
- ¿Cambia con el tiempo? Si necesita mantener un historial de cambios con identidad, es entidad.
- ¿Puede compartirse entre múltiples entidades? Si es inmutable, puede compartirse sin riesgo; si es mutable, no.

## Value Objects complejos con cálculos

Pueden contener lógica de negocio no trivial, como `Dinero` con operaciones aritméticas que manejan redondeo y cambio de moneda. También `RangoDeFechas` que verifica solapamiento. Estos VOs encapsulan algoritmos que de otra forma estarían dispersos en servicios.

## Inmutabilidad en lenguajes mutables

En lenguajes como Java o C#, se deben tomar precauciones:
- Declarar todos los campos como `private final` (Java) o `readonly` (C#).
- No exponer referencias mutables: si un VO contiene una colección, devolver una vista no modificable o una copia defensiva.
- Los métodos que "modifican" devuelven una nueva instancia.

## Value Objects y DDD táctico avanzado

- Pueden usarse como identificadores de entidades, evitando primitivos.
- En CQRS, los comandos y eventos pueden contener VOs serializables.
- En Event Sourcing, los eventos de dominio deben ser inmutables, por lo que sus campos son VOs o tipos primitivos de solo lectura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Entidades](01-entidades.md) | [🏠 Inicio](../index.md) | [Servicios de dominio ▶](03-servicios-de-dominio.md) |
