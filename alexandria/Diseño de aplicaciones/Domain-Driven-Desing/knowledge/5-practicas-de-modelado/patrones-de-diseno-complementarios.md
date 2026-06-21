# Patrones de diseno complementarios

En DDD, los patrones del libro de *Design Patterns* (GoF) y otros patrones de software se utilizan como herramientas de implementación dentro del modelo de dominio, siempre que sirvan para expresar conceptos de negocio sin introducir complejidad accidental. No se aplican por sí mismos, sino como vehículo para un supple design.

## Strategy (Estrategia)
Permite encapsular diferentes algoritmos o reglas de negocio intercambiables. En el dominio, es ideal para políticas que varían según el contexto.
- **Ejemplo:** cálculo de impuestos según el país. La entidad `Factura` puede tener una referencia a una interfaz `EstrategiaImpuesto` (definida como puerto de dominio) y la infraestructura inyecta la implementación adecuada. Así el dominio permanece puro.
- La variante DDD es nombrar la estrategia con el lenguaje ubicuo: `PoliticaImpuestoUE`, `PoliticaImpuestoLatam`.

## Composite (Compuesto)
Útil para modelar jerarquías parte-todo donde el todo y las partes comparten una interfaz común. En el dominio, puede representar estructuras como un organigrama de grupos y subgrupos, o un catálogo de productos con categorías y subcategorías. La interfaz común permite aplicar operaciones de manera recursiva.
- **Ejemplo:** `CategoriaProducto` puede ser compuesta de otras categorías o de productos finales. El método `obtenerProductos()` se implementa recursivamente.

## Decorator (Decorador)
Añade comportamiento a un objeto sin modificar su estructura. En DDD se puede usar para agregar capacidades transversales que no forman parte del núcleo de la entidad, pero que el dominio necesita expresar.
- **Ejemplo:** un `Cliente` base, y decoradores `ClienteVIP` que extienden el comportamiento de descuentos. Sin embargo, hay que tener cuidado de no romper la identidad; muchas veces es preferible usar composición o políticas en lugar de decoradores que oculten la entidad original.

## Factory Method y Abstract Factory (ya tratados en fábricas)
Son esenciales en DDD para construir agregados complejos. Se aplican como patrón de creación dentro del dominio.

## Observer / Publisher-Subscriber
En DDD se implementa mediante **Eventos de Dominio**. El agregado actúa como publicador, y los manejadores de eventos como observadores. El patrón original se transforma en un bus de eventos desacoplado que puede ser síncrono (dentro del mismo proceso) o asíncrono (entre contextos). El objetivo es el desacoplamiento sin perder la intención de negocio.

## Memento (Recuerdo)
Se puede aplicar para tomar snapshots del estado de un agregado en Event Sourcing, aunque normalmente el propio event store cumple ese rol. No es un patrón de uso diario en el dominio, pero su concepto subyace en la serialización de eventos.

## Repository (Repositorio) – patrón táctico DDD
Aunque es un patrón táctico propio de DDD, tiene su origen en el patrón Repository de Fowler. La diferencia es que en DDD el repositorio se enfoca exclusivamente en raíces de agregado y se define en el dominio como interfaz.

## Specification (Especificación)
Ya detallado en los patrones tácticos; es un patrón complementario que proviene del catálogo de Evans/Fowler y que en DDD sirve para validación, consulta y construcción.

## Command / Handler
En arquitecturas modernas, se suelen encapsular las operaciones de escritura en comandos y handlers (patrón Mediator o Command Bus). Esto encaja con DDD al hacer explícita la intención del caso de uso y separarla de la presentación. No es un patrón GoF, pero es muy complementario: un comando `RealizarPedido` lleva los datos necesarios y un handler `RealizarPedidoHandler` orquesta el dominio.

## Adapter (Adaptador) – uso en Anticorruption Layer
La ACL se implementa frecuentemente con el patrón Adapter para traducir entre modelos de diferentes contextos. El dominio cliente usa su propio puerto, y el adaptador convierte las llamadas al modelo del proveedor.

## Criterios de selección
Para no sobrecargar el dominio con patrones innecesarios:
- El patrón debe resolver un problema real de expresividad o flexibilidad en el dominio, no ser un adorno.
- Debe nombrarse según el lenguaje ubicuo, no con el nombre técnico del patrón (no llamar `PedidoStrategy`, sino `PoliticaDescuento`).
- Debe mantenerse dentro de la capa de dominio sin introducir dependencias de infraestructura.
