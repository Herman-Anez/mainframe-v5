# Lenguaje ubicuo

## Definición
El lenguaje ubicuo es la práctica de construir un vocabulario común y riguroso compartido por todos los miembros del equipo (desarrolladores, expertos del negocio, testers). Este lenguaje se plasma directamente en el código, en los nombres de clases, métodos y módulos, eliminando traducciones que causan pérdida de conocimiento.

## Principios
- **Un solo significado por término**: Si “Cliente” significa un comprador, no se usa la misma palabra para un cliente API.
- **El código como narrativa**: El dominio debe leerse como si un experto del negocio describiera los procesos. Métodos como `pedido.aplicarDescuento(porcentaje)` en lugar de `pedido.setDiscount(p)`.
- **Evolución continua**: A medida que se descubre más del negocio, el lenguaje se refina en el código.

## Relación con la arquitectura hexagonal
El lenguaje ubicuo es el pegamento de todos los elementos del núcleo. Las entidades, value objects, servicios de dominio y eventos se nombran y modelan con él. Los puertos también se diseñan en lenguaje ubicuo (`recuperarPedidosPendientes()` en vez de `findByStatus(PENDING)`). El hexágono interior es un lienzo donde el lenguaje ubicuo cobra vida, y su pureza depende de que ningún término de infraestructura (tablas, columnas, endpoints) contamine el centro.

## Beneficio concreto
Cuando un experto de negocio habla de “anular un envío porque el pago fue rechazado”, el código mostrará un evento `PagoRechazado` y un método `envio.anular()`. No hay brecha semántica, reduciendo errores y coste de mantenimiento.

---

## Síntesis del dominio dentro del hexágono
Estos seis conceptos se combinan para formar un modelo de dominio robusto, encapsulado y expresivo. Las **entidades** con identidad, los **value objects** como piezas inmutables, los **agregados** que protegen invariantes, los **servicios de dominio** para la lógica huérfana, los **eventos de dominio** para notificar cambios, y el **lenguaje ubicuo** que lo unifica todo, se sitúan en el corazón del hexágono. Son completamente ajenos a REST, bases de datos o mensajería. Los adaptadores, guiados por los puertos, serán los únicos que traten con el mundo exterior.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Eventos de dominio](05-eventos-de-dominio.md) | [🏠 Inicio](../../index.md) | [Puertos secundarios ▶](../01-puertos-secundarios.md) |
