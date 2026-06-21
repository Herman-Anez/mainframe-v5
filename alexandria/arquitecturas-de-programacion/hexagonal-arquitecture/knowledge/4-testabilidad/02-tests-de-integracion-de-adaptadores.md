# Tests de integración de adaptadores

## Propósito
Comprobar que un adaptador concreto (secundario o primario) funciona correctamente contra la tecnología real que abstrae. Por ejemplo, verificar que `RepositorioPedidosPostgres` es capaz de guardar y recuperar un agregado usando una base de datos PostgreSQL real, o que `PedidoRestController` responde adecuadamente a peticiones HTTP.

Estos tests se centran en la **traducción** y la **comunicación** con el exterior. No evalúan lógica de negocio (eso ya se hizo en el dominio), sino que la tecnología enchufable cumple el contrato del puerto.

## Adaptadores secundarios (Driven Adapters)

### Repositorios SQL/NoSQL
- Se levanta una instancia real de la base de datos (puede ser con Testcontainers, una base de datos embebida o un servicio de CI).
- Se prueba el contrato completo del repositorio: guardar, buscar por ID, consultas complejas.
- Se verifica que el mapeo entre el modelo de persistencia y el dominio es correcto y que las invariantes del agregado se respetan (por ejemplo, que al leer un pedido, se reconstruye con todas sus líneas).
- No se prueba la lógica de negocio; se parte de un agregado construido por el dominio y se comprueba que tras persistirlo y leerlo es equivalente.

```java
@Testcontainers
class RepositorioPedidosPostgresTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    private RepositorioPedidosPostgres repositorio;

    @BeforeEach
    void setUp() {
        DataSource ds = /* crear con datos del contenedor */;
        repositorio = new RepositorioPedidosPostgres(ds);
        // Ejecutar migraciones (Flyway/Liquibase) para crear esquema
    }

    @Test
    void guardarYRecuperarPedido() {
        Pedido pedido = PedidoFactory.pedidoValido();
        repositorio.guardar(pedido);

        Pedido recuperado = repositorio.buscarPorId(pedido.getId());
        
        assertThat(recuperado).isEqualTo(pedido); // igualdad basada en identidad y valor
        assertThat(recuperado.getLineas()).hasSize(pedido.getLineas().size());
    }
}
```

### Clientes HTTP / Publicadores de mensajes
- Se puede usar un servidor mock (WireMock para HTTP) o un broker embebido (Kafka embebido, RabbitMQ en Testcontainers).
- Se prueba que el adaptador envía la petición correcta y sabe interpretar la respuesta. Para un publicador de eventos, se verifica que el mensaje llega al tópico con el formato adecuado.
- Se comprueba el manejo de errores (timeouts, respuestas inesperadas, reintentos) si el adaptador incluye esa lógica.

## Adaptadores primarios (Driving Adapters)

### Controladores REST / gRPC / Consumidores de mensajes
- Se levanta el contexto web completo (Spring MockMvc, WebTestClient) o se arranca el servidor embebido.
- Se simula el puerto primario con un mock (se usa un doble del servicio de aplicación) para no ejecutar lógica de negocio real. El foco es la traducción de HTTP a comandos y la construcción de respuestas.
- Se prueba que las validaciones de entrada funcionan, los códigos de estado son correctos y los cuerpos de respuesta se formatean bien.
- Para un consumidor de mensajes, se envía un mensaje a la cola y se verifica que el adaptador invoca el puerto primario con el comando correcto.

```java
@WebMvcTest(PedidoRestController.class)
class PedidoRestControllerTest {
    @MockBean
    private GestionDePedidos gestionDePedidos; // Puerto primario mockeado

    @Autowired
    private MockMvc mockMvc;

    @Test
    void crearPedidoRetornaCreated() throws Exception {
        when(gestionDePedidos.crearPedido(any())).thenReturn(new PedidoId("123"));

        mockMvc.perform(post("/api/v1/pedidos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"clienteId\":\"C1\", \"lineas\":[...]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("123"));
    }
}
```

La clave es que estos tests integran solo la capa de infraestructura contra la tecnología real, manteniendo el dominio completamente aislado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tests unitarios del dominio](01-tests-unitarios-del-dominio.md) | [🏠 Inicio](../index.md) | [Dobles de prueba ▶](03-dobles-de-prueba.md) |
