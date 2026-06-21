# Publicador de eventos de dominio

## Definición
El publicador de eventos de dominio es un puerto secundario (driven port) que permite al dominio emitir eventos de negocio sin conocer el mecanismo de distribución (cola de mensajes, bus de eventos, webhook). El dominio solo sabe que existe un contrato para "publicar algo que ha ocurrido". La implementación real se encarga de la entrega.

## Rol en la arquitectura hexagonal
- El dominio define la interfaz `PublicadorEventos` (o `EventBus`) con un método como `publicar(EventoDeDominio evento)`.
- El servicio de aplicación, tras ejecutar la operación del agregado, recoge los eventos de dominio (que el agregado ha acumulado en una colección interna) y los envía al publicador.
- El adaptador de infraestructura ( `KafkaPublicadorEventos`, `RabbitPublicadorEventos`, `EventBusGuava`) implementa la interfaz y maneja la serialización, tópicos y reintentos.

## Flujo típico
1. El agregado emite un evento, por ejemplo `PedidoCreado`, y lo almacena en una lista `eventosPendientes`.
2. El servicio de aplicación llama a `pedido.obtenerEventos()` y los itera.
3. Por cada evento, invoca `publicador.publicar(evento)`.
4. El adaptador concreto serializa el evento (JSON, Avro) y lo envía al broker.
5. Luego el servicio de aplicación (o el repositorio) limpia la lista de eventos del agregado.

## Implementación y Outbox Pattern
En un sistema transaccional, la publicación debe ser atómica con la persistencia. Para ello se usa el **patrón Outbox**:
- En lugar de publicar directamente al broker, el adaptador de repositorio persiste los eventos en una tabla `OUTBOX` dentro de la misma transacción de la base de datos.
- Un proceso separado (poller o change data capture) lee la tabla y envía los mensajes al broker.
- El dominio y el servicio de aplicación solo ven el `PublicadorEventos`; la complejidad del outbox queda encapsulada en el adaptador concreto.

## Mejores prácticas
- **Eventos como objetos de dominio**: son inmutables, con nombre en pasado, y contienen los datos relevantes del suceso. No contienen lógica, solo estado.
- **Eventos como contrato**: diseñarlos cuidadosamente porque son parte de la API del sistema hacia otros servicios. Evolucionarlos con versionado.
- **Un publicador simple o múltiples especializados**: se puede tener un solo `PublicadorEventos` o varios ( `PublicadorPedidos`, `PublicadorFacturacion` ). El dominio define la abstracción que necesita.
- **No publicar desde el dominio directamente**: el dominio solo registra el evento. La publicación la orquesta el servicio de aplicación. Esto evita que el dominio dependa de un servicio externo y facilita el testeo.
- **Evitar lógica de enrutamiento en el dominio**: el dominio no decide a qué tópico va un evento; eso es responsabilidad del adaptador, que puede usar una estrategia de enrutamiento basada en el tipo de evento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Políticas y especificaciones](03-politicas-y-especificaciones.md) | [🏠 Inicio](../index.md) | [Manejo de transacciones ▶](05-manejo-de-transacciones.md) |
