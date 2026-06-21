# Puertos primarios

## Definición
Un puerto primario (o *driving port*) es una **interfaz** que define las operaciones que el mundo exterior puede realizar sobre el sistema. Es el contrato que los adaptadores de entrada (driving adapters) invocan para “conducir” la aplicación. Vive en el núcleo del hexágono, específicamente en la capa de aplicación (o en el límite entre aplicación y dominio).

## Características fundamentales
- **Expresa casos de uso en lenguaje ubicuo**: Los métodos llevan nombres como `cancelarPedido(pedidoId)`, `registrarCliente(comando)`.
- **Tecnológicamente neutra**: No debe contener dependencias de HTTP, JMS, ni ningún protocolo. Sus parámetros son comandos, consultas o tipos básicos del dominio (identificadores, value objects), jamás `HttpRequest` o `Message`.
- **Único punto de entrada**: El sistema puede tener múltiples adaptadores primarios (REST, GraphQL, CLI) que comparten exactamente el mismo puerto. Eso asegura que todos ejecuten los mismos casos de uso y que la lógica de orquestación sea reutilizada.
- **La implementan los servicios de aplicación**: La clase `PedidoApplicationService` implementa la interfaz `GestionDePedidos`. El compositor raíz (DI) inyecta esta implementación concreta en los adaptadores que dependan de la interfaz.

## Relación con la arquitectura
Los puertos primarios son la *frontera interior* del hexágono; todo lo que está fuera de ellos es adaptador. Al definirlos como interfaces en el núcleo, se cumple el principio de inversión de dependencias:

- El adaptador (infraestructura) depende de la interfaz.
- La implementación (servicio de aplicación) depende del dominio y de las interfaces de los puertos secundarios.
- Ni el dominio ni el servicio de aplicación dependen del adaptador.

## Ejemplo de definición de puerto primario
```java
// Puerto primario (dentro de la aplicación)
public interface GestionDeClientes {
    ClienteId registrarCliente(RegistrarClienteComando comando);
    void actualizarDireccion(ClienteId clienteId, Direccion nuevaDireccion);
    ClienteDto consultarCliente(ClienteId clienteId);
}
```
Un controlador REST inyecta `GestionDeClientes` y, ante una petición HTTP, construye el comando apropiado e invoca el método correspondiente. El controlador desconoce que detrás hay una implementación concreta que orquesta repositorios y publica eventos.

## Agrupación de casos de uso
Es recomendable definir puertos primarios que agrupen casos de uso cohesivos (según el principio de segregación de interfaces). Así, un microservicio podría tener un único puerto `GestionDePedidos`, mientras que un monolito modular podría tener `GestionDePedidos`, `GestionDeFacturacion`, etc., inyectándose solo los necesarios.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Comandos y consultas](03-comandos-y-consultas.md) | [🏠 Inicio](../../index.md) | [Síntesis de la capa de aplicación ▶](05-sintesis-de-la-capa-de-aplicacion.md) |
