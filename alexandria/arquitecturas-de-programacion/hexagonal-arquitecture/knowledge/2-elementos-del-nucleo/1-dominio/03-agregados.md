# Agregados

## Definición
Un agregado es un conjunto de entidades y value objects tratados como una **unidad transaccional** coherente. Tiene una **raíz de agregado** (root) que es la única entidad a través de la cual el resto del sistema accede a sus componentes internos.

## Propósito
Garantizar la consistencia de las reglas de negocio que involucran a varios objetos. Todo cambio sobre el interior del agregado debe pasar por su raíz, que aplica las invariantes. Por ejemplo, en un `Pedido` (raíz) con `Líneas de pedido` (entidades internas), solo se puede añadir una línea si el pedido está en estado `Pendiente`.

## Características
- **Raíz del agregado**: Posee identidad global y es la responsable de la consistencia del conjunto.
- **Objetos internos**: Pueden ser entidades (con identidad local dentro del agregado) o value objects. No se pueden referenciar directamente desde fuera del agregado.
- **Transaccionalidad**: Un agregado completo se persiste y se carga como una unidad atómica desde el repositorio.
- **Referencias externas**: Otros agregados solo pueden hacer referencia a la raíz mediante su identificador, no mediante una referencia directa en memoria.

## Rol en la hexagonal
Los agregados definen las **fronteras de consistencia** que los puertos de repositorio respetan. Un `RepositorioPedidos` tiene métodos como `guardar(Pedido pedido)` y `buscarPorId(PedidoId id)`, devolviendo el agregado completo. Nunca expone métodos para persistir una línea de pedido suelta. Los servicios de aplicación cargan el agregado, llaman a su comportamiento y luego piden al repositorio que lo guarde entero. Esto mantiene al dominio encapsulado y consistente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Value Objects (Objetos de valor)](02-value-objects-objetos-de-valor.md) | [🏠 Inicio](../../index.md) | [Servicios de dominio ▶](04-servicios-de-dominio.md) |
