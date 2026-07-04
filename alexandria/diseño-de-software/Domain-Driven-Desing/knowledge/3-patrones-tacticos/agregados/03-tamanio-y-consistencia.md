# Tamanio y consistencia

El tamaño de los agregados y la estrategia de consistencia asociada son decisiones de diseño que impactan profundamente en la escalabilidad, el rendimiento y la corrección del sistema.

## El trade-off fundamental
Agregados grandes permiten garantizar más invariantes de forma transaccional (inmediata) porque abarcan más objetos relacionados. Sin embargo, generan:
- Mayor contención en sistemas multiusuario: dos usuarios pueden querer modificar distintas partes del mismo agregado grande, bloqueándose mutuamente.
- Mayor consumo de memoria y tiempo de carga al recuperar toda la estructura de la base de datos.
- Dificultad para particionar datos (sharding) si un agregado contiene demasiados datos.

Agregados pequeños resuelven los problemas de contención y rendimiento, pero fuerzan a manejar invariantes que cruzan agregados con **consistencia eventual**, lo que añade complejidad de diseño.

La filosofía DDD se decanta por **agregados lo más pequeños posible** que aún mantengan sus propias invariantes. La consistencia eventual no es un defecto, sino una realidad del dominio que podemos modelar con eventos y políticas.

## Cómo determinar el tamaño correcto
Analiza cada invariante de negocio:
- ¿Qué objetos deben ser consistentes en todo momento después de una operación? Esos deben estar juntos en el mismo agregado.
- ¿Qué reglas pueden tolerar un pequeño retraso en la sincronización? Esas se implementan entre agregados mediante eventos.

**Preguntas guía:**
1. ¿Si modifico A, debo recalcular o validar B obligatoriamente antes de dar la operación por completada? Si es sí, A y B están en el mismo agregado.
2. ¿Qué pasa si B se actualiza unos segundos después? Si el negocio lo permite, separemos los agregados.

**Ejemplo: Pedido y Factura**
- Invariante: "El total de la factura debe coincidir con el total del pedido confirmado". ¿Deben estar en el mismo agregado? No necesariamente. Cuando se confirma un pedido, se emite `PedidoConfirmado`. El servicio de facturación lo consume y genera la factura. Si por un error la factura tarda 2 segundos en generarse, el negocio puede aceptarlo. Separar en dos agregados evita que facturación bloquee la confirmación del pedido.

## Tipos de consistencia
- **Inmediata:** transaccional, dentro de un agregado. Usa mecanismos de base de datos (bloqueo optimista, transacción ACID local).
- **Eventual:** entre agregados. Se implementa con mensajería asíncrona (eventos de dominio, colas). La consistencia no se garantiza al milisegundo, pero se alcanza en un tiempo finito. A menudo se combina con políticas de compensación (sagas) si algo falla.

## Diseñando para consistencia eventual
Cuando un agregado necesita notificar cambios a otros:
1. El agregado raíz registra un **Evento de Dominio** después de cada cambio significativo.
2. Un manejador (dentro del mismo contexto o en otro) recibe el evento y ejecuta la lógica correspondiente.
3. Se debe garantizar al menos *entrega una vez* (at-least-once), por lo que los consumidores deben ser idempotentes.

**Patrón de ejemplo:** cuando se confirma un `Pedido` (agregado A), se publica `PedidoConfirmado`. El agregado `Cliente` (agregado B) podría querer aumentar un contador de pedidos realizados. El manejador en B recibe el evento y actualiza el contador en su propio agregado, guardándolo en su propia transacción.

## Agregados grandes: cuándo pueden ser aceptables
Rara vez, si la invariante es estrictamente transaccional y el negocio no tolera ningún retraso (por ej., transferencias de fondos entre cuentas en el mismo banco, donde débito y crédito deben ser atómicos). En esos casos:
- Se puede tener un agregado que abarque ambas cuentas, pero tiene el problema de bloqueo.
- Alternativa: usar un servicio de dominio que orqueste dentro de una transacción de base de datos (pero tocando dos agregados, lo que rompe la regla pura). Muchos sistemas reales optan por esta vía con mecanismos de bloqueo distribuido.

La recomendación ortodoxa es mantener la atomicidad dentro del agregado y eventual fuera, pero en la práctica se evalúa caso a caso.

## Concurrencia y agregados pequeños
Usar agregados pequeños permite manejar la concurrencia con bloqueo optimista (un campo `Version` o `Timestamp` en la raíz). Si dos usuarios modifican el mismo agregado, solo uno tiene éxito; el otro reintenta. Con agregados pequeños, la probabilidad de colisión disminuye.

## División de un agregado grande
Si detectas un agregado sobrecargado, el proceso de división implica:
1. Identificar subgrafos que son consistentemente accedidos juntos.
2. Verificar que no haya invariantes transaccionales entre los subgrafos candidatos.
3. Introducir eventos de dominio para mantener cualquier dependencia entre ellos.
4. Crear nuevos repositorios y refactorizar los clientes para usar los nuevos IDs.

**Ejemplo:** un `Pedido` que contenía todo el historial de estados (`HistorialEstado`). El historial es solo de consulta; las operaciones de escritura solo añaden un nuevo estado. Se puede partir: `Pedido` como un agregado con su estado actual, y `HistorialPedido` como otro agregado actualizado vía eventos `PedidoEstadoCambiado`. Las consultas del historial se hacen al segundo agregado.

## Eventualidad y UX
La consistencia eventual puede tener impacto en la experiencia de usuario. Si un usuario realiza una acción y la interfaz no refleja inmediatamente la consecuencia, se debe diseñar una UX optimista: se muestra el cambio esperado y, si eventualmente hay un fallo, se notifica. Patrones como *Read Models* actualizados mediante eventos reducen la latencia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Reglas de diseno](02-reglas-de-diseno.md) | [🏠 Inicio](../../index.md) | [Ejemplos agregados ▶](04-ejemplos-agregados.md) |
