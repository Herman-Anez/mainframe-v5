# Manejo de transacciones

## Definición y desafío
En la arquitectura hexagonal, la transacción de aplicación es orquestada por el servicio de aplicación y debe abarcar la persistencia del agregado y, a menudo, la publicación de eventos o la invocación de servicios externos. El desafío es coordinar múltiples recursos (base de datos, mensajería) sin que el dominio se entere y sin acoplar la lógica de negocio a la infraestructura de transacciones.

## Principios
- **El dominio es ajeno a las transacciones**: las entidades y servicios de dominio no abren, confirman ni revierten transacciones. Solo se preocupan por la consistencia del agregado.
- **El servicio de aplicación demarca la unidad de trabajo**: es el lugar donde se define el alcance transaccional. Puede anotarse con `@Transactional` (Spring) o utilizar un `UnitOfWork` explícito.
- **Transaccionalidad delegada**: el servicio de aplicación no sabe cómo se implementa la transacción; simplemente asume que el contexto donde se ejecuta lo provee. La infraestructura de persistencia (el adaptador del repositorio) participa en la transacción abierta.

## Estrategias de manejo

### a) Transacción única sobre la base de datos principal
Si la operación solo involucra una base de datos, el servicio de aplicación se anota con `@Transactional` y el repositorio utiliza la misma conexión. Los eventos de dominio se almacenan en la tabla OUTBOX dentro de la misma transacción. Todo es atómico.

### b) Transacciones distribuidas y consistencia eventual
Cuando se deben actualizar múltiples sistemas (base de datos + envío de mensaje a Kafka sin outbox), la consistencia fuerte es difícil. La hexagonal promueve el uso de **Sagas** o el patrón **Outbox** para garantizar la entrega eventual sin transacciones distribuidas. El dominio emite eventos; la infraestructura se encarga de la coordinación. El servicio de aplicación no tiene lógica de compensación compleja; una saga puede ser otro servicio de aplicación que escucha eventos de fallo y ejecuta comandos compensatorios a través de puertos primarios.

### c) Unit of Work personalizado
En lugar de anotaciones, se puede implementar una interfaz `UnitOfWork` (puerto secundario) con métodos `begin()`, `commit()`, `rollback()`. El servicio de aplicación la invoca explícitamente. Así se evita la dependencia de anotaciones de framework, aunque rara vez es necesario en la práctica.

## Ejemplo conceptual con Spring
```java
public class PedidoApplicationService implements GestionDePedidos {
    private final RepositorioPedidos repositorio;
    private final PublicadorEventos publicador;

    @Override
    @Transactional
    public PedidoId crearPedido(CrearPedidoComando comando) {
        Pedido pedido = Pedido.crear(comando);
        repositorio.guardar(pedido); // misma conexión transaccional
        pedido.obtenerEventos().forEach(publicador::publicar); // outbox o publicación directa
        return pedido.getId();
    }
}
```
El adaptador de `PublicadorEventos` puede implementar el outbox. Si se usa publicación directa con Kafka, se debe configurar un `KafkaTransactionManager` sincronizado con el `DataSourceTransactionManager`.

## Mejores prácticas
- **Mantener las transacciones cortas**: no extenderlas a través de llamadas externas lentas (HTTP) dentro de la misma transacción. Si se necesita, dividir en pasos con consistencia eventual.
- **No usar transacciones en el dominio**: nunca anotar entidades o value objects.
- **Demarcación en el punto de entrada**: en el servicio de aplicación que implementa el caso de uso. No en controladores ni en repositorios.
- **Pruebas**: los tests de servicios de aplicación pueden mockear la transacción o simplemente ignorarla (si no se necesita persistencia real). La lógica de negocio no debe depender de la existencia de una transacción activa.
- **Separar consultas de comandos**: las consultas normalmente no requieren transacción de escritura, por lo que pueden usar conexiones de solo lectura y optimizar recursos.

---

## Síntesis de patrones y buenas prácticas
Estos cinco patrones son herramientas diarias en una arquitectura hexagonal bien implementada. El **repositorio** abstrae la persistencia; las **fábricas** centralizan la creación de objetos complejos; las **especificaciones** y **políticas** permiten externalizar reglas de negocio variables; el **publicador de eventos** desacopla la notificación de acciones; y el **manejo de transacciones** asegura la coherencia sin contaminar el dominio. Todos ellos colaboran para mantener el núcleo puro, expresivo y libre de infraestructura, facilitando la evolución y la prueba continua del sistema.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Publicador de eventos de dominio](04-publicador-de-eventos-de-dominio.md) | [🏠 Inicio](../index.md) | [Hexagonal vs. Arquitectura en capas tradicional ▶](../6-comparativas/01-hexagonal-vs-arquitectura-en-capas-tradicional.md) |
