# Resumen del ejemplo Spring Boot

La implementación con Spring Boot sigue fielmente la arquitectura hexagonal:

- El **dominio** no tiene anotaciones de Spring ni dependencias externas; define sus propias excepciones y eventos.
- Los **puertos** son interfaces Java puras ubicadas en `domain` (secundarios) y `application` (primarios).
- Los **servicios de aplicación** orquestan y usan `@Transactional`, pero no contienen lógica de negocio.
- Los **adaptadores** en `infrastructure` implementan esos puertos: `RepositorioPedidosJpa`, `KafkaPublicadorEventos`, `PedidoController`. Traducen entre formatos externos (JPA, JSON, Kafka) y el modelo de dominio.
- La **configuración** (`BeanConfiguration`) inyecta las implementaciones concretas, respetando la regla de que el núcleo no conoce a la infraestructura.
- Las **pruebas** se segregan por capa, aprovechando los puertos para aislar el dominio y sustituir adaptadores con dobles.

Esta estructura muestra que la hexagonal no es una teoría abstracta, sino una guía práctica que encaja con las capacidades de Spring Boot, manteniendo el código limpio, escalable y preparado para el cambio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fragmentos clave](02-fragmentos-clave.md) | [🏠 Inicio](../../index.md) | [Estructura de carpetas (Node.js + TypeScript + Hexagonal) ▶](../01-estructura-de-carpetas-nodejs-typescript-hexagonal.md) |
