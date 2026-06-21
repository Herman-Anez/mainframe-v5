# Cableado de adaptadores primarios

Los adaptadores primarios también necesitan ser instanciados y conectados a los puertos primarios.

## Controladores REST
- Se instancian con una referencia al puerto primario (interfaz).
- El framework web necesita saber las rutas. Las anotaciones de ruta (`@RequestMapping`) se colocan en el adaptador, no en el núcleo.
- La raíz de composición registra estos controladores en el servidor.

## Consumidores de mensajes
- Se registran listeners que invocan el puerto primario al recibir un mensaje.
- La configuración incluye la conexión al broker (RabbitMQ, Kafka) y los tópicos a suscribir.
- El adaptador de mensajería se registra como un `MessageListener` o similar.

Ejemplo con Spring RabbitMQ:
```java
@Configuration
public class MensajeriaConfig {
    @Bean
    public PedidoCreadoConsumer pedidoCreadoConsumer(GestionDeFacturacion puerto) {
        return new PedidoCreadoConsumer(puerto);
    }
    // La escucha se activa con @RabbitListener en la clase consumer
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Separación de configuraciones por perfil](04-separacion-de-configuraciones-por-perfil.md) | [🏠 Inicio](../../index.md) | [Cableado de adaptadores secundarios ▶](06-cableado-de-adaptadores-secundarios.md) |
