# Hexagonal vs. Arquitectura en capas tradicional

## Arquitectura en capas tradicional
La arquitectura en capas (3‑capas, N‑capas) organiza el sistema en estratos horizontales:
- **Presentación** (UI, controladores)
- **Negocio** (lógica de negocio, servicios)
- **Persistencia** (acceso a datos, repositorios)

Cada capa solo depende de la capa inmediatamente inferior: Presentación → Negocio → Persistencia.

## Diferencia fundamental: dirección de las dependencias
En las capas tradicionales, **las dependencias de código fuente apuntan hacia abajo**. La capa de negocio conoce y depende de la capa de persistencia. Esto implica que la lógica de negocio importa clases de acceso a datos (repositorios concretos, JPA, consultas SQL). Cualquier cambio en la base de datos se propaga hacia el corazón de la aplicación.

En la hexagonal, **las dependencias apuntan hacia adentro** (hacia el dominio) y nunca hacia afuera. La persistencia es un adaptador que implementa un puerto definido por el dominio. El dominio no sabe nada de bases de datos.

| Aspecto | Capas tradicionales | Hexagonal |
|--------|-------------------|-----------|
| Dirección de dependencias | Presentación → Negocio → Persistencia | Infraestructura → Aplicación → Dominio |
| Acoplamiento del dominio | El dominio depende de la infraestructura de persistencia (importa clases de ORM, DAOs) | El dominio no depende de nada externo |
| Testabilidad | Difícil probar negocio sin base de datos (necesita mocks complejos o levantar toda la capa de datos) | El dominio se prueba unitariamente sin ningún recurso externo |
| Cambio de tecnología | Sustituir la base de datos o la UI puede obligar a reescribir la capa de negocio | Añadir un nuevo adaptador no toca el dominio |
| Organización | Capas como grandes bloques monolíticos | Módulos basados en puertos y adaptadores (hexágono interior vs. exterior) |
| Ciclo de acoplamiento | La lógica de negocio conoce los detalles de infraestructura | La infraestructura conoce las abstracciones del dominio |

## El problema del “código de negocio atrapado”
En las capas tradicionales, la lógica de negocio suele quedar esparcida entre servicios que también contienen código de acceso a datos, validaciones de UI o formateo. La hexagonal fuerza la separación en el propio diseño: el hexágono no permite que un servicio de dominio toque una base de datos. Cada pieza está en su sitio.

## Conclusión
La arquitectura en capas tradicional es más simple de entender inicialmente, pero no escala bien en complejidad de negocio. La hexagonal es una evolución que corrige el acoplamiento a la infraestructura mediante la inversión de dependencias, siendo más adecuada para sistemas con lógica de negocio rica y cambiante.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Manejo de transacciones](../5-patrones-y-buenas-practicas/05-manejo-de-transacciones.md) | [🏠 Inicio](../index.md) | [Hexagonal vs. Onion Architecture (Arquitectura Cebolla) ▶](02-hexagonal-vs-onion-architecture-arquitectura-cebolla.md) |
