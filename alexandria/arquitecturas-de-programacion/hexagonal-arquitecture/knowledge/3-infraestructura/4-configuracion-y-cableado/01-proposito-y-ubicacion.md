# Propósito y ubicación

La configuración y el cableado residen completamente en la **capa de infraestructura**, a menudo en un módulo específico (por ejemplo, `Bootstrap`, `Startup`, `Main`). Su misión es:

- **Instanciar** todos los adaptadores concretos (primarios y secundarios).
- **Inyectar** esas implementaciones en los servicios de aplicación y, a través de ellos, en el dominio.
- **Cargar parámetros de configuración** (URLs de base de datos, credenciales, colas) desde fuentes externas (archivos, variables de entorno, servicios de configuración) y pasárselos a los adaptadores.
- **Asegurar** que el núcleo (dominio + aplicación) jamás conozca las clases concretas de infraestructura.

Se le conoce como **Composition Root** (raíz de composición). Es el único punto del sistema que tiene acoplamiento a todas las piezas concretas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `interfaces de linea de comandos](../3-ui-y-presentacion/02-`interfaces-de-linea-de-comandos.md) | [🏠 Inicio](../../index.md) | [Composition Root (Raíz de Composición) ▶](02-composition-root-raiz-de-composicion.md) |
