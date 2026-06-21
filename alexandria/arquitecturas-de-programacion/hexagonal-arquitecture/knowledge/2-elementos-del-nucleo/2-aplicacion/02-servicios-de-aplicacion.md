# Servicios de aplicación

## Definición
Un servicio de aplicación es una clase que **orquesta** la ejecución de un caso de uso. No toma decisiones de negocio; en su lugar, carga los agregados necesarios desde los repositorios, invoca el comportamiento del dominio (métodos en entidades, servicios de dominio) y coordina la persistencia y la notificación de eventos.

Es “manos” y no “cerebro”: sabe **qué pasos** seguir, pero la **lógica de negocio** que decide **cómo** se transforma el estado está en el dominio.

## Características fundamentales
- **Libre de reglas de negocio**: Nunca contiene validaciones de reglas de dominio, cálculos de negocio ni transiciones de estado. Eso queda delegado a entidades, value objects y servicios de dominio.
- **Dependiente de abstracciones**: Recibe mediante inyección los puertos secundarios que necesita (repositorios, publicadores de eventos, servicios de pago…). Nunca depende de adaptadores concretos.
- **Coordinación transaccional**: Es el lugar natural para definir el alcance transaccional de la aplicación. Por ejemplo, anotar un método con `@Transactional` en Spring (aunque la anotación es un detalle del adaptador, la demarcación se puede hacer a nivel de servicio de aplicación).
- **Traducción y ensamblaje**: Convierte los comandos/consultas de entrada en objetos de dominio, desempaqueta resultados del dominio y construye DTOs de salida. También puede iterar eventos de dominio generados por los agregados y pasarlos al puerto de publicación.
- **Stateless**: No mantiene estado propio entre invocaciones; toda la información necesaria se le pasa como parámetro o se obtiene de repositorios.

## Relación con los servicios de dominio
- El **servicio de aplicación** coordina: «Carga el pedido, llama al servicio de dominio para calcular descuento, aplica el resultado al pedido, guarda, publica evento».
- El **servicio de dominio** contiene la pura inteligencia de negocio: «El descuento para clientes premium es del 15% si el pedido supera 100€».

Esta separación garantiza que las reglas de negocio puedan probarse aisladamente sin levantar nada de infraestructura, y que los cambios en el flujo de trabajo no contaminen el dominio.

## Ejemplo de código conceptual
```java
// Servicio de aplicación (implementa el puerto primario)
public class PedidoApplicationService implements GestionDePedidos {

    private final RepositorioPedidos repositorio;
    private final PublicadorEventos publicador;

    @Override
    public PedidoId crearPedido(CrearPedidoComando comando) {
        // 1. Construir agregado raíz con los datos del comando
        Pedido nuevoPedido = Pedido.crear(comando.getClienteId(), comando.getLineas());

        // 2. Persistir el agregado (el repositorio es un puerto secundario)
        repositorio.guardar(nuevoPedido);

        // 3. Publicar eventos de dominio generados por el agregado
        nuevoPedido.obtenerEventos().forEach(publicador::publicar);

        return nuevoPedido.getId();
    }
}
```
Nótese que no hay lógica de negocio; el dominio decide cómo se crea un `Pedido` y qué invariantes se validan.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Casos de uso](01-casos-de-uso.md) | [🏠 Inicio](../../index.md) | [Comandos y consultas ▶](03-comandos-y-consultas.md) |
