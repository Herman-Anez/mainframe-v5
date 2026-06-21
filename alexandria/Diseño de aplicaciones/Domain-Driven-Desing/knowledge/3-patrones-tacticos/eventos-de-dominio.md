# Eventos de dominio

## Evento de dominio como ciudadano de primera clase

Un evento de dominio es un objeto inmutable que representa algo que ocurrió y que es relevante para el negocio. No es un simple mensaje; es parte del lenguaje ubicuo y debe ser explícito.

## Diseño de eventos

- **Nomenclatura:** verbo en pasado + nombre del agregado + complementos. `PedidoConfirmado`, `ClienteRegistrado`, `ProductoAgotado`.
- **Contenido:** identidad del agregado origen, timestamp, datos necesarios para que los consumidores reaccionen (nunca entidades completas, solo IDs y value objects relevantes).
- **Inmutabilidad:** todos los campos son `final` y se asignan en construcción. No hay setters.
- **Metadatos:** ID único del evento, usuario que lo causó, traceId. Estos pueden estar en una clase base `DomainEvent` y no forman parte del significado negocio.

## Generación y almacenamiento en el agregado

El agregado acumula una lista de eventos a medida que se ejecutan sus métodos:

```java
public class Pedido {
    private List<DomainEvent> eventos = new ArrayList<>();
    public void confirmar() {
        // validaciones...
        eventos.add(new PedidoConfirmado(this.id));
    }
    public List<DomainEvent> eventosPendientes() { return Collections.unmodifiableList(eventos); }
    public void limpiarEventos() { eventos.clear(); }
}
```

Tras la persistencia exitosa, la capa de aplicación obtiene los eventos y los despacha a través del bus. Luego limpia la lista. Esto garantiza que los eventos solo se publiquen si la transacción se completa.

## Despacho síncrono vs. asíncrono

- **Síncrono:** dentro del mismo proceso, útil para efectos secundarios que deben completarse en la misma transacción (aunque se desaconseja porque puede alargar la transacción y crear acoplamiento temporal).
- **Asíncrono:** mediante un message broker. Es la opción recomendada para notificar a otros contextos. Implica consistencia eventual y requiere que los manejadores sean idempotentes.

## Relación con Event Sourcing

En Event Sourcing, los eventos no solo son notificaciones: son el estado. El repositorio persiste los eventos y reconstruye el agregado aplicándolos. Los mismos eventos que se persisten se pueden publicar a otros contextos.

## Integración entre contextos: eventos de integración

Cuando un evento de dominio debe ser consumido por otro Bounded Context, a menudo se traduce a un **evento de integración** (un Published Language con el esquema acordado). La traducción puede ocurrir en un adaptador en la capa de infraestructura.

## Buenas prácticas

- **Diseñar eventos pequeños y específicos:** `ProductoAñadido` es mejor que `PedidoModificado`. Facilita la evolución y la idempotencia.
- **No reutilizar eventos entre contextos sin traducción:** el modelo de un contexto no debe filtrarse en otro.
- **Idempotencia en consumidores:** usar el ID del evento para detectar duplicados. Si el manejador se ejecuta dos veces, el resultado debe ser el mismo.
