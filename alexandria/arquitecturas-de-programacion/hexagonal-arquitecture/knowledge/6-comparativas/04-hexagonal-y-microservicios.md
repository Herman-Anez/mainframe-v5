# Hexagonal y microservicios

## Relación natural
La arquitectura hexagonal y los microservicios se complementan de forma poderosa. Un microservicio bien diseñado suele adoptar internamente una arquitectura hexagonal (o Clean/Onion) para mantener su autonomía y capacidad de cambio independiente.

## ¿Cómo se aplica la hexagonal en un microservicio?
Cada microservicio se modela como un **hexágono independiente**:
- Tiene su propio dominio, sus propios puertos (API, mensajería) y sus propios adaptadores (base de datos, clientes HTTP hacia otros servicios).
- Los microservicios se comunican entre sí a través de adaptadores primarios (API REST, gRPC, eventos) que invocan puertos primarios, o mediante puertos secundarios que llaman a otros servicios.
- La hexagonal garantiza que la lógica interna del microservicio no se acople a la tecnología de comunicación ni a las bases de datos compartidas.

## Hexagonal como habilitadora de microservicios
La separación estricta entre dominio e infraestructura permite:
- **Extraer microservicios de un monolito**: si el dominio está aislado, cortar un módulo y desplegarlo por separado es más sencillo porque no hay enredos con la persistencia compartida.
- **Cambiar la forma de comunicación entre servicios**: un microservicio que expone casos de uso mediante REST puede pasar a exponerlos mediante mensajería solo añadiendo un nuevo adaptador; el dominio no cambia.
- **Probar cada microservicio de forma aislada**: los tests de dominio no necesitan levantar otros servicios, y los adaptadores se simulan fácilmente.

## Patrones de comunicación entre microservicios en hexagonal
- **Síncrono**: un microservicio A necesita datos de B. A define un puerto secundario `ServicioClientes`; su adaptador implementa una llamada HTTP/gRPC a B. B expone un puerto primario `GestionDeClientes` con un adaptador REST. Todo desacoplado.
- **Asíncrono (eventos)**: A publica eventos de dominio a través de un puerto secundario `PublicadorEventos`. B tiene un adaptador primario (consumidor de eventos) que recibe el evento y llama a su puerto primario correspondiente. Ninguno conoce al otro directamente; solo comparten la definición del evento.
- **Orquestación/Sagas**: un servicio de aplicación en un microservicio puede emitir un comando y esperar eventos de confirmación. La lógica de la saga es un flujo de caso de uso que involucra adaptadores de mensajería.

## Hexagonal vs. bases de datos compartidas
Un antipatrón en microservicios es compartir base de datos. La hexagonal refuerza el encapsulamiento porque el repositorio es un adaptador del microservicio; el dominio solo ve la interfaz. Esto desalienta que otro microservicio acceda directamente a los datos, porque la lógica de negocio que protege los datos está encapsulada en el agregado.

## Advertencia: no confundir hexagonal con microservicios
La hexagonal es un patrón de arquitectura interna de un componente (monolito o microservicio). No es una topología de sistema distribuido. Un monolito hexagonal puede ser perfectamente válido y, si se decide partir, los módulos del monolito ya contienen hexágonos aislados listos para convertirse en microservicios.

## Conclusión
La hexagonal proporciona la disciplina interna que los microservicios necesitan para ser realmente autónomos. Con la hexagonal, un microservicio es dueño de su lógica y de sus contratos de entrada/salida. La combinación de ambas ideas da lugar a sistemas distribuidos robustos, mantenibles y con ciclos de cambio independientes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hexagonal vs. Clean Architecture (Arquitectura Limpia)](03-hexagonal-vs-clean-architecture-arquitectura-limpia.md) | [🏠 Inicio](../index.md) | [Síntesis transversal ▶](05-sintesis-transversal.md) |
