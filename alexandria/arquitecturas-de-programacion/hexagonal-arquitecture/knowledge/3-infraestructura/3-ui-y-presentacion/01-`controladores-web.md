# `controladores web

## Rol en la arquitectura hexagonal

Un **controlador web** es un adaptador primario (Driving Adapter) que recibe peticiones HTTP (REST, GraphQL, etc.) y las traduce en invocaciones a los puertos primarios (casos de uso) del núcleo. Su misión es convertir el protocolo de transporte en comandos/consultas comprensibles por la aplicación, sin albergar lógica de negocio. El controlador vive en la capa de infraestructura y el núcleo nunca sabe de su existencia.

## Responsabilidades

- **Parseo de la petición**: Extraer parámetros de ruta, cabeceras, cuerpo y query string del mensaje HTTP.
- **Validación sintáctica**: Comprobar que los datos de entrada cumplen el formato esperado (tipos, obligatoriedad, longitud) usando anotaciones del framework o validadores manuales. Esta validación es superficial (no de reglas de negocio).
- **Mapeo a comandos/consultas**: Convertir los DTO de transporte (objetos planos con anotaciones de serialización) en objetos del núcleo (comandos, identificadores, value objects) mediante un **TransportMapper**.
- **Invocación del caso de uso**: Llamar al método correspondiente del puerto primario (interfaz `IGestionPedidos`, `RealizarPago`, etc.).
- **Construcción de la respuesta HTTP**: Mapear el resultado del caso de uso (otro DTO del núcleo o identificador) a un objeto de respuesta y serializarlo a JSON/XML, estableciendo el código de estado, cabeceras de caché, etc.
- **Manejo de errores**: Traducir las excepciones de dominio o aplicación a códigos de estado HTTP apropiados (400, 404, 409, 500) mediante un manejador centralizado o interceptores.

## Principios de diseño

- **Thin Controller**: El controlador no debe contener lógica de negocio, solo orquestación de la traducción. Si una validación requiere reglas de negocio, se debe delegar al dominio.
- **Independencia del framework**: Aunque se use Spring, Express o ASP.NET, la estructura del controlador debe poder migrarse a otro framework sin reescribir el núcleo. Las anotaciones propias del framework se quedan en esta capa.
- **Un caso de uso por ruta** (idealmente): Cada endpoint del controlador se corresponde con un caso de uso atómico. Evitar controladores con múltiples responsabilidades.
- **Mapeo separado**: El `TransportMapper` es una clase aislada que transforma DTOs de transporte ↔ objetos del núcleo. De esta forma, los cambios en el formato de la API no afectan al dominio.

## Ejemplo con Spring Boot (Java)

```java
@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final IGestionPedidos gestionPedidos; // Puerto primario
    private final PedidoTransportMapper transportMapper;

    public PedidoController(IGestionPedidos gestionPedidos, PedidoTransportMapper transportMapper) {
        this.gestionPedidos = gestionPedidos;
        this.transportMapper = transportMapper;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@Valid @RequestBody CrearPedidoRequest request) {
        // 1. Validación sintáctica realizada por @Valid
        // 2. Mapeo de DTO de transporte a Comando del núcleo
        CrearPedidoCommand comando = transportMapper.aComando(request);
        // 3. Invocar caso de uso
        PedidoId id = gestionPedidos.crearPedido(comando);
        // 4. Construir respuesta
        PedidoResponse response = new PedidoResponse(id.getValor());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler({PedidoNoEncontradoException.class})
    public ResponseEntity<ErrorResponse> handleNotFound(PedidoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }
}
```

El `PedidoTransportMapper` contiene la conversión:

```java
public class PedidoTransportMapper {
    public CrearPedidoCommand aComando(CrearPedidoRequest request) {
        List<SolicitudLinea> lineas = request.getLineas().stream()
            .map(l -> new SolicitudLinea(
                new ProductoId(l.getProductoId()),
                l.getCantidad(),
                new Dinero(l.getPrecioUnitario(), l.getMoneda())
            )).collect(Collectors.toList());
        return new CrearPedidoCommand(new ClienteId(request.getClienteId()), lineas);
    }
}
```

## Ejemplo con Node.js/Express

```javascript
// controlador como función que retorna un router
import { Router } from 'express';
import { gestionPedidos } from '../dependencias.js'; // Puerto primario
import { transportMapper } from '../mappers/pedidoTransportMapper.js';

export function crearPedidoRouter() {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const comando = transportMapper.aComando(req.body);
      const id = await gestionPedidos.crearPedido(comando);
      res.status(201).json({ id: id.valor });
    } catch (error) {
      // Mapeo de errores de dominio a HTTP
      if (error.code === 'PEDIDO_NO_ENCONTRADO') {
        res.status(404).json({ mensaje: error.message });
      } else {
        res.status(500).json({ mensaje: 'Error interno' });
      }
    }
  });

  return router;
}
```

## Ejemplo con ASP.NET Core (C#)

```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IGestionPedidos _gestionPedidos;
    private readonly PedidoTransportMapper _mapper;

    public PedidosController(IGestionPedidos gestionPedidos, PedidoTransportMapper mapper)
    {
        _gestionPedidos = gestionPedidos;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoResponse>> Crear([FromBody] CrearPedidoRequest request)
    {
        var comando = _mapper.AComando(request);
        var id = await _gestionPedidos.CrearPedidoAsync(comando);
        return CreatedAtAction(nameof(Crear), new { id = id.Valor }, new PedidoResponse { Id = id.Valor });
    }
}
```

## Estrategia de testing

- **Test unitario del controlador**: Se mockea el puerto primario (`IGestionPedidos`) y se usa un cliente HTTP en memoria (MockMvc, Supertest, TestServer). Se verifica que la petición se traduce correctamente, que el caso de uso se invoca con los parámetros adecuados y que la respuesta HTTP es la esperada. No se prueba lógica de negocio.
- **Test de integración del adaptador**: Se levanta el servidor con el puerto primario mockeado para probar serialización/deserialización, filtros de seguridad y manejo de excepciones.

```java
@WebMvcTest(PedidoController.class)
class PedidoControllerTest {
    @MockBean IGestionPedidos gestionPedidos;
    @Autowired MockMvc mockMvc;

    @Test
    void crearPedido_retornaCreated() throws Exception {
        when(gestionPedidos.crearPedido(any())).thenReturn(new PedidoId("123"));
        mockMvc.perform(post("/api/v1/pedidos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"clienteId\":\"C1\",\"lineas\":[]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("123"));
    }
}
```

## Buenas prácticas

- **Mantener el controlador libre de lógica de negocio**: si un `if` empieza a evaluar reglas de dominio, debe moverse al dominio o al servicio de aplicación.
- **Centralizar el manejo de excepciones**: usar `@ControllerAdvice` (Spring), middleware de errores (Express) o `IExceptionFilter` (ASP.NET) para mapear excepciones de dominio a HTTP, manteniendo los controladores limpios.
- **Utilizar DTOs de transporte separados**: `CrearPedidoRequest` y `PedidoResponse` son clases específicas de la API. Pueden cambiar sin afectar al núcleo.
- **Versionado de API**: Crear nuevos controladores para nuevas versiones (`/api/v2/...`) que reutilicen los mismos puertos primarios (o nuevos si el caso de uso cambia), demostrando la flexibilidad de la arquitectura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Síntesis de la capa de comunicación en la hexagonal](../2-comunicacion/06-sintesis-de-la-capa-de-comunicacion-en-la-hexagonal.md) | [🏠 Inicio](../../index.md) | [`interfaces de linea de comandos ▶](02-`interfaces-de-linea-de-comandos.md) |
