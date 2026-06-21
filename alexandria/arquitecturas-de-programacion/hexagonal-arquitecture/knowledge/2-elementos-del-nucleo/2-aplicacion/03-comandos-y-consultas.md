# Comandos y consultas

## Definición
Son objetos de transporte de datos (DTOs) que definen la forma de la información que entra o sale de un caso de uso. Representan la intención del actor y encapsulan los parámetros necesarios para ejecutar la operación.

- **Comando** (Command): Transporta la intención de realizar un cambio de estado, junto con todos los datos necesarios para ello. Ejemplo: `CrearPedidoComando` con `clienteId`, `listaDeLineas`.
- **Consulta** (Query): Define los criterios de búsqueda para obtener información sin modificar el estado. Ejemplo: `PedidosPendientesClienteQuery` con `clienteId`, `fechaDesde`, `fechaHasta`. También puede referirse a la respuesta de una consulta (un DTO de salida específico).

## Características
- **Inmutabilidad deseable**: Los comandos suelen diseñarse como objetos inmutables para evitar efectos laterales durante su procesamiento.
- **Validación superficial**: Pueden llevar anotaciones de validación (como `@NotNull`) para rechazar datos inválidos antes de tocar el dominio. Sin embargo, la validación de reglas de negocio pertenece al dominio; el comando solo garantiza la integridad estructural.
- **Parte del núcleo, pero sin lógica**: Pertenecen a la capa de aplicación y son ajenos a la infraestructura. Un adaptador REST construye un `CrearPedidoComando` a partir del JSON recibido y lo pasa al puerto primario. El comando no conoce HTTP.
- **CQRS opcional**: Si se adopta Command Query Responsibility Segregation, los comandos y las consultas se tratan como modelos separados, con rutas de ejecución independientes. En una hexagonal pura, es natural mantener esta separación, pues un caso de uso que modifica estado no devuelve datos ricos, y una consulta no modifica el estado.

## Ejemplo
```java
// Comando inmutable
public class CancelarSuscripcionComando {
    private final SuscripcionId suscripcionId;
    private final String motivo;

    // Constructor, getters...
}

// Query de entrada (o DTO de filtro)
public class BuscarClientesActivosQuery {
    private final LocalDate desde;
    private final int maxResultados;
}
```

Los servicios de aplicación reciben estos objetos y extraen de ellos la información necesaria para operar. Los adaptadores los construyen, manteniendo al dominio completamente aislado del formato de los datos de entrada.

## Diferencia con los objetos de dominio
Un `CrearPedidoComando` no es un value object de dominio; es un contrato de entrada. El comando puede contener datos que todavía no tienen el formato de los value objects (ej. un String para el email, que luego el dominio construye en un `Email` validando el formato). La transformación ocurre en el servicio de aplicación o en un ensamblador específico.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Servicios de aplicación](02-servicios-de-aplicacion.md) | [🏠 Inicio](../../index.md) | [Puertos primarios ▶](04-puertos-primarios.md) |
