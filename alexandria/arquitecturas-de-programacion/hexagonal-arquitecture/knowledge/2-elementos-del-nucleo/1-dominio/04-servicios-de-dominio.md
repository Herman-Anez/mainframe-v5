# Servicios de dominio

## Definición
Un servicio de dominio encapsula lógica de negocio que **no pertenece de manera natural a una entidad o value object concretos**. Suele implicar a varios agregados, realizar cálculos complejos o coordinar operaciones que no deberían estar en una sola entidad para no romper la responsabilidad única.

## Cuándo utilizarlos
- La operación afecta a varios agregados y no existe un lugar obvio para colocarla.
- La lógica es un cálculo o algoritmo significativo para el dominio y no es simplemente un acceso a datos.
- Poner la lógica en una entidad la acoplaría a servicios externos (incluso a puertos secundarios), cosa que no debe ocurrir; el servicio de dominio puede tener dependencias inyectadas, siempre y cuando sean interfaces definidas en el dominio.

## Características
- Son **stateless**: no mantienen estado propio, solo reciben parámetros y devuelven resultados.
- Viven dentro del núcleo del hexágono, al mismo nivel que las entidades.
- Pueden depender de interfaces de puertos secundarios (si la lógica lo requiere), pero nunca de adaptadores concretos.
- Nombrados con verbos significativos del lenguaje ubicuo: `CalculadorDeImpuestos`, `ProgramadorDeCitas`, `EvaluadorDeRiesgo`.

## Diferencia crucial con los Servicios de aplicación
- **Servicio de dominio**: contiene reglas de negocio puras (por ejemplo, cómo calcular un descuento según el historial del cliente).
- **Servicio de aplicación**: orquesta los pasos del caso de uso, carga agregados, llama a servicios de dominio y guarda resultados. No contiene lógica de negocio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Agregados](03-agregados.md) | [🏠 Inicio](../../index.md) | [Eventos de dominio ▶](05-eventos-de-dominio.md) |
