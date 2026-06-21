# Bounded context

El Bounded Context es el concepto más fundamental del diseño estratégico: traza una frontera explícita donde un modelo de dominio es consistente y tiene significado único. Es la solución al problema de intentar un modelo único y omnisciente.

## Por qué falla un modelo canónico global
En sistemas grandes, una misma palabra (por ejemplo, “Libro”) puede tener atributos y comportamientos radicalmente distintos según el área funcional: en el catálogo editorial un libro tiene ISBN, autor, sinopsis; en el almacén tiene peso, ubicación, stock; en ventas tiene precio, disponibilidad y descuentos aplicables. Forzar un único modelo `Libro` que cubra todas esas perspectivas conduce a objetos sobrecargados, acoplamiento y confusión. El Bounded Context acepta la realidad: existen múltiples modelos, cada uno válido en su propio límite.

## Características de un Bounded Context
- **Autonomía del modelo:** dentro de la frontera, un concepto tiene un significado inequívoco, reflejado en el UL del contexto.
- **Autonomía de implementación:** idealmente cada contexto es desarrollado por un equipo autónomo que decide su arquitectura interna, lenguaje de programación, base de datos y estrategia de despliegue (alineado con la Ley de Conway).
- **Interfaz explícita:** se comunica con otros contextos a través de contratos bien definidos (API síncronas, eventos asíncronos, etc.).
- **Límite de consistencia:** dentro del contexto se puede garantizar consistencia transaccional fuerte (con agregados y repositorios). Entre contextos, se asume consistencia eventual.

## Relación con subdominios (espacio del problema vs espacio de la solución)
Recordemos:
- **Subdominio:** es una partición lógica del *problema* de negocio. Existe sin software.
- **Bounded Context:** es la delimitación en el *espacio de la solución*. Es una decisión de diseño.

Lo ideal es un mapeo 1:1: cada subdominio (especialmente los Core y Supporting) se implementa como un único Bounded Context. Pero la realidad impone variaciones:
- **Un subdominio complejo con varios contextos:** cuando el subdominio es tan vasto que requiere varios equipos (por ejemplo, un core de e-commerce puede dividirse en `Gestión de Catálogo` y `Motor de Recomendaciones`). Aquí cada contexto sigue siendo parte del mismo subdominio pero con modelos especializados.
- **Un contexto que abarca varios subdominios genéricos:** por ejemplo, un único contexto `Notificaciones` que maneja correos y SMS. Al ser genérico, no hay problema, pero si se unifican en un contexto un core y un supporting, es un olor a diseño que merece replantearse.

## Cómo definir las fronteras
- **Lenguaje ubicuo como guía:** si detectas que una misma palabra necesita definiciones distintas, probablemente haya una frontera natural.
- **Capacidades de negocio:** cada capacidad coherente (gestionar pedidos, gestionar inventario) suele ser un candidato.
- **Cohesión de datos y comportamiento:** agrupa lo que cambia junto. Si al modificar el “precio” en un lado siempre impacta en otra parte, tal vez deban estar en el mismo contexto.
- **Granularidad óptima:** ni tan grande que un equipo no pueda entenderlo completamente, ni tan pequeño que multiplique las integraciones sin necesidad. Una heurística común es el “tamaño de una pizza de dos porciones” (un equipo de 5-9 personas puede poseer el contexto).

## Implementación de un Bounded Context
No implica obligatoriamente un microservicio. Puede ser:
- Un módulo bien definido en un monólito modular (con disciplina de no violar las fronteras con imports).
- Un servicio autónomo con su propia base de datos.
- Un conjunto de funciones serverless.

La clave es que las dependencias de otros contextos estén explícitamente en la capa de infraestructura (adaptadores) y no en el dominio.

## Integración entre contextos
Se rige por el Context Mapping (siguiente archivo). Pero aquí conviene resaltar que una frontera de contexto implica un **punto de traducción**: cuando un concepto cruza la frontera, se transforma al modelo del contexto receptor. Por ejemplo, un `Cliente` del contexto Ventas se convierte en un `Destinatario` en el contexto Envíos a través de un mapeador. Ignorar esta traducción lleva a modelos anémicos y acoplados.
