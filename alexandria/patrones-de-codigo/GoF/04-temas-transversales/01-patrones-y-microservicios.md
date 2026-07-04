# Patrones y microservicios

## 1. Contexto: de los monolitos a los microservicios

Los 23 patrones del GoF nacieron en la era de las aplicaciones monolíticas orientadas a objetos, con una clara separación en capas dentro de un mismo proceso. La arquitectura de microservicios, en cambio, distribuye la lógica de negocio en servicios independientes que se comunican a través de la red, cada uno con su propia base de datos y ciclo de vida. Este cambio de paradigma modifica la aplicabilidad de los patrones GoF:

- Algunos patrones se mantienen intactos dentro de cada microservicio (Strategy, Factory Method, Builder, etc.).
- Otros cambian de ámbito y se convierten en patrones de integración entre servicios (Observer pasa a ser Publicación-Suscripción con brokers de mensajería).
- Unos pocos resultan contraproducentes en entornos distribuidos (Singleton de estado compartido).

La clave es entender que los principios subyacentes (bajo acoplamiento, alta cohesión, separación de responsabilidades) son los mismos, pero las fuerzas cambian: ahora hay latencia de red, fallos parciales, consistencia eventual y despliegue independiente.

## 2. Patrones creacionales en microservicios

**Singleton**
- **Dentro de un servicio**: Sigue siendo útil para infraestructura sin estado dentro de la JVM/proceso (logger, configuration reader, cache local). No hay problema porque el ámbito es el proceso.
- **Entre servicios**: Un Singleton de estado compartido entre múltiples instancias de un servicio es un antipatrón. La unicidad debe gestionarse con mecanismos externos (base de datos, cerrojos distribuidos, líder electo). La coordinación entre instancias no puede basarse en un Singleton en memoria.
- **Alternativa**: El patrón *Service Registry* (descubrimiento de servicios) y el *Configuration Server* centralizado asumen el rol de "única fuente de verdad" pero distribuida.

**Factory Method / Abstract Factory**
- Siguen siendo válidos dentro de cada microservicio para abstraer la creación de objetos (repositorios, clientes HTTP, estrategias).
- A nivel de integración, las factorías pueden crear implementaciones concretas de clientes para otros servicios (por ejemplo, `PaymentServiceClient` con fallback a Hystrix/Resilience4j). La fábrica abstracta puede inyectar la implementación adecuada según el entorno (desarrollo con stubs, producción con HTTP real).

**Builder**
- Muy usado para construir objetos de transferencia (DTOs), mensajes de eventos, y configuraciones complejas.
- En APIs REST, el Builder ayuda a construir URLs, payloads JSON o consultas a bases de datos.
- No cambia conceptualmente; es un patrón de grano fino dentro del servicio.

**Prototype**
- Menos común en microservicios porque la clonación de objetos con estado complejo suele ser costosa y puede ocultar dependencias.
- Puede aparecer en escenarios de *event sourcing* o *CQRS*, donde se necesita reconstruir el estado a partir de un historial de eventos (el prototipo es el objeto base que se va reconstruyendo).

## 3. Patrones estructurales en microservicios

**Adapter**
- Es **fundamental** para la integración entre servicios. Un microservicio expone una API; otro la consume. Si las APIs no coinciden, se crea un adaptador (a menudo llamado *Anti-Corruption Layer* en Domain-Driven Design).
- El adaptador envuelve la comunicación HTTP/gRPC/cola de mensajes y traduce los modelos de datos ajenos al modelo interno del servicio.
- Ejemplo: Un `PaymentAdapter` que implementa `PaymentGateway` internamente pero se comunica con Stripe, PayPal o una pasarela bancaria.

**Bridge**
- Se aplica para separar abstracciones de negocio de las implementaciones técnicas. Por ejemplo, la abstracción `NotificationService` puede tener un implementor `EmailSender`, `SMSSender`, `PushSender`. El Bridge permite cambiar de proveedor sin afectar la lógica de negocio.
- Es una buena práctica definir una abstracción interna y una capa de infraestructura que la implementa; el Bridge es el patrón que formaliza esa separación.

**Composite**
- Sigue aplicándose a estructuras jerárquicas dentro de un servicio (categorías de productos, menús, árboles organizativos).
- Puede trasladarse a las relaciones entre servicios: un *API Gateway* puede verse como un Composite que agrega datos de varios microservicios y los devuelve como una única respuesta, aunque técnicamente no es un Composite GoF puro, sino una composición de llamadas.

**Decorator**
- Extensamente usado para añadir funcionalidades transversales a clientes HTTP: logging, métricas, autenticación, reintentos, circuit breakers. Un `HttpClient` base se decora con capas de resiliencia, trazabilidad, etc.
- También a nivel de handlers en el servidor (middleware en Express.js, interceptores en Spring, `DelegatingFilterProxy`).

**Facade**
- Es el patrón **por excelencia** en microservicios. Cada servicio expone una fachada (su API) que oculta la complejidad interna (modelos de dominio, base de datos, dependencias).
- Además, el *API Gateway* es una fachada externa que unifica las APIs de múltiples servicios para los clientes front-end.
- Internamente, un servicio puede tener una fachada para su capa de aplicación que coordina los servicios de dominio.

**Flyweight**
- Su uso disminuye en procesos de negocio porque cada instancia de microservicio suele gestionar un conjunto pequeño de objetos, no millones. Sin embargo, puede aplicarse en cachés distribuidas (Redis) para compartir objetos inmutables sin replicarlos en memoria.

**Proxy**
- Aparece de muchas formas:
  - *Proxy remoto*: stubs generados a partir de contratos OpenAPI/gRPC que representan servicios remotos.
  - *Proxy de protección*: API Gateway verificando tokens JWT antes de enrutar.
  - *Proxy de caching*: Almacenar respuestas GET para evitar llamadas repetitivas al mismo servicio.
  - *Proxy virtual*: Carga diferida de datos pesados desde otro servicio (Hibernate con lazy loading en entidades con datos externos).

## 4. Patrones de comportamiento en microservicios

**Chain of Responsibility**
- Muy presente en el manejo de peticiones HTTP: filtros, interceptores, middleware forman una cadena que procesa la solicitud antes de llegar al controlador.
- Entre servicios: una petición puede pasar por varios servicios encadenados (orquestación con Saga, o una cadena de enriquecimiento de datos). Aquí se transforma en un patrón de integración con mensajería.

**Command**
- Esencial para implementar *CQRS* (Command Query Responsibility Segregation). Los comandos son objetos que encapsulan la intención de cambio (`CreateOrderCommand`, `CancelOrderCommand`), se envían a un bus de comandos y se ejecutan de forma asíncrona.
- También para *outbox pattern*: los comandos se guardan en una tabla de salida para garantizar la publicación de eventos de forma transaccional.

**Interpreter**
- Raro en microservicios genéricos, salvo en servicios especializados como motores de reglas o lenguajes de consulta (GraphQL internamente parsea e interpreta).

**Iterator**
- A nivel de API, la paginación y los cursores son la versión distribuida del iterador. Un cliente recorre un stream de datos haciendo múltiples peticiones con tokens de continuación.
- Internamente, los iteradores sobre colecciones locales siguen siendo válidos.

**Mediator**
- En lugar de un mediador central, la comunicación entre servicios tiende a ser descentralizada (coreografía de eventos). Sin embargo, existe el patrón *Service Orchestrator* que es un Mediador entre servicios: coordina el flujo de trabajo llamando a varios servicios y decidiendo los siguientes pasos. Ejemplo: un motor de workflow (Camunda, Temporal) actúa como mediador.

**Memento**
- En *event sourcing*, los eventos son la fuente de verdad. Para restaurar un estado anterior (deshacer), se puede aplicar un nuevo evento que compense los efectos. No se suele usar un memento explícito porque el historial de eventos ya contiene toda la información.

**Observer**
- Es el patrón más transformado. Dentro de un servicio, sigue siendo el mecanismo de notificación de cambios del modelo a las vistas (si las hay).
- Entre servicios, se convierte en **Publicación/Suscripción** con brokers de mensajes (RabbitMQ, Kafka). Los servicios publican eventos (dominio) y otros servicios se suscriben. El acoplamiento es mínimo; el sujeto no conoce a los observadores. Este es un habilitador clave de la arquitectura de microservicios.

**State**
- Útil para modelar el ciclo de vida de una entidad de negocio (pedido, incidencia) dentro de un servicio. Las transiciones de estado pueden desencadenar eventos que se publican.
- A nivel de orquestación, los motores de estado (AWS Step Functions, Spring State Machine) implementan este patrón.

**Strategy**
- Ampliamente usado para variar comportamientos dentro de un servicio: diferentes algoritmos de cálculo de precios, distintas estrategias de envío, diferentes implementaciones de repositorio.
- También para elegir la implementación de un adaptador en tiempo de ejecución (por ejemplo, seleccionar el proveedor de pago según la moneda).

**Template Method**
- Aparece en frameworks internos de los servicios (por ejemplo, un `BaseController` que define el flujo de validación, autorización y ejecución).
- La inversión de control que promueve es similar a la que ofrecen los frameworks de microservicios (Spring Boot, Quarkus).

**Visitor**
- De uso limitado, salvo en servicios que manejan estructuras complejas (ASTs, documentos). En un entorno distribuido, las operaciones sobre una estructura suelen encapsularse en un servicio específico que ofrece una API declarativa.

## 5. Patrones específicos de microservicios y su relación con GoF

Aunque no son GoF, muchos patrones de microservicios heredan la esencia de los GoF:

- **API Gateway**: Facade + Proxy.
- **Saga**: Una secuencia de comandos (Command) con pasos compensables.
- **CQRS**: Command y Observer (eventos).
- **Event Sourcing**: Observer (publicación de eventos) + Memento (reconstrucción del estado).
- **Service Registry**: Singleton distribuido para localizar servicios.
- **Circuit Breaker**: Proxy con lógica de protección.

## 6. Conclusiones

- Los patrones creacionales y estructurales de grano fino (Builder, Factory, Adapter, Decorator) siguen siendo **herramientas cotidianas** en el desarrollo de microservicios.
- Los patrones de comportamiento que involucran comunicación entre objetos (Observer, Mediator, Chain of Responsibility) se elevan al **nivel de integración entre servicios** mediante mensajería asíncrona y buses de eventos.
- El patrón Singleton debe **restringirse al ámbito del proceso**; la unicidad global se logra con mecanismos de coordinación distribuida.
- La verdadera diferencia radica en que las "clases" ahora son servicios, y las "relaciones" son llamadas de red o mensajes, con todo lo que ello implica en latencia, fallos parciales y consistencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Visitor python](../03-comportamiento/11-visitor/ejemplos/03-visitor-python.md) | [🏠 Inicio](../index.md) | [Patrones en funcional ▶](02-patrones-en-funcional.md) |
