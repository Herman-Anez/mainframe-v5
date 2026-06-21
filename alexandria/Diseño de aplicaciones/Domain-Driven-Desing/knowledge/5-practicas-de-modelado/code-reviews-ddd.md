# Code reviews DDD

Las revisiones de código en un proyecto DDD van más allá de la calidad técnica: se centran en si el código honra el modelo de dominio, el lenguaje ubicuo y las decisiones de diseño estratégico. Son una herramienta de aprendizaje y de protección del core domain.

## Objetivos de una revisión DDD
1. Verificar que el código **expresa el lenguaje ubicuo** sin contaminación técnica.
2. Validar que los patrones tácticos (entidades, VO, agregados, repositorios) se aplican correctamente.
3. Detectar **modelos anémicos** y fomentar el comportamiento en los objetos del dominio.
4. Asegurar que las **fronteras de agregados** y bounded contexts se respetan (no hay referencias directas entre agregados, no se persisten entidades internas sueltas).
5. Confirmar que la **arquitectura hexagonal/CQRS** se sigue según lo acordado (dependencias unidireccionales, puertos vs adaptadores).

## Checklist para revisión de código DDD

**Lenguaje Ubicuo y legibilidad:**
- [ ] ¿Los nombres de clases, métodos y variables usan el lenguaje del dominio, no jerga técnica?
- [ ] ¿Los métodos de comportamiento tienen nombres con verbos del negocio (`confirmar()`, `asignarResponsable()`)?
- [ ] ¿Se evitan términos como `Manager`, `Helper`, `Util`, `DTO` en la capa de dominio?
- [ ] ¿Las pruebas unitarias están escritas en lenguaje ubicuo y describen escenarios de negocio?

**Modelo de dominio rico:**
- [ ] ¿Las entidades contienen comportamiento o son solo estructuras de datos con getters/setters?
- [ ] ¿Los value objects son inmutables y validan sus invariantes en la construcción?
- [ ] ¿Se usan Domain Primitives (Email, Telefono, Dinero) en lugar de tipos genéricos?
- [ ] ¿La lógica de negocio está en el dominio o se ha filtrado a la capa de aplicación/infraestructura?

**Agregados:**
- [ ] ¿Solo existen repositorios para raíces de agregado?
- [ ] ¿Las referencias entre agregados son exclusivamente por identidad (IDs)?
- [ ] ¿Las colecciones internas del agregado no se exponen como mutables?
- [ ] ¿Las invariantes del agregado se comprueban en cada método público de la raíz?
- [ ] ¿Se ha respetado la regla de modificar un solo agregado por transacción? Si se tocan varios, ¿está justificado y se maneja con eventos?

**Repositorios:**
- [ ] ¿La interfaz del repositorio se define en el dominio y la implementación en infraestructura?
- [ ] ¿Los métodos del repositorio devuelven agregados completos (con todas sus entidades internas) o solo partes?
- [ ] ¿Se evitan métodos genéricos tipo `IQueryable<T>` expuestos sin restricción?

**Eventos de dominio:**
- [ ] ¿Los eventos se nombran en pasado (`PedidoConfirmado`, no `ConfirmarPedido`)?
- [ ] ¿Los eventos se generan dentro del agregado y se despachan tras la persistencia?
- [ ] ¿Los manejadores de eventos son idempotentes cuando se usa mensajería asíncrona?

**Servicios de dominio y aplicación:**
- [ ] ¿Los servicios de dominio son stateless y contienen solo lógica que no encaja en entidades/VO?
- [ ] ¿Los servicios de aplicación son finos: coordinan, no deciden reglas de negocio?
- [ ] ¿Se inyectan interfaces (puertos) en el dominio o solo en aplicación?

**Arquitectura:**
- [ ] ¿Las dependencias apuntan hacia el centro (dominio no depende de infraestructura)?
- [ ] ¿Los adaptadores (REST, JPA) están en infraestructura y no contaminan el dominio con anotaciones?
- [ ] ¿Se aplica correctamente CQRS si es el caso, separando modelos de lectura y escritura?

**Consistencia estratégica:**
- [ ] ¿Los objetos que cruzan bounded contexts se transforman con ACL o se adaptan al modelo local?
- [ ] ¿Se respetan los patrones de Context Mapping establecidos (no saltarse la ACL, no compartir kernel sin acuerdo)?

## Cómo llevar a cabo la revisión
- **Revisión por pares con alguien que conozca el dominio:** idealmente un desarrollador que haya participado en Event Storming y entienda el modelo. Un revisor externo sin contexto de negocio puede no detectar desviaciones semánticas.
- **Centrarse en los puntos críticos:** el core domain recibe mayor escrutinio. Para subdominios genéricos se puede ser más permisivo.
- **Revisar los tests como parte de la revisión:** los tests son los primeros consumidores del modelo; si un test es difícil de escribir, es señal de un problema de diseño.
- **No convertir la revisión en una caza de brujerías estéticas:** priorizar problemas de modelado (anemia, violación de invariantes) por encima de preferencias de estilo.

## Señales de alarma (code smells DDD)
- **Entidad con constructor vacío y setters públicos para todas sus propiedades.**
- **Uso de mapeo automático (AutoMapper) entre entidades de dominio y DTOs sin control.**
- **Servicio de aplicación que contiene estructuras condicionales complejas de reglas de negocio.**
- **Repositorio que expone `SaveChanges()` genérico.**
- **Llamadas directas a infraestructura (HttpClient, SQL) desde un método de una entidad.**
- **Evento de dominio que transporta entidades completas en lugar de IDs y VOs.**

## Mejora continua
La revisión de código DDD no es un evento puntual; debe incorporarse a la cultura del equipo. Al inicio del proyecto, es recomendable realizar sesiones de **revisión de modelo** donde se examina la estructura de agregados y módulos antes de escribir código. Con el tiempo, las revisiones se vuelven más ágiles porque el equipo interioriza los patrones.

---

Estos cuatro archivos completan el apartado de prácticas de modelado, proporcionando una guía para mantener el modelo vivo, flexible y fiel a los principios DDD durante todo el ciclo de vida del software.
