# Composition Root (Raíz de Composición)

En una aplicación real, la raíz de composición suele ser el método `main` o el equivalente del framework (por ejemplo, `SpringApplication.run()` en Spring Boot, el `bootstrap()` de NestJS, o el punto de entrada de un worker).

## Principios clave
- **Único lugar con conocimiento global**: Solo aquí se importan (o se instancian) clases concretas de infraestructura (repositorios Postgres, controladores REST, conexiones Kafka). El resto de módulos (dominio, aplicación) jamás importan infraestructura.
- **Construcción del grafo de objetos**: Crea la red de dependencias respetando los contratos (puertos). Si el servicio de aplicación `PedidoApplicationService` depende de las interfaces `RepositorioPedidos` y `PublicadorEventos`, la raíz de composición las resuelve con `RepositorioPedidosPostgres` y `KafkaPublicador`.
- **No lógica de negocio**: El cableado es puramente mecánico; no toma decisiones de negocio.

## Formas de implementación

### A) Cableado manual (Pure DI)
En aplicaciones pequeñas o donde se quiere evitar magia de frameworks, se instancian manualmente los objetos en orden.

```java
public class Main {
    public static void main(String[] args) {
        // 1. Cargar configuración
        Config config = Config.cargarDesdeEntorno();

        // 2. Adaptadores secundarios
        DataSource ds = crearPoolDeConexiones(config);
        RepositorioPedidos repoPedidos = new RepositorioPedidosPostgres(ds);
        PublicadorEventos publicador = new KafkaPublicador(config.getKafkaBroker());

        // 3. Servicios de aplicación (puertos primarios)
        PedidoApplicationService pedidoService = new PedidoApplicationService(repoPedidos, publicador);

        // 4. Adaptadores primarios
        HttpServer servidor = new HttpServer(config.getPuerto());
        servidor.addControlador(new PedidoRestController(pedidoService));

        // 5. Arranque
        servidor.iniciar();
    }
}
```

Este enfoque muestra explícitamente cómo todo depende de las interfaces y la composición resuelve lo concreto. Es transparente y testeable, pero en sistemas grandes puede volverse tedioso. Se puede estructurar con factorías o módulos de composición.

### B) Contenedor de Inyección de Dependencias (DI Container)
Los frameworks modernos (Spring, Guice, .NET Core DI, Tsyringe para TypeScript) automatizan la construcción del grafo a partir de registros.

Ejemplo con Spring Boot (Java):
```java
@Configuration
public class ConfiguracionCableado {

    @Bean
    public RepositorioPedidos repositorioPedidos(DataSource dataSource) {
        return new RepositorioPedidosPostgres(dataSource);
    }

    @Bean
    public PublicadorEventos publicadorEventos(KafkaTemplate<String, Object> kafka) {
        return new KafkaPublicador(kafka);
    }

    @Bean
    public PedidoApplicationService pedidoService(RepositorioPedidos repo, PublicadorEventos pub) {
        return new PedidoApplicationService(repo, pub);
    }

    // Los controladores REST son beans anotados con @RestController, que inyectan la interfaz
}
```
El núcleo permanece limpio porque las anotaciones `@Bean` y `@Configuration` están en infraestructura.

## La regla de dependencia en el cableado
Incluso en el cableado, el flujo de dependencias respeta el centro. Las clases de infraestructura dependen de los puertos (interfaces del núcleo). La configuración referencia tanto a las interfaces del núcleo como a las implementaciones concretas, pero el núcleo no referencia a la configuración. El contenedor DI es el que orquesta el acoplamiento en tiempo de ejecución.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Propósito y ubicación](01-proposito-y-ubicacion.md) | [🏠 Inicio](../../index.md) | [Configuración de adaptadores y parámetros de entorno ▶](03-configuracion-de-adaptadores-y-parametros-de-entorno.md) |
