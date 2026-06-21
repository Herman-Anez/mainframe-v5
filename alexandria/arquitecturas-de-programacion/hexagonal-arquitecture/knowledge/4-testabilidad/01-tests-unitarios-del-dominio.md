# Tests unitarios del dominio

## Propósito
Verificar que las reglas de negocio, encapsuladas en entidades, value objects, agregados y servicios de dominio, se comportan exactamente como espera el experto del negocio. Estos tests no deben tener ninguna dependencia de infraestructura, bases de datos o frameworks. Son los más rápidos y numerosos del sistema.

## Características
- **Sin contexto externo**: No se levanta ningún contenedor, no se inyecta nada más que objetos del dominio. Si una entidad necesita un valor, se construye directamente.
- **Lenguaje ubicuo en los tests**: Los nombres de los tests describen comportamientos de negocio (`debeRechazarUnPedidoConImporteNegativo`, `debeCalcularDescuentoParaClientePremium`), no detalles técnicos.
- **Instanciación directa**: Se crean las entidades y value objects a mano, a menudo con constructores o factorías bien definidas. No se usan mocks porque el dominio puro no tiene dependencias externas. Si una entidad invoca un servicio de dominio, este puede ser una instancia real o un doble simple (pero se prefiere la colaboración real entre objetos del dominio).
- **Validación de invariantes**: Se prueban todas las reglas de negocio, transiciones de estado, excepciones de dominio y eventos generados.

## Ejemplo
```java
@Test
void unPedidoEnEstadoEnviadoNoPuedeCancelarse() {
    Pedido pedido = PedidoFactory.pedidoEnEstado(PedidoEstado.ENVIADO);
    
    assertThrows(OperacionNoPermitida.class, () -> pedido.cancelar());
}

@Test
void alCrearUnPedidoSeGeneraEventoPedidoCreado() {
    Pedido pedido = Pedido.crear(new ClienteId("C1"), lineasValidas());
    
    List<EventoDeDominio> eventos = pedido.obtenerEventos();
    assertThat(eventos).hasSize(1);
    assertThat(eventos.get(0)).isInstanceOf(PedidoCreado.class);
}

@Test
void sumarDosCantidadesEnDistintaMonedaLanzaExcepcion() {
    Dinero euros = new Dinero(new BigDecimal("10"), "EUR");
    Dinero dolares = new Dinero(new BigDecimal("10"), "USD");
    
    assertThrows(MonedaIncompatible.class, () -> euros.sumar(dolares));
}
```

## Estrategia
- **Un test por regla de negocio**: Cada invariante o comportamiento relevante tiene al menos un test.
- **Tests parametrizados** para value objects con validaciones (ej. emails inválidos).
- **Uso de builders/factorías de prueba** para crear agregados en estados concretos sin depender de repositorios.

El dominio se prueba tan exhaustivamente que, cuando un fallo ocurre en capas superiores, se puede descartar inmediatamente un error de lógica de negocio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Síntesis](../3-infraestructura/4-configuracion-y-cableado/11-sintesis.md) | [🏠 Inicio](../index.md) | [Tests de integración de adaptadores ▶](02-tests-de-integracion-de-adaptadores.md) |
