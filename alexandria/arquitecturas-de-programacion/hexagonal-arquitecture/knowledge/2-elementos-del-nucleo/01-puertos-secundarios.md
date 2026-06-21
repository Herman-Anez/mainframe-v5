# Puertos secundarios

## Definición
Un puerto secundario es una **interfaz** definida por el núcleo (dominio + aplicación) que declara los servicios que el sistema requiere de la infraestructura externa para cumplir con sus responsabilidades. Actúa como contrato de salida: el dominio o la capa de aplicación lo invocan cuando necesitan persistir un agregado, notificar un evento, obtener datos de un sistema externo o realizar cualquier operación que escape a la pura lógica de negocio.

En la metáfora del hexágono, cada puerto secundario es una de las caras a través de las cuales el interior “habla” con el exterior, pero la interfaz permanece dentro, sin conocimiento de quién la implementa.

## Características esenciales
- **Reside en el núcleo**: La interfaz está en el mismo módulo que el dominio o la aplicación. No se delega a la infraestructura, porque es el interior quien impone su contrato.
- **Expresada en lenguaje ubicuo**: Los nombres y métodos de la interfaz reflejan el negocio, no la tecnología. Por ejemplo, `RepositorioPedidos.recuperarPendientes()` en lugar de `PedidoDAO.findByStatus("PENDING")`.
- **Abstracta e independiente de la tecnología**: No menciona nada de bases de datos, HTTP, colas de mensajes o librerías concretas. Un `RepositorioPedidos` se implementa igual con PostgreSQL o con un simple mapa en memoria para pruebas.
- **Punto de aplicación del Principio de Inversión de Dependencias (DIP)**: El núcleo define la abstracción y los módulos de infraestructura deben implementarla. La dependencia de código fuente va desde la infraestructura hacia el núcleo, no al revés.
- **Segregada según las necesidades del núcleo (ISP)**: Un puerto no debe obligar a un adaptador a implementar métodos que no necesita. Es común tener puertos específicos para lectura, escritura, notificación, etc.

## Rol en la arquitectura hexagonal
Los puertos secundarios son el mecanismo que protege al dominio de cualquier detalle externo. Cuando un servicio de aplicación necesita guardar un agregado, inyecta un puerto `RepositorioPedidos` (nunca una clase concreta). El dominio puede pedir a un puerto `ServicioDePago` que autorice una transacción, sin saber si esa autorización se hace con Stripe, PayPal o un simulador.

El contrato del puerto define **qué** necesita el núcleo. Los adaptadores secundarios, fuera del hexágono, se encargan del **cómo** usando tecnologías concretas. Esta separación permite:
- Probar el dominio y los servicios de aplicación con dobles de prueba ligeros (fakes, mocks).
- Reemplazar una tecnología de persistencia o mensajería sin reescribir lógica de negocio.
- Desarrollar la lógica de negocio completamente en memoria antes de decidir la base de datos.

## Categorías típicas de puertos secundarios

### 1. Repositorios
El tipo más común. Definen operaciones de persistencia para agregados. Suelen tener métodos como `guardar(agregado)`, `buscarPorId(id)`, `eliminar(id)`. Respetan la frontera del agregado: cargan y persisten la raíz del agregado completa, manteniendo sus invariantes.

Ejemplo:
```java
public interface RepositorioClientes {
    Cliente buscarPorId(ClienteId id);
    void guardar(Cliente cliente);
    List<Cliente> buscarActivos(Periodo periodo);
}
```

### 2. Publicadores de eventos de dominio
Permiten que el dominio emita eventos de negocio sin saber cómo se distribuyen (cola de mensajes, bus en memoria, Kafka). La interfaz suele ser simple: `publicar(EventoDeDominio evento)`.

```java
public interface PublicadorEventos {
    void publicar(EventoDeDominio evento);
}
```

### 3. Servicios de infraestructura / Anticorrupción
Representan llamadas a sistemas externos, APIs de terceros o servicios ajenos al dominio. El núcleo define la interfaz que espera (por ejemplo, `ServicioDePago`) con métodos como `PagoResultado autorizar(Pago pago)`. Un adaptador concreto la implementa usando el SDK de Stripe o un cliente HTTP. Es una capa anticorrupción natural.

```java
public interface ServicioDePago {
    PagoResultado autorizar(Pago pago);
    void reembolsar(PagoId id);
}
```

### 4. Notificaciones
Interfaces para enviar correos, SMS, notificaciones push. `Notificador` con métodos como `enviarConfirmacionPedido(Email destino, Pedido pedido)`.

### 5. Puertos de consulta (Query ports)
Si se aplica CQRS, los puertos secundarios de consulta separan las lecturas de las escrituras. Son interfaces específicas para obtener vistas desnormalizadas o DTOs de consulta, sin usar repositorios de agregados.

## Diseño y mejores prácticas

### Pertenencia dentro del núcleo
La interfaz se ubica junto al dominio o la aplicación que la consume. Si el dominio la necesita directamente (ejemplo, un servicio de dominio que llama a `ServicioDePago`), se declara en el dominio. Si solo la usa la capa de aplicación (repositorios), se puede declarar en la aplicación. Lo importante es que esté dentro del límite interior.

### Nivel de granularidad
Los puertos deben ser específicos y cohesivos. Es preferible tener `RepositorioPedidos` y `RepositorioFacturas` por separado que un `RepositorioGeneral` con métodos para todo. Esto evita dependencias falsas y facilita la sustitución.

### Métodos expresivos y sin efectos laterales ocultos
Cada método debe expresar claramente su intención. Un repositorio no debe mezclar la persistencia con la emisión de eventos; el servicio de aplicación se encarga de recoger los eventos de dominio y pasarlos al publicador.

### Uso de identificadores de dominio y value objects
Los puertos aceptan y devuelven objetos del dominio (entidades, value objects, identificadores). No trabajan con tipos primitivos sueltos (Strings, Longs) a menos que sea estrictamente necesario. Así se mantiene la semántica.

### Inmutabilidad y contratos de entrada/salida
Los objetos que devuelve un repositorio son agregados completos, garantizando que las invariantes se mantengan. Los objetos que se pasan a un `ServicioDePago` son value objects o DTOs de dominio.

## Relación con los puertos primarios y la capa de aplicación
Los **puertos primarios** definen la entrada; los **secundarios** definen la salida. Los servicios de aplicación son el pegamento: implementan un puerto primario y dependen de varios puertos secundarios para orquestar el caso de uso. En ningún momento el servicio de aplicación conoce adaptadores concretos, solo interfaces.

Los puertos secundarios pueden ser utilizados también por servicios de dominio si una regla de negocio necesita información que solo puede obtener del exterior. En ese caso, el dominio declara la interfaz y la aplicación proporciona la implementación mediante inyección.

## Ejemplo de integración
Imaginemos el caso de uso “Cancelar suscripción”:
- El adaptador primario (controlador REST) invoca el puerto primario `GestionDeSuscripciones.cancelar(CancelarSuscripcionComando)`.
- El servicio de aplicación que lo implementa:
  1. Obtiene la suscripción del `RepositorioSuscripciones`.
  2. Llama al método `cancelar(motivo)` de la entidad Suscripción (dominio).
  3. Guarda el agregado con `RepositorioSuscripciones.guardar(suscripcion)`.
  4. Recoge el evento `SuscripcionCancelada` y lo pasa a `PublicadorEventos.publicar(evento)`.
  5. Si la cancelación requiere un reembolso, invoca `ServicioDePago.reembolsar(...)`.

Todos estos pasos usan puertos secundarios. Si en un test unitario reemplazamos `ServicioDePago` por un stub, el flujo sigue funcionando sin pagos reales.

## Puertos secundarios y testabilidad
Los puertos secundarios son la llave para pruebas sin infraestructura. Creando un fake (por ejemplo, `RepositorioPedidosEnMemoria`) que implemente la misma interfaz, podemos probar servicios de aplicación y dominio con velocidad de test unitario. La confianza de que el adaptador real (PostgreSQL) respeta el contrato se valida con tests de integración específicos del adaptador.

## Resumen
Los **puertos secundarios** son contratos abstractos, definidos por el núcleo, que expresan en lenguaje de negocio qué servicios externos necesita el sistema. Son el punto exacto de inversión de dependencias que permite que el dominio viva aislado de la tecnología, y que la infraestructura se enchufe sin contaminar la lógica. Sin puertos secundarios, no hay hexágono; solo hay un código de negocio atrapado en frameworks. Con ellos, el núcleo es dueño de su propio contrato con el mundo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Lenguaje ubicuo](1-dominio/06-lenguaje-ubicuo.md) | [🏠 Inicio](../index.md) | [Casos de uso ▶](aplicacion/01-casos-de-uso.md) |
