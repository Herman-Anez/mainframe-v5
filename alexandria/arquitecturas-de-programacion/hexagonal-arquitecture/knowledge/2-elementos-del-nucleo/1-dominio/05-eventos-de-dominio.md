# Eventos de dominio

## Definición
Un evento de dominio es un objeto inmutable que representa **algo relevante que ha ocurrido** en el dominio. Lo emite un agregado o un servicio de dominio después de realizar una acción significativa, y otros componentes (dentro o fuera del hexágono) pueden reaccionar a él.

## Propósitos
- **Comunicación desacoplada**: Permite que un cambio en un agregado provoque efectos secundarios (enviar un email, actualizar una vista materializada) sin que el agregado conozca a los interesados.
- **Registro histórico**: Los eventos pueden almacenarse para reconstruir el estado (Event Sourcing) o para auditoría.
- **Lenguaje ubicuo**: Reflejan en código las conversaciones del negocio: “Pedido realizado”, “Pago rechazado”, “Artículo enviado”.

## Características
- Inmutables, con datos del suceso y una marca de tiempo.
- Se nombran en pasado: `PedidoCreado`, `FacturaEmitida`.
- Son parte del dominio, no de la infraestructura. Sin embargo, la forma de publicarlos externamente (colas de mensajes, bus de eventos) se implementa mediante un puerto secundario (por ejemplo, `PublicadorEventos`).

## Rol en la hexagonal
El dominio emite el evento, a menudo recogiéndolo en una colección interna del agregado. Un servicio de aplicación, después de ejecutar la operación, itera esos eventos y los envía al puerto de publicación. Esto mantiene al dominio libre de conocimiento sobre canales de mensajería. El puerto `PublicadorEventos` es secundario: el dominio lo invoca a través de la interfaz, y un adaptador concreto lo implementa con RabbitMQ, Kafka o un bus en memoria.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Servicios de dominio](04-servicios-de-dominio.md) | [🏠 Inicio](../../index.md) | [Lenguaje ubicuo ▶](06-lenguaje-ubicuo.md) |
