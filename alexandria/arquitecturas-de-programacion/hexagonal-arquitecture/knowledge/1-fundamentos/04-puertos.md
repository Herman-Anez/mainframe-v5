# Puertos

## Definición
Un puerto es una **interfaz** que establece un contrato entre el interior y el exterior. Es la única puerta de entrada o salida a la aplicación. Los puertos viven en el núcleo, cerca del dominio, y no contienen código de infraestructura.

## Clasificación
1. **Puertos primarios (Driving Ports)**: Representan las operaciones que ofrece el sistema. El exterior los invoca para “conducir” la aplicación. Ejemplos:
   - `GestionarPedidoUseCase` con métodos como `crearPedido(comando)`.
   - `ConsultarSaldoPort`.
   Suelen ser interfaces de casos de uso o servicios de aplicación. Los adaptadores primarios (como controladores REST) invocan estos puertos.

2. **Puertos secundarios (Driven Ports)**: Representan lo que el sistema necesita del exterior para funcionar. Son interfaces que el dominio define y que la infraestructura debe implementar. Ejemplos:
   - `RepositorioPedidos` con métodos `guardar(pedido)` y `buscarPorId(id)`.
   - `NotificadorEventos` con `notificar(evento)`.
   - `ProveedorPagos` con `autorizar(pago)`.

## Características esenciales
- Están escritos en el lenguaje del dominio (lenguaje ubicuo). Por ejemplo, `recuperarPedidosPendientes()` en lugar de `findByStatus(PENDING)`.
- Son independientes de la tecnología: no mencionan HTTP, SQL, colas o nombres de tablas.
- Son el punto de aplicación del Principio de Inversión de Dependencias: el dominio posee la interfaz, la infraestructura la implementa.
- Pueden ser segregados (Interface Segregation Principle) para no forzar a los adaptadores a implementar métodos que no necesitan.

## Relación con los agregados (DDD)
Los puertos secundarios que acceden a persistencia suelen trabajar a nivel de agregados completos. Por ejemplo, un repositorio guarda y recupera un `Pedido` (raíz de agregado) completo, no sus entidades internas por separado.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Metáfora del hexágono](03-metafora-del-hexagono.md) | [🏠 Inicio](../index.md) | [Adaptadores ▶](05-adaptadores.md) |
