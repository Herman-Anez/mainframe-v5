# Casos de uso

## Definición
Un caso de uso representa una interacción concreta entre un actor externo (usuario, otro sistema, test) y el sistema. Describe **qué** hace el sistema en respuesta a una solicitud, manteniéndose independiente de la tecnología de entrega. Es una operación de negocio atómica desde la perspectiva del actor.

En la arquitectura hexagonal, los casos de uso son la manifestación de los **verbos** del lenguaje ubicuo a nivel de aplicación: “Crear un pedido”, “Cancelar una suscripción”, “Consultar el saldo de un cliente”.

## Características esenciales
- **Intención de negocio explícita**: Cada caso de uso expresa un objetivo del actor (por ejemplo, `RealizarPago` en lugar de `procesarTransaccion`).
- **Independencia tecnológica**: No especifican si la llamada proviene de REST, gRPC, CLI o un test. El adaptador de entrada se encarga de convertir la solicitud en datos comprensibles (un comando) y llamar al caso de uso.
- **Atomicidad aparente**: El caso de uso gestiona una unidad de trabajo completa: valida, ejecuta lógica de dominio, persiste y publica eventos. Ocurre por completo o revierte.
- **Dueño de la transacción de aplicación**: Define el alcance transaccional que debe abarcar la operación (por ejemplo, “no puedo crear el pedido si falla la reserva de inventario”). La implementación de la transacción es responsabilidad del servicio de aplicación y de los adaptadores concretos.

## Rol en la arquitectura hexagonal
Los casos de uso son el *contrato conductivo* del sistema. Se agrupan en interfaces de puertos primarios que exponen exactamente esos verbos. Por ejemplo, la interfaz `GestionDePedidos` (puerto primario) declara los métodos `crearPedido(CrearPedidoComando)`, `cancelarPedido(PedidoId)`, etc. Cada uno de esos métodos es un caso de uso.

Los adaptadores primarios (controladores web, suscriptores de colas) conocen únicamente la interfaz del puerto y pueden invocarla sin preocuparse de quién la implementa ni de lo que sucede dentro.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Puertos secundarios](../01-puertos-secundarios.md) | [🏠 Inicio](../../index.md) | [Servicios de aplicación ▶](02-servicios-de-aplicacion.md) |
