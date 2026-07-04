# Servicios de dominio

## Cuándo se justifica un servicio de dominio

Las tres condiciones de Evans:
1. La operación es un concepto significativo del dominio.
2. No pertenece naturalmente a una entidad o value object.
3. Involucra múltiples objetos del dominio o requiere acceso a recursos externos a través de interfaces.

Un servicio de dominio **no es un cajón de sastre** para todo lo que no encaja; debe modelar una actividad o proceso de negocio explícito. Ejemplos: `TransferenciaService`, `CalculoImpuestosService`, `AsignacionRecursosService`.

## Diseño stateless y sin efectos secundarios colaterales

- El servicio no mantiene estado entre invocaciones. Es seguro usarlo concurrentemente.
- Sus métodos son comandos o consultas puras (sin modificar el estado global, salvo a través de los objetos pasados y las interfaces inyectadas).
- Debe depender únicamente de interfaces (repositorios, otros servicios, puertos), inyectadas por constructor.

## Diferencias con servicios de aplicación y utilidades

| Aspecto | Servicio de Dominio | Servicio de Aplicación | Utilidad / Helper |
|---------|---------------------|------------------------|-------------------|
| Propósito | Lógica de negocio compleja entre agregados | Orquestación de caso de uso | Funciones técnicas genéricas |
| Lenguaje | Ubicuo (negocio) | Técnico / coordinación | Técnico |
| Capa | Dominio | Aplicación | Infraestructura o compartido |
| Estado | Stateless | Stateless | Stateless |
| Dependencias | Puertos de dominio (interfaces) | Repositorios, servicios de dominio, buses | Nada o librerías técnicas |

## Integración con eventos de dominio

Un servicio de dominio puede publicar eventos de dominio si la operación lo requiere (ej. después de una transferencia exitosa, publicar `TransferenciaRealizada`). La publicación debe hacerse a través de una interfaz de bus definida en el dominio, con la implementación concreta en infraestructura.

## Ejemplo completo: servicio de matching de pedidos con transporte

Se describe un servicio de dominio `AsignacionTransporteService` que, dado un `Pedido` confirmado y un repositorio de `TransportistasDisponibles`, aplica reglas de negocio para seleccionar el mejor transportista según distancia, coste y SLA, y devuelve una `AsignacionTransporte`. Esta lógica es compleja, involucra múltiples agregados y no pertenece a `Pedido` ni a `Transportista`.

## Testing de servicios de dominio

Al ser stateless y con dependencias inyectadas, se prueban con mocks/stubs. Los tests verifican la lógica de negocio sin levantar infraestructura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Value objects](02-value-objects.md) | [🏠 Inicio](../index.md) | [Modulos ▶](04-modulos.md) |
