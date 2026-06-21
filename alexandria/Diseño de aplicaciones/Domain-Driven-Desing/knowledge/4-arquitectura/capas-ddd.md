# Capas DDD

La **Arquitectura por Capas en DDD** es una guía para estructurar el código dentro de un Bounded Context. No es un dogma, pero establece una separación clara de responsabilidades y un flujo de dependencias unidireccional hacia el centro (el dominio). Esta arquitectura es el cimiento sobre el que se aplican los patrones tácticos.

## Las cuatro capas típicas
1. **Capa de Presentación (Interface / UI)**
   - Responsable de la interacción con el usuario o con otros sistemas a través de protocolos (HTTP, gRPC, colas).
   - No contiene lógica de negocio. Solo traduce entradas/salidas y las delega a la capa de aplicación.
   - Ejemplos: controladores REST, suscriptores de mensajes, interfaces de línea de comandos.

2. **Capa de Aplicación (Application)**
   - Orquesta los casos de uso y los flujos de trabajo.
   - Recibe comandos/consultas desde la capa de presentación, los valida superficialmente (formato, no reglas de negocio), carga los agregados necesarios desde repositorios, invoca el comportamiento del dominio y persiste los cambios.
   - No contiene lógica de negocio; es una capa fina de coordinación.
   - Se encarga de la gestión de transacciones y de la publicación de eventos de dominio (tras el éxito de la transacción).
   - Ejemplo: `RealizarPedidoService` que usa `PedidoRepository`, `ClienteRepository` y un `PedidoFactory`.

3. **Capa de Dominio (Domain)**
   - Es el corazón del sistema. Contiene entidades, value objects, agregados, servicios de dominio, fábricas y especificaciones.
   - Expresa el lenguaje ubicuo y las reglas de negocio.
   - No depende de nada externo. Sus dependencias son solo interfaces (puertos) definidas en esta capa o en subcapas de aplicación (ej. `PedidoRepository`).
   - Cualquier invocación a infraestructura se realiza a través de esas interfaces inyectadas.

4. **Capa de Infraestructura (Infrastructure)**
   - Implementa los detalles técnicos: persistencia (repositorios con JPA, MongoDB), envío de emails, mensajería, clientes HTTP, logging.
   - Contiene los adaptadores que conectan los puertos definidos en el dominio/aplicación con tecnologías concretas.
   - Depende del dominio y de la aplicación (implementa sus interfaces).

## Flujo de dependencias
```
Presentación → Aplicación → Dominio ← Infraestructura
```
Las flechas indican dirección de dependencia en tiempo de compilación. La presentación conoce la aplicación; la aplicación conoce el dominio; el dominio no conoce a nadie; la infraestructura conoce al dominio (y a veces a la aplicación) porque implementa sus interfaces. Gracias a la inversión de dependencia, el dominio permanece puro.

## Responsabilidades típicas por capa (ejemplo: realización de pedido)
- **Presentación:** `PedidoController` recibe JSON, lo mapea a un objeto comando `RealizarPedidoCommand`, lo pasa al servicio de aplicación.
- **Aplicación:** `PedidoApplicationService` inicia una transacción, obtiene el `Cliente` del repositorio, llama a `PedidoFactory.crear(...)` (dominio), guarda el `Pedido` con el repositorio y publica los eventos.
- **Dominio:** `Pedido` agrega líneas, comprueba invariantes; `PedidoFactory` valida el catálogo.
- **Infraestructura:** `PedidoRepositoryJpa` persiste el agregado; `KafkaEventBus` envía `PedidoCreado`.

## Capa de Aplicación vs. Capa de Dominio
Es frecuente que se difumine el límite. Regla de oro: si la lógica expresa una regla de negocio que un experto del dominio reconocería, va en la capa de dominio. Si es sobre cómo se conecta una pantalla, permisos de usuario, o cuándo enviar un email, va en aplicación. La aplicación es el “jefe de orquesta”, no el músico.

## Variantes modernas
- **Arquitectura hexagonal sobre capas:** las capas se cruzan con puertos y adaptadores. La capa de aplicación contiene los puertos primarios; la capa de infraestructura contiene los adaptadores.
- **CQRS:** la capa de aplicación se divide en comandos (que usan el dominio) y consultas (que pueden saltarse el dominio e ir directo a modelos de lectura).
- **Patrón Mediator:** algunos equipos encapsulan los casos de uso en handlers de comandos/consultas (ej. MediatR en .NET) dentro de la capa de aplicación.

## Anti-patrones comunes
- **Lógica de dominio en la capa de aplicación:** servicios de aplicación que contienen `if (pedido.total > 1000) aplicarDescuento()`. Esto roba al dominio su comportamiento.
- **Entidades de dominio expuestas directamente en la API:** se acoplan la presentación y el dominio, y se fuerzan concesiones en el modelo.
- **Capa de infraestructura invadiendo el dominio:** importar `@Entity` de JPA en una clase de dominio. Se recomienda mantener las anotaciones en un módulo separado o usar configuraciones externas de mapeo.

---

Estos cuatro archivos proporcionan una comprensión arquitectónica profunda para implementar DDD de forma efectiva, asegurando que el dominio se mantenga aislado, expresivo y alineado con las necesidades del negocio.
