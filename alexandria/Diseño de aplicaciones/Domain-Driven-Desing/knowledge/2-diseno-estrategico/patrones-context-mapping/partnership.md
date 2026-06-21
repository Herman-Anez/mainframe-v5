# Partnership

La **Partnership** (sociedad) es un patrón de integración donde dos equipos —cada uno responsable de su propio Bounded Context— establecen una relación de colaboración estrecha, simétrica y a largo plazo. A diferencia de una relación cliente-proveedor, aquí no hay una dirección única de dependencia; ambas partes se necesitan mutuamente para tener éxito y la comunicación es bidireccional continua.

## Características fundamentales
- **Interdependencia recíproca:** el contexto A necesita que B exponga cierta funcionalidad, y B necesita que A consuma sus cambios de manera oportuna. El fallo de uno afecta seriamente al otro.
- **Coordinación de entregas:** los equipos planifican juntos sus sprints o hitos, sincronizando fechas de despliegue y versiones de interfaces.
- **Confianza y transparencia:** existe una cultura de compartir avances, problemas y decisiones de diseño. No hay “sorpresas” de última hora.
- **Propiedad compartida de la interfaz:** la API, los contratos de eventos o el esquema de datos no pertenecen exclusivamente a un equipo; ambos los definen y evolucionan de común acuerdo. En ocasiones incluso comparten un repositorio de pruebas de integración.
- **Evolución conjunta del modelo:** aunque cada contexto mantiene su propio modelo canónico, los cambios que afectan a la integración se discuten y se modelan juntos. Es habitual que miembros de ambos equipos participen en sesiones de Event Storming conjuntas.

## Cuándo aplicar Partnership
- Ambos contextos forman parte del **Core Domain** o están fuertemente ligados a la propuesta de valor, y no es viable aislarlos completamente.
- La lógica de negocio cruza frecuentemente las fronteras (por ejemplo, el contexto de “Gestión de Pedidos” y el de “Logística” necesitan intercambiar información en tiempo real con reglas complejas).
- Los equipos pertenecen a la misma área organizativa o tienen una fuerte cultura de colaboración.
- El costo de formalizar una separación estricta (ACLs, contratos inamovibles) es mayor que el de coordinarse.

## Riesgos y desventajas
- **Alto coste de comunicación:** requiere reuniones frecuentes, lo cual puede ralentizar a equipos que de otro modo serían autónomos. Si el equipo crece, la coordinación se vuelve exponencial.
- **Acoplamiento temporal:** los despliegues pueden quedar bloqueados hasta que ambos equipos estén listos, lo que contradice los principios de entrega continua.
- **Dependencia de personas y relaciones:** si la colaboración se basa solo en la buena voluntad de líderes concretos, un cambio organizativo puede romper la partnership.
- **Fragilidad ante la distancia geográfica o cultural:** la comunicación asíncrona puede no ser suficiente para la fineza que requiere una Partnership.

## Diferencias con otros patrones
- **Frente a Customer-Supplier:** en Customer-Supplier el downstream es cliente, el upstream es proveedor y la relación es asimétrica. En Partnership, ambos se adaptan mutuamente.
- **Frente a Shared Kernel:** el Shared Kernel comparte *código o modelo* físico entre contextos. La Partnership puede existir sin compartir código, solo mediante interfaces acordadas y una cultura de trabajo común. En la práctica, una Partnership a menudo recomienda usar un Shared Kernel para formalizar ese acoplamiento, pero no es obligatorio.

## Implementación práctica
1. Establecer un **foro de integración recurrente** (semanal o quincenal) donde se revisen las necesidades de ambos lados.
2. Mantener un **contrato de API versionado y pactado** en un repositorio compartido, con validación automática (ej. pruebas de contrato con Pact).
3. Crear **pruebas de integración end-to-end conjuntas** que validen el flujo de negocio completo, no solo la conexión técnica.
4. Acordar un **procedimiento de cambios de última hora** (quiénes pueden aprobar, qué rompe la compatibilidad).

La Partnership es el patrón más exigente desde el punto de vista organizativo y debe reevaluarse periódicamente. Si la colaboración empieza a generar fricciones, conviene migrar hacia Customer-Supplier o aislar más los contextos con una ACL.
