# Value Objects (Objetos de valor)

## Definición
Un value object describe una característica del dominio que carece de identidad conceptual. Se define completamente por el valor de sus atributos. Dos value objects son iguales si todos sus componentes internos son iguales.

## Propiedades fundamentales
- **Inmutabilidad**: Una vez creado, no puede modificarse. Cualquier cambio implica la creación de una nueva instancia con el valor deseado. Esto evita efectos colaterales y facilita el razonamiento.
- **Autovalidación**: Un value object se construye garantizando que sus datos cumplen las reglas de negocio (por ejemplo, un `Email` se construye solo si el texto tiene formato válido).
- **Sin identidad**: No poseen un campo `id` ni son rastreables individualmente. Se sustituyen por completo.
- **Operaciones de dominio**: Pueden contener comportamiento, como `dinero.sumar(otroDinero)` o `direccion.formatoEtiqueta()`. Encapsulan mini-reglas.

## Ejemplos clásicos
- `Dirección` (calle, número, código postal, ciudad).
- `Dinero` (cantidad y moneda).
- `Email`, `NúmeroDeTeléfono`.
- `Periodo` (fecha inicio y fecha fin).

## Relación con la arquitectura hexagonal
Los value objects son un escudo de integridad. Al ser inmutables, evitan que el código de infraestructura modifique accidentalmente datos del dominio. Son pasados a través de los puertos sin riesgo de corrupción. Además, ayudan a mantener el lenguaje ubicuo: `Pedido.montoTotal` es un `Dinero`, no un `BigDecimal` suelto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Entidades](01-entidades.md) | [🏠 Inicio](../../index.md) | [Agregados ▶](03-agregados.md) |
