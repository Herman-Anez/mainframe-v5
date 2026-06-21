# gRPC

## Rol en la arquitectura hexagonal
Un adaptador gRPC es un **adaptador primario** que ofrece servicios definidos mediante Protocol Buffers. El servidor gRPC implementa las interfaces generadas a partir del `.proto` y traduce las peticiones a los puertos primarios.

## Ejemplo
```proto
service PedidoService {
  rpc CrearPedido (CrearPedidoRequest) returns (PedidoIdResponse);
}
```
```java
public class PedidoGrpcService extends PedidoServiceImplBase {
    private final GestionDePedidos gestion;

    @Override
    public void crearPedido(CrearPedidoRequest req, StreamObserver<PedidoIdResponse> observer) {
        CrearPedidoComando comando = GrpcMapper.aComando(req);
        PedidoId id = gestion.crearPedido(comando);
        PedidoIdResponse response = PedidoIdResponse.newBuilder()
            .setId(id.getValor())
            .build();
        observer.onNext(response);
        observer.onCompleted();
    }
}
```

## Aspectos importantes
- **Traducción de tipos**: Los objetos protobuf son planos y no deben usarse como objetos de dominio. Un mapper convierte entre los mensajes gRPC y los comandos/DTOs del núcleo.
- **Streaming**: gRPC permite streaming unidireccional y bidireccional. Para un streaming de entrada, el adaptador recibe un `StreamObserver` y puede llamar al puerto primario con un flujo de comandos. Para un streaming de salida, el puerto primario podría devolver un `Flux` o `Publisher` (del dominio) que el adaptador traduce a respuestas gRPC. El dominio define su propio contrato asíncrono sin depender de gRPC.
- **Manejo de errores**: Los códigos de estado gRPC (`INVALID_ARGUMENT`, `NOT_FOUND`) se generan a partir de excepciones del dominio o del servicio de aplicación. Un interceptor de gRPC puede traducir excepciones del núcleo a estados gRPC estándar.
- **Interceptores**: Autenticación, logging, métricas se añaden mediante interceptores gRPC, que son middleware en la capa de infraestructura.

## Independencia del núcleo
El dominio puede definirse completamente sin protobuf. Si en el futuro se decide reemplazar gRPC por REST, el dominio no cambia. Los puertos primarios permanecen idénticos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ GraphQL](02-graphql.md) | [🏠 Inicio](../../index.md) | [Mensajería ▶](04-mensajeria.md) |
