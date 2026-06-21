# Event sourcing

**Event Sourcing** (Abastecimiento de Eventos) es un patrón de persistencia que almacena el estado de un agregado como una secuencia ordenada e inmutable de **eventos de dominio**, en lugar de guardar únicamente el estado actual. Cada evento representa un cambio atómico en el agregado. Para reconstruir el estado actual, se repiten (reproducen) los eventos en orden.

## Idea central
En lugar de:
```
Tabla Pedidos: id, cliente_id, estado, total...
```
Se almacena una tabla:
```
Eventos: stream_id (Pedido-123), tipo=PedidoCreado, datos={...}
          stream_id (Pedido-123), tipo=ProductoAñadido, datos={...}
          stream_id (Pedido-123), tipo=PedidoConfirmado, datos={...}
```
El estado actual del pedido se obtiene aplicando secuencialmente esos eventos a un objeto inicialmente vacío. La fuente de verdad es el log de eventos; el estado actual es una proyección derivada.

## Beneficios
- **Auditoría completa:** cada cambio queda registrado para siempre. Se puede inspeccionar qué ocurrió y en qué orden.
- **Depuración y análisis:** se puede reconstruir el estado del sistema en cualquier punto del pasado (viaje en el tiempo).
- **Flexibilidad de consultas:** se pueden generar nuevas proyecciones a partir de los eventos históricos sin tocar el código de escritura.
- **Modelado natural:** los eventos hablan el lenguaje del negocio y son la esencia del comportamiento del dominio.
- **Facilita CQRS:** los eventos son la fuente ideal para alimentar los modelos de lectura.

## Desventajas y desafíos
- **Complejidad:** requiere un cambio de mentalidad respecto a los patrones CRUD.
- **Event Store:** se necesita una base de datos diseñada para streams de eventos (EventStoreDB, Kafka con topic por agregado, o tablas con versionado).
- **Snapshots:** para agregados con un número muy grande de eventos, reconstruir el estado cada vez es lento. Se toman instantáneas periódicas del estado y se aplican solo los eventos posteriores.
- **Evolución de eventos:** los esquemas de eventos cambian con el tiempo. Hay que gestionar múltiples versiones con estrategias de upcasting o mapeo.
- **Consistencia eventual:** al generar proyecciones de lectura de forma asíncrona, se introduce eventualidad.

## Cómo funciona en DDD
1. **Agregado:** los métodos de comportamiento no modifican el estado directamente, sino que registran uno o más eventos.
2. **Repositorio especializado:** el repositorio no guarda el estado del agregado; guarda los nuevos eventos en el Event Store. Para cargar un agregado, obtiene todos los eventos de su stream, crea una instancia vacía y le aplica los eventos.
3. **Aplicación de eventos:** el agregado tiene un método `apply` que sabe cómo mutar su estado a partir de un evento:
```java
public class Pedido {
    public void confirmar() {
        if (estado != BORRADOR) throw ...;
        this.apply(new PedidoConfirmado(id));
    }

    private void apply(PedidoConfirmado evento) {
        this.estado = Estado.CONFIRMADO;
    }
}
```
4. **Event Bus:** los nuevos eventos se publican para que los proyectores actualicen los read models.

## Event Store y streams
Cada agregado tiene su propio stream de eventos identificado por su ID. Los eventos se añaden de forma atómica (append-only). El Event Store garantiza que no haya dos agregados escribiendo en el mismo stream concurrentemente, usando control de concurrencia optimista (por número de versión del stream).

## Snapshots
Para optimizar la carga, después de N eventos se guarda una fotografía del estado serializado. Al cargar, se obtiene el último snapshot y solo los eventos posteriores. La implementación puede ser transparente en el repositorio.

## Relación con CQRS
Event Sourcing es el compañero ideal de CQRS: los eventos de escritura se convierten en la fuente para múltiples proyecciones de lectura. Sin embargo, Event Sourcing no obliga a usar CQRS (se podría consultar el estado proyectado bajo demanda), y CQRS no necesita Event Sourcing (puede alimentarse de eventos después de guardar el estado normal).

## Anti-patrones y precauciones
- **Usar Event Sourcing para dominios simples:** introduce una complejidad innecesaria en CRUD básico.
- **Exponer eventos externos sin adaptación:** los eventos de dominio internos no deben ser la API pública de integración; para ello se usan eventos de integración.
- **Falta de idempotencia en manejadores:** si se reprocesan eventos, los efectos deben ser idempotentes.
