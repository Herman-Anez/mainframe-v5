# Pruebas y configuración de prueba

La raíz de composición también es crucial para tests. Se crean configuraciones específicas que ensamblan el sistema con dobles.

- **Tests unitarios de dominio**: No necesitan infraestructura; se instancian entidades directamente.
- **Tests de servicios de aplicación**: Se crea un contexto de prueba donde se inyectan mocks o stubs de los puertos secundarios.
- **Tests de integración de adaptadores**: Se puede usar una configuración que levante una base de datos real con Testcontainers, pero el núcleo se cablea igual.

Ejemplo de test con JUnit y Spring:
```java
@SpringBootTest
@TestPropertySource(properties = {"db.port=5433"})
class PedidoServiceTest {
    @MockBean RepositorioPedidos repo; // Sustituye el bean real por un mock
    @Autowired PedidoApplicationService service;
}
```

O manualmente:
```java
void testCrearPedido() {
    RepositorioPedidos repo = new RepositorioPedidosEnMemoria();
    PublicadorEventos pub = mock(PublicadorEventos.class);
    PedidoApplicationService service = new PedidoApplicationService(repo, pub);
    // ...
}
```

La posibilidad de ensamblar el sistema con cualquier combinación de adaptadores es la mayor ventaja de esta separación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Cableado en aplicaciones modulares (módulos de infraestructura)](08-cableado-en-aplicaciones-modulares-modulos-de-infraestructura.md) | [🏠 Inicio](../../index.md) | [Buenas prácticas y peligros ▶](10-buenas-practicas-y-peligros.md) |
