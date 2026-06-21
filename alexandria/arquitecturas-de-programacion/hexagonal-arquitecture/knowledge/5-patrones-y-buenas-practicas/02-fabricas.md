# Fábricas

## Definición
Una fábrica es un patrón de creación que encapsula la lógica de construcción de objetos complejos, típicamente agregados o value objects, cuando esa construcción involucra reglas de dominio, validaciones o la generación de identificadores. Separa la *creación* del *uso*.

En el contexto de la arquitectura hexagonal, las fábricas pueden vivir tanto en el dominio como en la aplicación.

## Tipos de fábricas

### Fábricas de dominio (Domain Factories)
Residen en el núcleo y contienen lógica de creación que pertenece al negocio. Por ejemplo, la creación de un `Pedido` puede implicar calcular un número de pedido, aplicar reglas de descuento iniciales, o inicializar una colección de líneas.

Pueden ser métodos estáticos en la propia entidad ( `Pedido.crear(...)` ) si la complejidad es baja, o clases separadas si la creación depende de servicios de dominio o es muy elaborada.

```java
public class PedidoFactory {
    private final CalculadorDeImpuestos calculador;

    public Pedido crearPedido(Cliente cliente, List<SolicitudLinea> lineas) {
        // Reglas de dominio durante la creación
        if (cliente.estaBloqueado()) throw new ClienteBloqueadoException();
        Pedido pedido = new Pedido(new PedidoId(UUID.randomUUID()), cliente.getId());
        for (SolicitudLinea sl : lineas) {
            Impuesto impuesto = calculador.calcular(sl.producto(), cliente);
            pedido.agregarLinea(sl.producto(), sl.cantidad(), impuesto);
        }
        return pedido;
    }
}
```
La fábrica puede depender de interfaces de puertos secundarios ( `CalculadorDeImpuestos` ) y residir en el dominio. El servicio de aplicación la usa para construir el agregado inicial.

### Fábricas en la capa de aplicación
Se usan para construir comandos, DTOs o para convertir datos externos en objetos de dominio. A menudo son simples mappers que no contienen reglas de negocio, solo traducción. Son parte de la orquestación y viven cerca de los servicios de aplicación.

## Mejores prácticas
- **No usar fábricas para ocultar invariantes simples**: si un objeto se puede construir con un constructor y validaciones en el propio constructor (como value objects), no es necesaria una fábrica.
- **Las fábricas no deben reemplazar al constructor por capricho**: solo cuando la creación involucra lógica adicional o dependencias.
- **Inyección de dependencias**: si una fábrica de dominio necesita un servicio (ej. generador de identificadores), se inyecta por constructor y se registra en el contenedor DI. El dominio define la interfaz del generador de identificadores (puerto secundario).
- **Evitar que las fábricas se conviertan en cajones de sastre**: deben tener una única responsabilidad: crear un tipo de objeto, completo y consistente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Patrón repositorio](01-patron-repositorio.md) | [🏠 Inicio](../index.md) | [Políticas y especificaciones ▶](03-politicas-y-especificaciones.md) |
