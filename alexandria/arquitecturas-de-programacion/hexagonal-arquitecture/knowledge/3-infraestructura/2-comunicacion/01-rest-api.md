# REST API

## Rol en la arquitectura hexagonal
Un adaptador REST API es un **adaptador primario** que expone el sistema a través de HTTP. Convierte peticiones HTTP (GET, POST, PUT, DELETE) en comandos o consultas del dominio y las pasa al puerto primario correspondiente. Puede haber múltiples adaptadores REST (uno por cada versión de API, por ejemplo) compartiendo los mismos puertos.

## Estructura típica
```java
@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoRestController {
    private final GestionDePedidos gestionDePedidos; // Puerto primario

    // Inyección de dependencias del puerto primario (no de un servicio concreto)

    @PostMapping
    public ResponseEntity<PedidoIdDto> crear(@RequestBody CrearPedidoRequest request) {
        // 1. Traducir el DTO de entrada (DTO de transporte) a un comando del núcleo
        CrearPedidoComando comando = PedidoTransportMapper.aComando(request);
        // 2. Invocar el puerto primario
        PedidoId id = gestionDePedidos.crearPedido(comando);
        // 3. Construir respuesta HTTP a partir del valor de retorno del núcleo
        return ResponseEntity.status(HttpStatus.CREATED).body(new PedidoIdDto(id.getValor()));
    }
}
```

## Responsabilidades del adaptador
- **Parsing y validación de formato**: Interpretar JSON/XML, aplicar validaciones sintácticas con anotaciones ( `@Valid`, `@NotNull` ) para rechazar entradas mal formadas antes de tocar el núcleo.
- **Mapeo entre modelos de transporte y modelos del núcleo**: Los objetos de entrada/salida (DTOs) pertenecen a la infraestructura y nunca se filtran al dominio. Un mapper ( `PedidoTransportMapper` ) realiza la conversión. Así, si cambia el formato de la API, el dominio no se entera.
- **Gestión de HTTP**: Códigos de estado, cabeceras, negociación de contenido, HATEOAS si se desea. Toda esta semántica es externa al núcleo.
- **Manejo de seguridad**: Extraer tokens JWT, autenticar, autorizar, y posiblemente enriquecer el contexto (por ejemplo, añadir el `clienteId` al comando) antes de invocar el puerto. Esta seguridad vive en el adaptador o en un middleware.

## Puertos primarios y casos de uso
Cada endpoint se corresponde generalmente con un caso de uso. No debe haber lógica de negocio en el controlador: si la creación de un pedido requiere comprobar saldo, lo hace el servicio de aplicación, jamás el controlador. El controlador solo traduce y delega.

## Consideraciones adicionales
- **Versionado de API**: Se puede tener múltiples adaptadores REST (v1 y v2) que se conectan a los mismos puertos. Si un nuevo caso de uso requiere datos distintos, se crea un nuevo comando y un nuevo método en el puerto primario; los adaptadores lo utilizarán sin que el dominio se modifique.
- **Documentación (OpenAPI)**: Puede generarse a partir de los controladores, sin afectar al núcleo.
- **Pruebas**: Los controladores se prueban con tests de integración usando un puerto primario simulado (mock), verificando que las peticiones HTTP se traducen correctamente y que las respuestas se construyen bien. El dominio se prueba por separado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Mapeo objeto-relacional](../1-persistencia/03-mapeo-objeto-relacional.md) | [🏠 Inicio](../../index.md) | [GraphQL ▶](02-graphql.md) |
