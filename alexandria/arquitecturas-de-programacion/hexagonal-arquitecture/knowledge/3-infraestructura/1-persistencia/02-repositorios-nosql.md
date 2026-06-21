# Repositorios NoSQL

## Propósito
Un repositorio NoSQL implementa exactamente el mismo puerto secundario, pero utilizando una base de datos no relacional (documento, clave-valor, grafos, columnar). Su objetivo es el mismo: dar vida al contrato del dominio sin que este conozca la tecnología subyacente.

## Motivación para NoSQL
- Modelos de datos que se alinean mejor con agregados complejos (documentos embebidos).
- Necesidades de escalado horizontal o esquemas flexibles.
- Rendimiento en lecturas/escrituras para casos de uso específicos.

## Características comunes a cualquier repositorio NoSQL
- **El agregado como unidad de serialización**: Es frecuente guardar el agregado entero como un documento (MongoDB), un valor (Redis) o un grafo de nodos. No hay JOINs; el acoplamiento entre entidades internas se resuelve dentro del propio documento o mediante referencias locales.
- **Mapeo directo al dominio o a través de un modelo de persistencia**: Si la base de datos almacena JSON, se puede serializar/deserializar el propio agregado o una representación diseñada para la base de datos. Normalmente se usa un `PedidoDocument` que se mapea al dominio.
- **Consultas flexibles**: Si el puerto requiere búsquedas ricas, el adaptador las implementa con el lenguaje de consulta de la base de datos (MQL, Gremlin, CQL), pero siempre devolviendo objetos de dominio.
- **Independencia total**: El dominio no sabe si sus datos se guardan en MongoDB, DynamoDB o Redis. El adaptador encapsula la conexión y los detalles de API.

## Ejemplo con MongoDB
```java
// Adaptador NoSQL para el mismo puerto RepositorioPedidos
public class RepositorioPedidosMongo implements RepositorioPedidos {
    private final MongoCollection<PedidoDocument> coleccion;

    @Override
    public Pedido buscarPorId(PedidoId id) {
        PedidoDocument doc = coleccion.find(eq("_id", id.valor())).first();
        return PedidoMapper.aDominio(doc);  // Convierte el documento a agregado
    }

    @Override
    public void guardar(Pedido pedido) {
        PedidoDocument doc = PedidoMapper.aDocumento(pedido);
        coleccion.replaceOne(eq("_id", doc.getId()), doc, new ReplaceOptions().upsert(true));
    }
}
```

## Consideraciones específicas
- **Transacciones**: Muchas bases de datos NoSQL tienen soporte transaccional limitado. Si el agregado se almacena como un solo documento, la atomicidad se consigue de forma natural. Si se distribuye en varias colecciones, el adaptador debe garantizar la consistencia final o usar transacciones multi-documento, sin que el dominio lo note.
- **Evolución del esquema**: La flexibilidad de esquema permite añadir campos sin migraciones costosas, pero el adaptador debe mantener la compatibilidad hacia atrás en el mapeo.
- **Consultas de reportes**: A veces se define un puerto secundario de consultas separado (CQRS) con implementaciones NoSQL para lecturas optimizadas, mientras que las escrituras usan SQL. La hexagonal lo permite sin fricción.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Repositorios SQL](01-repositorios-sql.md) | [🏠 Inicio](../../index.md) | [Mapeo objeto-relacional ▶](03-mapeo-objeto-relacional.md) |
