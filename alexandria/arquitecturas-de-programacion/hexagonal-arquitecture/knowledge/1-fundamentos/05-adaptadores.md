# Adaptadores

## Definición
Un adaptador es una implementación concreta de un puerto que conecta el dominio con una tecnología específica. Transforman las llamadas externas en invocaciones a los puertos (adaptadores primarios) o implementan la interfaz de un puerto secundario utilizando una librería concreta (adaptadores secundarios).

Viven **fuera** del hexágono, en la capa de infraestructura.

## Tipos

### Adaptadores primarios (Driving Adapters)
Reciben la solicitud del mundo exterior y la traducen a una llamada al puerto primario correspondiente.
- Ejemplo: un controlador REST `PedidoController` recibe un `POST /pedidos`, construye un comando `CrearPedidoCommand` y llama a `gestionarPedidoUseCase.crearPedido(comando)`.
- Otros ejemplos: suscriptor de una cola de mensajes, interfaz de línea de comandos, test harness.

### Adaptadores secundarios (Driven Adapters)
Implementan una interfaz de un puerto secundario utilizando una tecnología concreta.
- Ejemplo: `RepositorioPedidosPostgres` implementa `RepositorioPedidos` y utiliza JDBC o JPA para interactuar con PostgreSQL. Traduce los métodos del repositorio (en lenguaje de dominio) a consultas SQL.
- Otros ejemplos: `NotificadorEmailSMTP`, `ProveedorPagosStripe`, `ClienteHTTPCatalogoProductos`.

## Características importantes
- Los adaptadores contienen **lógica de infraestructura**, no lógica de negocio.
- Pueden hacer uso de patrones como **Data Mapper** para traducir entre modelos de dominio y modelos de persistencia o DTOs de transporte.
- No deben tener efectos secundarios que violen la intención del dominio; por ejemplo, un repositorio no debe lanzar eventos de dominio (eso lo hace el dominio o un servicio de aplicación).
- Son fácilmente reemplazables: si se decide migrar de REST a GraphQL, se escribe un nuevo adaptador primario que traduzca las consultas GraphQL a los mismos puertos.

## Ensamblaje (Composition Root)
El ensamblaje de adaptadores concretos se realiza en un punto único de la aplicación (por ejemplo, en el método `main`, el arranque de Spring, o un módulo de configuración). Allí se asigna cada interfaz de puerto a su implementación concreta mediante inyección de dependencias. El dominio nunca sabe qué adaptador se está usando; solo el compositor raíz tiene esa visibilidad.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Puertos](04-puertos.md) | [🏠 Inicio](../index.md) | [Flujo de dependencias ▶](06-flujo-de-dependencias.md) |
