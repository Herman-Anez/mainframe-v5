# Repositorios

## Propósito y contrato

Un repositorio es un puerto secundario que abstrae el acceso a la colección de agregados. Su interfaz se define en el dominio y se implementa en la infraestructura. Debe hablar el lenguaje del dominio:

```java
public interface RepositorioPedidos {
    Pedido obtener(PedidoId id);
    void guardar(Pedido pedido);
    List<Pedido> pendientesParaCliente(ClienteId clienteId);
}
```

## Solo para raíces de agregado

Esta regla evita que se manipulen entidades internas sin el control del agregado. No debe existir `RepositorioLineasPedido`. Si se necesita una consulta sobre líneas, se puede:
- Crear un método en el repositorio del agregado que devuelva la información necesaria (ej. `List<LineaPedido> lineasDePedido(PedidoId id)` como copia inmutable).
- Si la consulta es compleja y no requiere cargar el agregado completo, se puede usar un **read model** separado (CQRS) con su propio repositorio de consultas que no es un repositorio de dominio.

## Repositorios con especificaciones

En lugar de crear un método por cada criterio de búsqueda, se puede pasar una especificación:

```java
List<Pedido> buscar(Especificacion<Pedido> especificacion);
```

La implementación de infraestructura traduce la especificación a una consulta (Criteria, Expression<Func<,>>). Esto mantiene flexible al repositorio sin forzar un vocabulario infinito de métodos.

## Repositorio y transacciones

El repositorio no debe gestionar transacciones (begin, commit, rollback). Participa en la transacción que gestiona la capa de aplicación. Normalmente se usa un patrón Unit of Work (DbContext en EF, EntityManager en JPA) que la capa de aplicación abre y cierra. El repositorio simplemente añade, modifica o elimina.

## Implementaciones comunes

- **Colección en memoria:** para pruebas, o incluso para prototipos rápidos.
- **ORM (JPA/Hibernate, Entity Framework):** el repositorio se implementa delegando en el `EntityManager` o `DbContext`. Se debe mapear el agregado y sus objetos internos con las configuraciones adecuadas (cascadas, fetch).
- **MongoDB / NoSQL:** el repositorio serializa el agregado completo como un documento. Esta estrategia es muy natural para agregados porque se almacenan y recuperan como un todo.
- **Event Sourcing:** el repositorio no guarda estado, sino eventos. Se implementa un `EventStore` que persiste los eventos y los reproduce.

## Repositorios y la consistencia de lectura

Después de guardar, el repositorio puede devolver la entidad actualizada (si se usa ORM con identity map). Es importante que el agregado devuelto sea el mismo objeto (misma instancia) que se modificó, para preservar las referencias internas durante la misma transacción.

## Anti-patrones

- **Métodos genéricos tipo `IQueryable<T>`:** deja escapar la lógica de consulta a la capa de aplicación o presentación, rompiendo el encapsulamiento del modelo de dominio.
- **Repositorio con lógica de negocio:** validaciones, recálculos. Eso debe estar en el dominio.
- **Exponer excepciones de infraestructura:** `SqlException`, `MongoException` no deben cruzar al dominio; se envuelven en excepciones de aplicación o de dominio.
