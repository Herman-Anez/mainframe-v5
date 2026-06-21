# GraphQL

## Rol en la arquitectura hexagonal
Un adaptador GraphQL es también un **adaptador primario** que expone una API de consultas y mutaciones flexible. Los resolvers de GraphQL actúan como pequeños controladores que reciben campos específicos de una query/mutation, invocan los puertos primarios y devuelven datos justos.

## Implementación
```java
@Component
public class PedidoMutationResolver implements GraphQLMutationResolver {
    private final GestionDePedidos gestionDePedidos;

    public PedidoIdDto crearPedido(CrearPedidoInput input) {
        CrearPedidoComando comando = GraphqlMapper.aComando(input);
        PedidoId id = gestionDePedidos.crearPedido(comando);
        return new PedidoIdDto(id.getValor());
    }
}

@Component
public class PedidoQueryResolver implements GraphQLQueryResolver {
    private final ConsultaDePedidos consultaDePedidos; // Puerto primario de consultas

    public PedidoDto pedido(String id) {
        return consultaDePedidos.consultarPedido(new PedidoId(id));
    }
}
```

## Puntos clave
- **Resolución por campos**: No es necesario un único resolver para toda la operación; se pueden descomponer por tipo. Por ejemplo, un resolver para `Pedido.cliente` puede cargar el cliente usando un puerto de consulta, delegando al núcleo.
- **DataLoader y problema N+1**: La biblioteca DataLoader permite agrupar consultas que se disparan durante la resolución de una query. El adaptador puede implementar un `BatchLoader` que invoque un método del puerto de consulta diseñado para aceptar lotes (por ejemplo, `buscarClientesPorIds(List<ClienteId> ids)`). El dominio no sabe de DataLoader, solo expone un puerto preparado para operaciones batch.
- **Separación de comandos y consultas**: GraphQL naturalmente separa Query y Mutation. Si se usa CQRS, los adaptadores GraphQL se conectarán a puertos primarios de consulta específicos (p.ej., `ConsultaDePedidos`) y a puertos de comando (`GestionDePedidos`).
- **Validación y autorización**: Al igual que en REST, se realiza en la capa de infraestructura (directivas de schema, interceptores) antes de llegar al núcleo.

## Beneficios
El dominio no sabe que existe GraphQL; solo ve interfaces con métodos claros. Cambiar de REST a GraphQL se reduce a escribir nuevos resolvers, sin tocar la lógica de negocio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ REST API](01-rest-api.md) | [🏠 Inicio](../../index.md) | [gRPC ▶](03-grpc.md) |
