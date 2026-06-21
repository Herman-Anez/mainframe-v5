# Mensajería

La mensajería en la hexagonal puede aparecer en dos roles opuestos:

- **Inbound**: El sistema recibe mensajes de una cola/tópico (RabbitMQ, Kafka, SQS). Estos mensajes actúan como adaptadores primarios: desencadenan casos de uso.
- **Outbound**: El sistema publica mensajes (eventos de dominio, comandos hacia otros sistemas) como parte de un adaptador secundario que implementa un puerto de publicación.

## 4.1 Consumidores de mensajes (adaptadores primarios)
Un consumidor de mensajes escucha un canal (cola o tópico), extrae el mensaje, lo convierte en un comando/DTO y lo pasa a un puerto primario.

```java
@Component
public class PedidoCreadoConsumer {
    private final GestionDeFacturacion gestionDeFacturacion; // Puerto primario

    @RabbitListener(queues = "pedido.creado")
    public void onMessage(PedidoCreadoMensaje mensaje) {
        FacturarPedidoComando comando = MensajeMapper.aComando(mensaje);
        gestionDeFacturacion.facturarPedido(comando);
    }
}
```
- El consumidor es un adaptador primario como cualquier otro, solo que en lugar de HTTP, recibe mensajes.
- Debe realizar la traducción del formato de mensaje (JSON, Avro) y posiblemente manejar **idempotencia** y reintentos, pero la lógica de negocio queda en el servicio de aplicación.

## 4.2 Publicadores de eventos (adaptadores secundarios)
El dominio emite eventos de dominio. Para publicarlos realmente en un broker de mensajería, se define un puerto secundario (por ejemplo, `PublicadorDeEventos`). La implementación en infraestructura usa la tecnología concreta.

```java
// Puerto secundario (en el núcleo)
public interface PublicadorDeEventos {
    void publicar(EventoDeDominio evento);
}

// Adaptador secundario (infraestructura)
public class KafkaPublicadorDeEventos implements PublicadorDeEventos {
    private final KafkaTemplate<String, Object> kafka;

    @Override
    public void publicar(EventoDeDominio evento) {
        String topico = determinarTopico(evento);
        kafka.send(topico, evento);
    }
}
```
- El dominio desconoce Kafka. Solo sabe que existe un `PublicadorDeEventos` que puede invocar para lanzar un `PedidoCreado`.
- El mapeo entre el evento de dominio y el formato de serialización (JSON, Avro) se realiza en el adaptador, no en el dominio.

## Mejores prácticas
- **Eventos como contratos**: Definir los eventos de dominio como clases limpias dentro del núcleo. El adaptador maneja la evolución del esquema (por ejemplo, usando Schema Registry) sin afectar al dominio.
- **Transaccionalidad outbox**: Para garantizar la publicación atómica con la persistencia, se suele implementar el patrón Outbox. El adaptador de repositorio guarda los eventos en una tabla outbox; otro proceso los envía al broker. Esta complejidad es transparente para el dominio, que solo añade eventos a una colección interna del agregado.
- **Múltiples consumidores**: Se pueden tener varios adaptadores primarios (uno REST, uno de mensajería) que invoquen el mismo puerto primario. El sistema funciona igual independientemente del canal de entrada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ gRPC](03-grpc.md) | [🏠 Inicio](../../index.md) | [Clientes HTTP ▶](05-clientes-http.md) |
