# Patrón repositorio

## Definición
El patrón repositorio es un puerto secundario (driven port) que media entre el dominio y el mecanismo de persistencia. Su objetivo es **ocultar los detalles de almacenamiento** y presentar al dominio una interfaz que simula una colección en memoria de agregados. El dominio solo conoce la interfaz; la implementación real reside en un adaptador de infraestructura.

## Rol en la arquitectura hexagonal
- Actúa como **puerto secundario**: la interfaz `RepositorioX` se define dentro del núcleo (normalmente en el paquete de dominio o aplicación) y el adaptador (por ejemplo, `RepositorioXPostgres`) la implementa.
- Es la materialización del Principio de Inversión de Dependencias: el dominio impone su contrato, la infraestructura lo respeta.
- Aísla al dominio de SQL, NoSQL, ORM y ficheros.
- Trabaja exclusivamente con **raíces de agregado**: los métodos del repositorio aceptan y devuelven agregados completos, nunca entidades internas del agregado.

## Diseño de la interfaz
- **Métodos expresivos en lenguaje ubicuo**: `guardar(Pedido pedido)`, `buscarPorId(PedidoId id)`, `recuperarPendientes(ClienteId clienteId)`.
- **No expone detalles técnicos**: nada de `findByStatus`, `createQuery`, `persist`. Las firmas reflejan intenciones de negocio.
- **Colección abstracta**: el dominio ve el repositorio como una colección de la que se pueden añadir, obtener y eliminar objetos.
- **Separación de comandos y consultas**: se pueden tener repositorios de solo lectura (ej. `VistaPedidos`) y de escritura, o un solo repositorio con ambos.

## Implementación del adaptador
- El adaptador contiene la dependencia del ORM, driver de base de datos o cliente NoSQL.
- Traduce entre los modelos de persistencia y las entidades/value objects del dominio.
- Respeta las transacciones demarcadas por el servicio de aplicación (no crea transacciones propias a menos que sea necesario).
- Ejemplo con JPA: la clase `RepositorioPedidosJpa` usa un `EntityManager` o un `JpaRepository` de Spring Data, pero los métodos públicos devuelven objetos del dominio después de mapearlos.

## Buenas prácticas
- **Un repositorio por agregado**: no un repositorio genérico. Cada agregado tiene su propia interfaz específica.
- **No exponer I/O**: nunca lanzar excepciones técnicas ( `SQLException` ) desde la interfaz. Si ocurre un error de persistencia, el adaptador lo envuelve en una excepción de infraestructura o de dominio, si se define así.
- **Evitar guardado automático**: el repositorio debe requerir una llamada explícita a `guardar` para persistir cambios. No debe haber “dirty checking” automático sobre objetos de dominio, porque eso acoplaría.
- **Consultas de proyección fuera del repositorio de agregado**: si se necesitan lecturas para vistas/ reportes, se crean puertos de consulta separados (CQRS).
- **Población completa de agregados**: el repositorio debe hidratar completamente el agregado al leer. Las asociaciones a otros agregados se representan solo por sus identificadores en el modelo de dominio, no por referencias directas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Síntesis de testabilidad en arquitectura hexagonal](../4-testabilidad/05-sintesis-de-testabilidad-en-arquitectura-hexagonal.md) | [🏠 Inicio](../index.md) | [Fábricas ▶](02-fabricas.md) |
