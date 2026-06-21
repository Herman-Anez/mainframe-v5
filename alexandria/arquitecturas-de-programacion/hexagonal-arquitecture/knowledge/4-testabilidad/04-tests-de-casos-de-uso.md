# Tests de casos de uso

## Propósito
Verificar el comportamiento de un servicio de aplicación al orquestar un caso de uso completo, **con todos los puertos secundarios reemplazados por dobles**. Se prueban las reglas de coordinación, el flujo de trabajo, la demarcación transaccional conceptual y la secuencia de llamadas a los puertos. No se prueba la lógica de negocio (eso ya se cubrió en el dominio) ni la integración con infraestructura real (eso en tests de integración de adaptadores).

Estos tests son de alto valor porque validan que el sistema responde correctamente ante distintos escenarios combinando el dominio y las dependencias externas simuladas.

## Características
- **Aislamiento del dominio**: Se instancian los servicios de aplicación inyectando fakes, stubs o mocks de los puertos secundarios.
- **Cada test cubre un camino del caso de uso** (éxito, error por regla de negocio, error técnico).
- **Se parte de un estado conocido**: los fakes de repositorios se precargan con datos; los stubs devuelven valores esperados.
- **Se verifican resultados**: se comprueba el valor de retorno, los cambios en el repositorio fake, y que se hayan invocado los puertos esperados (publicación de eventos, llamadas a servicios externos).

## Ejemplo con fake de repositorio y mock de publicador
```java
@Test
void crearPedidoExitoso() {
    // Configuración de dobles
    RepositorioPedidos repo = new RepositorioPedidosEnMemoria();
    PublicadorDeEventos publicador = mock(PublicadorDeEventos.class);
    PedidoApplicationService service = new PedidoApplicationService(repo, publicador);

    CrearPedidoComando comando = new CrearPedidoComando(new ClienteId("C1"), lineasValidas());
    PedidoId id = service.crearPedido(comando);

    // Verificar que se guardó en el repositorio
    Pedido guardado = repo.buscarPorId(id);
    assertThat(guardado).isNotNull();
    assertThat(guardado.getClienteId().getValor()).isEqualTo("C1");

    // Verificar que se publicó el evento de dominio
    verify(publicador).publicar(any(PedidoCreado.class));
}
```

## Manejo de escenarios de error
```java
@Test
void crearPedidoConClienteInactivoLanzaExcepcion() {
    // Stub del servicio de dominio externo (puerto secundario)
    ServicioDeClientes clientesStub = new ServicioDeClientesStub();
    clientesStub.configurarClienteInactivo(new ClienteId("C1"));

    PedidoApplicationService service = new PedidoApplicationService(repo, publicador, clientesStub);

    assertThrows(ClienteInactivoException.class, () -> service.crearPedido(comandoClienteInactivo));
}
```
Aquí se simula un puerto secundario que consulta un servicio externo. El test valida que el servicio de aplicación lanza la excepción adecuada, sin necesidad de levantar una API real.

## Pruebas de integración de casos de uso con infraestructura controlada
En ocasiones, se combinan el test de caso de uso y el de integración de adaptadores levantando una base de datos real pero manteniendo otros adaptadores doblados. Esto se conoce como test de integración de alcance medio. Es válido si se quiere validar todo el camino incluyendo la persistencia, pero se debe cuidar la velocidad.

La decisión de qué nivel de integración probar depende del balance velocidad/confianza:
- Los tests puros de casos de uso con dobles son **rápidos y fiables**.
- Los tests de integración de adaptadores dan confianza sobre la tecnología real.
- No se debe probar la misma lógica en ambos lados; cada tipo de test tiene su propósito.

## Estrategia de pirámide de tests
En una aplicación hexagonal, la pirámide de tests se materializa de forma natural:
- **Muchos tests unitarios del dominio** (rápidos, sin infraestructura).
- **Menos tests de servicios de aplicación** (coordinación con dobles).
- **Tests de integración de adaptadores** para los puntos de contacto con el exterior (HTTP, DB, mensajería).
- **Unos pocos tests end-to-end** que recorran todo el sistema con la configuración real, para verificar que el cableado y la configuración funcionan correctamente. Estos últimos no prueban lógica de negocio, sino el ensamblaje.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Dobles de prueba](03-dobles-de-prueba.md) | [🏠 Inicio](../index.md) | [Síntesis de testabilidad en arquitectura hexagonal ▶](05-sintesis-de-testabilidad-en-arquitectura-hexagonal.md) |
