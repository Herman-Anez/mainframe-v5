# Clientes HTTP

## Rol en la arquitectura hexagonal
Un cliente HTTP es un **adaptador secundario** que implementa un puerto definido por el dominio para comunicarse con un sistema externo a través de HTTP. Actúa como capa anticorrupción, traduciendo las llamadas al API externa al lenguaje del dominio.

## Ejemplo
El dominio necesita consultar el catálogo de productos de un servicio externo. Define un puerto secundario:

```java
// Puerto secundario (en el núcleo)
public interface CatalogoProductos {
    Optional<Producto> obtenerProducto(ProductoId id);
}
```

El adaptador secundario realiza la petición HTTP:

```java
public class CatalogoProductosHttp implements CatalogoProductos {
    private final RestTemplate restTemplate;
    private final String baseUrl;

    @Override
    public Optional<Producto> obtenerProducto(ProductoId id) {
        ProductoExternoDto dto = restTemplate.getForObject(baseUrl + "/productos/" + id.getValor(), ProductoExternoDto.class);
        if (dto == null) return Optional.empty();
        // Mapear desde el modelo externo al modelo de dominio (Producto value object)
        Producto producto = ProductoMapper.desdeExterno(dto);
        return Optional.of(producto);
    }
}
```

## Características
- **Inversión de dependencia**: El núcleo define `CatalogoProductos`; el adaptador HTTP depende de esta interfaz y la implementa. En tiempo de ejecución, el servicio de aplicación recibe una instancia de `CatalogoProductosHttp` sin saberlo.
- **Manejo de fallos**: Timeouts, reintentos, circuit breakers (Resilience4j, Hystrix) se configuran en el adaptador, nunca en el dominio. El puerto secundario puede definir excepciones de dominio ( `ProductoNoEncontrado`, `ServicioCatalogoNoDisponible` ) que el adaptador lanza tras interpretar la respuesta HTTP.
- **Autenticación y cabeceras**: Toda la gestión de tokens, headers HTTP, etc. ocurre en el adaptador. El dominio solo ve una operación `obtenerProducto`.
- **Anticorrupción**: El modelo externo (JSON del API) rara vez coincide con el modelo de dominio. El adaptador actúa como capa anticorrupción transformando ambos lados. Si el servicio externo cambia su formato, solo se modifica el mapper dentro del adaptador.

## Variantes
- Clientes REST (RestTemplate, WebClient, Feign).
- Clientes SOAP.
- Clientes gRPC (cuando nuestra aplicación consume un servicio gRPC externo). En ese caso, el adaptador implementa el puerto secundario y usa un stub generado.

## Importancia para el dominio
El dominio puede usar `CatalogoProductos` en sus servicios de aplicación o incluso en servicios de dominio, sin saber si los datos vienen de una API HTTP, un archivo CSV o una base de datos local. Esto permite cambiar la fuente de datos sin impacto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mensajería](04-mensajeria.md) | [🏠 Inicio](../../index.md) | [Síntesis de la capa de comunicación en la hexagonal ▶](06-sintesis-de-la-capa-de-comunicacion-en-la-hexagonal.md) |
