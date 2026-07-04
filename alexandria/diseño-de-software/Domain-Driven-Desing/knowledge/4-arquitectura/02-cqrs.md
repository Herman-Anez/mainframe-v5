# CQRS

**CQRS** (Command Query Responsibility Segregation) es un patrón que separa estrictamente los modelos para procesar comandos (escritura, que modifican el estado) de los modelos para procesar consultas (lectura, que devuelven datos). Nació como una forma de resolver tensiones entre la representación del dominio rico en comandos y las necesidades de consulta denormalizadas y optimizadas.

## Motivación
En aplicaciones tradicionales, un mismo modelo de dominio sirve tanto para actualizar datos como para presentar información compleja (joins, agregaciones, vistas). Esto genera conflictos:
- Las entidades deben ser encapsuladas pero las consultas necesitan exponer atributos.
- El mapeo objeto-relacional se complica con eager/lazy loading.
- Las consultas de reporte requieren estructuras completamente diferentes a las entidades del dominio.

CQRS resuelve esto dividiendo el sistema en dos caminos:
- **Lado de comandos (Command Model):** utiliza los patrones tácticos de DDD (agregados, repositorios). Los comandos son imperativos (ej. `RealizarPedido`, `AñadirProducto`). Normalmente se accede a un repositorio que carga el agregado, se ejecuta el comportamiento y se persiste.
- **Lado de consultas (Query Model):** se diseña específicamente para responder a las necesidades de los clientes (UI, APIs de reporte). Se pueden usar consultas SQL directas, vistas materializadas, o una base de datos de lectura separada.

## Separación de modelos
| Aspecto | Command Model | Query Model |
|---------|---------------|-------------|
| Objetivo | Mantener invariantes, ejecutar reglas de negocio | Responder consultas de forma rápida |
| Tecnología típica | ORM, Event Sourcing | SQL, micro ORMs, proyecciones |
| Estructura | Agregados, entidades, VO | DTOs planos, read models |
| Validación | Reglas de dominio, invariantes | No aplica (datos ya validados) |
| Escalabilidad | Vertical, con consistencia fuerte | Horizontal, con datos posiblemente eventuales |

## Flujo de trabajo en CQRS
1. Un **comando** llega al sistema (desde UI, API, etc.). El servicio de aplicación valida el comando y carga el agregado desde el repositorio de escritura.
2. El agregado procesa el comando, aplica las reglas de negocio y produce eventos de dominio.
3. El repositorio guarda el nuevo estado del agregado en la **base de datos de escritura**.
4. Los eventos de dominio se publican.
5. Un **proyector** (manejador de eventos) escucha el evento y actualiza el **modelo de lectura** en la base de datos de consulta.
6. Las consultas se ejecutan contra esa base de datos de lectura, utilizando consultas ligeras.

## CQRS sin Event Sourcing
CQRS no requiere Event Sourcing; se puede aplicar con un repositorio ORM tradicional y una base de datos de lectura actualizada mediante eventos o incluso mediante un proceso batch. Sin embargo, la combinación CQRS + Event Sourcing es potente porque los eventos sirven como fuente natural para construir proyecciones.

## Diferentes niveles de separación
- **CQRS lógico:** mismo esquema de base de datos, pero con modelos de lectura separados en código (DTOs y consultas directas sin pasar por el agregado).
- **CQRS con bases de datos separadas:** escritura y lectura en diferentes almacenes, lo que permite escalar y optimizar cada uno de forma independiente. Introduce consistencia eventual.

## Cuándo aplicar CQRS
- El modelo de consulta es muy diferente al de escritura (muchos joins, agregaciones).
- Los requisitos de rendimiento en lectura y escritura difieren (alta concurrencia de lectura vs. escritura con reglas complejas).
- Se necesita consultar datos de múltiples agregados de forma eficiente.
- Se planea adoptar Event Sourcing (aunque no es obligatorio).

## Precauciones
- Complejidad añadida: hay que mantener sincronizados ambos modelos. Si la consistencia eventual no es aceptable para ciertas consultas, hay que diseñar cuidadosamente.
- Los comandos no deben devolver datos de dominio (excepto quizá el ID del agregado creado). Si la UI necesita ver el resultado inmediato, se puede hacer una consulta posterior al read model o usar un GUID generado por el cliente.
- No confundir con la simple separación de capas; CQRS es una segregación de modelos, no solo de clases.

## Relación con DDD
- El command model implementa los patrones tácticos DDD (entidades, agregados, servicios de dominio).
- Los eventos de dominio son el mecanismo ideal para actualizar el query model.
- Los bounded contexts pueden adoptar CQRS internamente de manera independiente.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hexagonal ports adapters](01-hexagonal-ports-adapters.md) | [🏠 Inicio](../index.md) | [Event sourcing ▶](03-event-sourcing.md) |
