# Resumen del ejemplo Node.js/TypeScript

- **El dominio** es TypeScript puro, sin anotaciones de framework; exporta interfaces para los repositorios y publicadores (puertos secundarios).
- **La capa de aplicación** define los casos de uso mediante servicios que orquestan el dominio y los puertos secundarios.
- **Los adaptadores** (Express, TypeORM, KafkaJs) implementan los puertos y mapean entre los modelos externos y el dominio, manteniendo la lógica de negocio aislada.
- **El cableado** en `main.ts` construye el grafo de objetos a mano o con un contenedor, asegurando que las dependencias apunten siempre hacia el centro.
- **Las pruebas** se dividen por capa, con dobles ligeros (jest mocks) para los servicios de aplicación y bases de datos en memoria para los adaptadores.

La arquitectura hexagonal en Node.js es perfectamente viable y potencia la testabilidad y la capacidad de reemplazar infraestructura con un coste mínimo, al tiempo que el núcleo de negocio escrito en TypeScript permanece limpio y expresivo.

---
<>

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fragmentos clave](02-fragmentos-clave.md) | [🏠 Inicio](../index.md) | ➖ |
