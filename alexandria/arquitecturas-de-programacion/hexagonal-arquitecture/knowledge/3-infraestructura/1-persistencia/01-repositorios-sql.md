# Repositorios SQL

## Propósito
Un repositorio SQL es un adaptador secundario que implementa un puerto `RepositorioX` utilizando una base de datos relacional. Su responsabilidad es persistir y recuperar **agregados completos** del dominio, garantizando las invariantes que el agregado define, pero sin que el dominio sepa nada de SQL, tablas o cursores.

## Características fundamentales
- **Implementa una interfaz del núcleo**: El adaptador depende de la abstracción (por ejemplo, `RepositorioPedidos`) y la tecnología concreta (JDBC, JPA, MyBatis) queda encapsulada.
- **Trabaja a nivel de agregado**: No expone métodos para salvar líneas de pedido sueltas; todo cambio sobre el interior de un agregado se realiza a través de la raíz.
- **Traducción bidireccional**: Convierte los objetos de dominio en estructuras relacionales al guardar, y reconstruye los objetos de dominio con sus invariantes al leer.
- **Transaccionalidad delegada**: El servicio de aplicación suele demarcar la transacción; el repositorio participa en ella sin iniciar ni confirmar por su cuenta.
- **Aislamiento de la lógica SQL**: Toda sentencia, consulta o procedimiento almacenado reside en esta capa, nunca en el dominio.

## Ejemplo conceptual
```java
// Puerto secundario (en el núcleo)
public interface RepositorioPedidos {
    Pedido buscarPorId(PedidoId id);
    void guardar(Pedido pedido);
    List<Pedido> recuperarPendientes(ClienteId clienteId);
}

// Adaptador SQL con JDBC (infraestructura)
public class RepositorioPedidosPostgres implements RepositorioPedidos {
    private final DataSource dataSource;

    // ... constructor con inyección

    @Override
    public Pedido buscarPorId(PedidoId id) {
        // 1. Ejecutar SELECT con JOINs
        // 2. Mapear ResultSet a objeto Pedido (con sus líneas)
        // 3. Devolver agregado de dominio completamente hidratado
    }

    @Override
    public void guardar(Pedido pedido) {
        // 1. Insertar o actualizar la tabla PEDIDOS
        // 2. Sincronizar líneas: insertar nuevas, borrar eliminadas, actualizar existentes
        // 3. Todo dentro de la transacción abierta por el servicio de aplicación
    }
}
```

## Patrones y buenas prácticas
- **Modelo de persistencia separado**: Se definen clases POJO/Entities (ej. `PedidoJpaEntity`, `LineaPedidoJpaEntity`) en la infraestructura, con anotaciones de ORM si procede, y nunca se filtran al dominio. Un ensamblador (`PedidoMapper`) convierte entre estos modelos y el agregado de dominio.
- **Uso de repositorios específicos**: Cada agregado tiene su propio repositorio. No existe un repositorio genérico, pues las consultas deben expresar necesidades del negocio con nombres del lenguaje ubicuo.
- **Optimización de consultas**: Se pueden definir métodos de consulta con criterios de negocio (por ejemplo, `recuperarPedidosParaFacturacion()`). La implementación SQL puede ser compleja, pero permanece oculta.
- **Manejo de la concurrencia**: El repositorio puede incluir versiones (campo `version`) para control optimista, respetando la estrategia que el dominio requiera.

## Tecnologías comunes
- JDBC puro: máximo control, cero magia.
- JPA / Hibernate: el mapeo se gestiona mediante anotaciones en los objetos de persistencia. El repositorio usa `EntityManager`.
- MyBatis: las consultas SQL se escriben a mano en XML o anotaciones, mapeando resultados a objetos de dominio sin necesidad de estados gestionados.
- Spring Data JDBC / JPA: se apoya en interfaces de repositorio que el framework implementa, pero la adaptación al dominio sigue requiriendo una capa de traducción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Síntesis de la capa de aplicación](../../2-elementos-del-nucleo/aplicacion/05-sintesis-de-la-capa-de-aplicacion.md) | [🏠 Inicio](../../index.md) | [Repositorios NoSQL ▶](02-repositorios-nosql.md) |
