# Dobles de prueba

Los dobles de prueba son objetos que sustituyen a los componentes reales en un test. En la arquitectura hexagonal, se utilizan principalmente para **implementar puertos secundarios** en pruebas de servicios de aplicación y, a veces, para simular puertos primarios en tests de adaptadores. La correcta elección del tipo de doble es esencial para mantener la velocidad y el significado de cada test.

## Tipos de dobles (según la terminología de Meszaros)

### Dummy
Objeto que se pasa para cumplir con la firma pero nunca se usa realmente.
- Ejemplo: en un test unitario de una entidad que requiere un `ClienteId`, se crea `new ClienteId("dummy")` y no se interactúa con él.
- Poco relevante como implementación de puerto; más bien es un valor de apoyo.

### Stub
Proporciona respuestas predefinidas a las llamadas, sin lógica real. Ideal para puertos secundarios de consulta.
```java
public class RepositorioPedidosStub implements RepositorioPedidos {
    private Pedido pedidoARetornar;
    
    public void setPedidoARetornar(Pedido pedido) { this.pedidoARetornar = pedido; }

    @Override
    public Pedido buscarPorId(PedidoId id) {
        return pedidoARetornar;
    }
    // otros métodos...
}
```
Se utiliza cuando el comportamiento a verificar no depende de la interacción exacta, sino del dato devuelto.

### Mock
Objeto que registra las llamadas recibidas y permite verificar interacciones. Se emplea para puertos secundarios donde importa que se haya invocado un método con ciertos parámetros (por ejemplo, un `PublicadorDeEventos`).
```java
@Test
void alCrearPedidoSePublicaEvento() {
    PublicadorDeEventos mockPublicador = mock(PublicadorDeEventos.class);
    RepositorioPedidos repo = new RepositorioPedidosEnMemoria();
    PedidoApplicationService service = new PedidoApplicationService(repo, mockPublicador);

    service.crearPedido(comando);

    verify(mockPublicador).publicar(argThat(evento -> evento instanceof PedidoCreado));
}
```
Permite hacer aserciones sobre la colaboración, no sobre el estado.

### Fake
Implementación ligera pero funcional del puerto, a menudo con almacenamiento en memoria. Muy útil para repositorios.
```java
public class RepositorioPedidosEnMemoria implements RepositorioPedidos {
    private Map<PedidoId, Pedido> datos = new HashMap<>();

    @Override
    public void guardar(Pedido pedido) {
        datos.put(pedido.getId(), pedido);
    }
    @Override
    public Pedido buscarPorId(PedidoId id) {
        return datos.get(id);
    }
}
```
Un fake permite probar flujos completos sin configurar mocks complejos, y es reutilizable en múltiples tests.

### Spy
Envuelve un objeto real y registra las llamadas, delegando al real. Útil para verificar interacciones sin perder el comportamiento real. En hexagonal, se puede espiar un `PublicadorDeEventos` real para verificar que se llamó.

## Cuándo usar cada uno
- **Stubs/Fakes** para puertos de consulta o cuando necesitamos simular un estado sin preocuparnos por las interacciones.
- **Mocks** para puertos de comando o publicación, donde la interacción en sí es el resultado esperado.
- **Fakes** para repositorios, porque permiten escribir tests más legibles y sin configuraciones verbosas de mocks.
- En tests unitarios del dominio: ningún doble, porque el dominio es autocontenido.

## Dobles y contratos de puertos
Los dobles deben implementar el mismo puerto (interfaz) que el adaptador real. Así aseguramos que las pruebas del servicio de aplicación validan exactamente el mismo contrato que se usa en producción. Si el puerto cambia, los dobles también lo harán, manteniendo la coherencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tests de integración de adaptadores](02-tests-de-integracion-de-adaptadores.md) | [🏠 Inicio](../index.md) | [Tests de casos de uso ▶](04-tests-de-casos-de-uso.md) |
