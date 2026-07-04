# Fabricas

## Fábricas y creación de agregados

Una fábrica encapsula la complejidad de crear un agregado que requiere validaciones, generación de IDs, obtención de datos de otros servicios, etc. La fábrica entrega un agregado listo y válido, que puede guardarse directamente.

## Cuándo usar fábricas vs. constructores

- **Constructor:** cuando la creación es simple, todos los datos necesarios se pasan directamente y no hay dependencias externas.
- **Factory Method (estático):** cuando la construcción requiere algún cálculo o validación simple que puede estar en la propia clase (ej. `Dinero.deEuros(String cantidad)`).
- **Factory Class (clase separada):** cuando la creación necesita colaboradores externos (repositorios, servicios de dominio) o cuando hay múltiples formas de crear el mismo agregado con lógicas diferentes.

## Ubicación en la arquitectura

La interfaz de la fábrica se sitúa en el dominio (si se inyecta) o en la capa de aplicación si se instancia directamente en el servicio de aplicación. La implementación con dependencias de infraestructura (por ejemplo, un generador de IDs que consulta una secuencia de BD) irá en infraestructura, implementando una interfaz definida en dominio.

```java
// Interfaz en dominio
public interface PedidoFactory {
    Pedido crear(ClienteId cliente, List<LineaPedidoData> lineas);
}

// Implementación en infraestructura (o en dominio si no tiene dependencias externas)
public class PedidoFactoryImpl implements PedidoFactory {
    private final PrecioService precioService; // puerto
    ...
}
```

## Fábricas y eventos de dominio

Si la creación del agregado produce eventos de dominio (ej. `PedidoCreado`), la fábrica puede añadirlos a la lista de eventos del agregado. El despacho se hará en la capa de aplicación tras guardar.

## Comparación con el patrón Builder

El patrón Builder es útil para construir objetos complejos paso a paso. En DDD, puede usarse para value objects compuestos o para construir agregados cuando se necesitan múltiples pasos con validaciones intermedias. El Builder entrega un producto inmutable al final (para VOs) o una entidad consistente. Se puede combinar con una fábrica.

## Anti-patrones

- **Fábrica que se convierte en un servicio anémico:** si la fábrica hace todo el trabajo y el agregado resultante no tiene comportamiento, se ha vaciado al agregado.
- **Uso de fábricas para objetos triviales:** sobre-ingeniería.
- **Fábrica en la capa de infraestructura con reglas de negocio:** debe estar en dominio o aplicación; la infraestructura solo implementa puertos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Repositorios](05-repositorios.md) | [🏠 Inicio](../index.md) | [Eventos de dominio ▶](07-eventos-de-dominio.md) |
