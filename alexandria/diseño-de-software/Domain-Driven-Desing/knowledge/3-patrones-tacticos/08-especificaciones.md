# Especificaciones

## Especificación como patrón de validación y consulta

Una especificación es un objeto que encapsula un criterio de negocio y puede evaluarse contra un candidato. Es reutilizable, combinable y nombrada con lenguaje ubicuo.

## Implementación clásica

```java
public interface Specification<T> {
    boolean isSatisfiedBy(T candidate);
    Specification<T> and(Specification<T> other);
    Specification<T> or(Specification<T> other);
    Specification<T> not();
}
```

Las implementaciones concretas (como `ClienteConCreditoSuficiente`) se pueden componer:

```java
Specification<Cliente> clienteVip = new ClienteConCreditoMinimo(minimo).and(new ClienteActivo());
boolean elegible = clienteVip.isSatisfiedBy(cliente);
```

## Uso en repositorios para consultas

La misma especificación puede traducirse a una consulta de base de datos. En JPA se puede usar el metamodelo JPA Criteria; en EF Core se pueden construir `Expression<Func<T, bool>>` a partir de la especificación.

Se separa la interfaz de especificación (dominio) de la implementación de la traducción (infraestructura). Por ejemplo, se puede crear una clase `EspecificacionJpa<T>` que implementa `Specification<T>` y además expone un método `toPredicate`, usado por el repositorio.

Algunos frameworks (Spring Data, Hibernate) ofrecen soporte nativo para especificaciones.

## Especificaciones para validación en comandos

Antes de ejecutar un comando, la capa de aplicación puede usar especificaciones para validar precondiciones sin cargar el agregado completo, si la especificación puede traducirse a una consulta eficiente de existencia o conteo.

## Cuándo no usar especificaciones

- Reglas simples que solo se usan en un lugar.
- Lógica que es invariante pura del agregado: mejor dentro del método del agregado.

## Especificaciones compuestas y DSL interno

Mediante métodos estáticos y combinaciones, se puede crear un pequeño DSL:

```java
PedidoSpecification.borrador().and(PedidoSpecification.conPrioridad(Alta))
```

Esto facilita la lectura y el mantenimiento.

## Anti-patrones

- **Especificaciones que dependen de infraestructura:** si una especificación necesita hacer una consulta a BD para evaluar `isSatisfiedBy`, se debe inyectar un repositorio, pero esto puede convertir la especificación en un servicio. Se prefiere mantenerlas puras y, si se necesita acceso a datos, usar un servicio de dominio.
- **Especificaciones anémicas:** que solo envuelven una condición simple sin valor expresivo.

---

Cada uno de estos archivos ampliados proporciona una cobertura completa y profunda de los patrones tácticos de DDD, permitiendo a los desarrolladores aplicarlos con rigor y confianza.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Eventos de dominio](07-eventos-de-dominio.md) | [🏠 Inicio](../index.md) | [Concepto agregado ▶](agregados/01-concepto-agregado.md) |
