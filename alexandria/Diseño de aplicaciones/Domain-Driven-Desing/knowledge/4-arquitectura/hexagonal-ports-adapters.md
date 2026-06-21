# Hexagonal ports adapters

La **Arquitectura Hexagonal**, también conocida como **Ports & Adapters** (Puertos y Adaptadores), es un estilo arquitectónico propuesto por Alistair Cockburn que aísla la lógica de negocio (el dominio) de los detalles externos como bases de datos, interfaces de usuario, APIs de terceros y mecanismos de entrega. En DDD esta arquitectura es la aliada natural para proteger el modelo de dominio de la complejidad accidental.

## Principio fundamental
El dominio no debe depender de nada externo. Toda comunicación con el exterior se realiza mediante **puertos** (interfaces definidas por el dominio) y **adaptadores** (implementaciones concretas en la infraestructura). La flecha de dependencia siempre apunta hacia el centro: la infraestructura depende del dominio, nunca al revés.

## El hexágono: una metáfora visual
La figura del hexágono no indica un número fijo de lados, sino la idea de múltiples puertos de entrada y salida:
- **Lado izquierdo (driving side):** puertos por donde entran las peticiones al sistema (API REST, CLI, UI, mensajes entrantes). Son los **puertos primarios**.
- **Lado derecho (driven side):** puertos que el dominio utiliza para comunicarse con el exterior (base de datos, servicios de mensajería, sistemas externos). Son los **puertos secundarios**.

Cada puerto es una interfaz definida en términos del dominio. Los adaptadores conectan el mundo exterior con esos puertos.

## Capas en la Arquitectura Hexagonal
1. **Dominio (centro):** entidades, value objects, agregados, servicios de dominio. No conoce nada externo.
2. **Puertos (interfaces):** contratos definidos por el dominio.
   - *Puertos primarios:* casos de uso o servicios de aplicación (interfaces como `RealizarPedidoUseCase`).
   - *Puertos secundarios:* repositorios, servicios de notificación, buses de eventos (interfaces como `PedidoRepository`, `NotificacionService`).
3. **Adaptadores (infraestructura):** implementan los puertos.
   - *Adaptadores primarios:* controladores REST, suscriptores de colas, handlers de línea de comandos.
   - *Adaptadores secundarios:* implementaciones de repositorio con JPA/Mongo, clientes HTTP para APIs externas, publicadores de eventos en Kafka.

## Inversión de dependencia en acción
```java
// En el dominio (puerto secundario)
public interface RepositorioPedidos {
    Pedido obtener(PedidoId id);
    void guardar(Pedido pedido);
}

// En infraestructura (adaptador secundario)
public class RepositorioPedidosJpa implements RepositorioPedidos {
    private SpringDataPedidoRepository jpaRepo;
    // mapeo de Pedido (dominio) a entidad JPA
}
```
El dominio define `RepositorioPedidos`. La infraestructura lo implementa. Un servicio de aplicación (puerto primario) usará esa interfaz sin saber si los datos vienen de PostgreSQL o de un mock en memoria.

## Relación con DDD
- **Protección del core domain:** los detalles de infraestructura no contaminan el modelo. Una entidad de dominio nunca extiende una clase base de un ORM ni contiene anotaciones de base de datos (idealmente).
- **Bounded Contexts e integración:** cada Bounded Context puede implementarse como un hexágono. Las relaciones entre contextos (ACL, OHS) se convierten en adaptadores que traducen desde el lenguaje ubicuo local al Published Language del otro contexto.
- **Testabilidad:** al depender de interfaces, el dominio se puede probar unitariamente sin levantar bases de datos ni servicios externos.

## Ejemplo de flujo completo
1. Un adaptador primario (controlador REST) recibe una solicitud `POST /pedidos`.
2. Traduce el DTO de entrada y llama al puerto primario `RealizarPedidoUseCase.realizar(command)`.
3. El caso de uso (servicio de aplicación) invoca al repositorio (puerto secundario) para obtener el `Cliente`, crea el `Pedido` mediante una fábrica de dominio y lo guarda de nuevo.
4. Si el caso de uso necesita notificar un evento, llama a un puerto secundario `EventBus.publicar(evento)`.
5. Los adaptadores secundarios implementan la persistencia y la publicación real.

## Variante: puertos como contratos explícitos de casos de uso
Muchos equipos definen puertos primarios como interfaces de servicio de aplicación (`PedidoService`) e implementan la lógica de orquestación en una clase dentro de la capa de aplicación. Esto facilita los tests de integración y el versionado de API.

## Anti-patrones
- **Puerto diseñado según la infraestructura:** `void guardar(String tabla, Map datos)`. El puerto debe hablar el lenguaje del dominio.
- **Lógica de negocio en adaptadores:** validaciones o reglas en el controlador o en el repositorio.
- **Hexágono sin puertos secundarios explícitos:** el dominio termina dependiendo de clases concretas de infraestructura mediante inyección directa.
