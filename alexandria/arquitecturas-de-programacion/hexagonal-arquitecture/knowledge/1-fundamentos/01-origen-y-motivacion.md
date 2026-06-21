# Origen y motivación

## Contexto histórico
Alistair Cockburn presentó la Arquitectura Hexagonal (también llamada “Ports & Adapters”) en un artículo de 2005. Su motivación surgió al observar que el código de negocio quedaba atrapado en los detalles de infraestructura (bases de datos, interfaces de usuario, sistemas de mensajería…). La arquitectura en capas tradicional, aunque útil, generaba una dependencia directa de la capa de presentación hacia la de persistencia, y el dominio quedaba contaminado con código de acceso a datos o de interfaz gráfica.

Cockburn quería una arquitectura donde:
- La aplicación pudiera ser ejecutada igualmente por un humano, un script de prueba, un sistema externo o un lote.
- Se pudiera desarrollar y probar aisladamente de los mecanismos de entrega y persistencia definitivos.
- Añadir un nuevo “cliente” (web, móvil, línea de comandos) o cambiar la base de datos no implicara reescribir la lógica de negocio.

## El problema de las capas tradicionales
En la arquitectura de tres capas (presentación → negocio → datos), las dependencias de código fuente apuntan hacia abajo: la capa superior conoce a la inferior. Esto provoca que la lógica de negocio quede acoplada a la capa de persistencia (por ejemplo, detalles de ORM o SQL). Cualquier cambio en la base de datos se propaga al corazón de la aplicación. Además, testear la lógica aisladamente resulta muy difícil porque hay que levantar la infraestructura.

## La idea central de la hexagonal
Cockburn propuso voltear esa dependencia: el centro es la lógica de negocio y todo lo externo se conecta a través de contratos (puertos). La metáfora del hexágono visualiza una aplicación con múltiples lados por los que se comunica, cada uno representando un protocolo distinto. Al no ser un número fijo, se simboliza que la aplicación puede tener tantos puertos como sean necesarios, sin que su núcleo interno cambie.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Principios ▶](02-principios.md) |
