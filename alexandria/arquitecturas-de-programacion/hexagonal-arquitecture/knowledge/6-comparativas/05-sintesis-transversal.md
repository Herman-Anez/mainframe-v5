# Síntesis transversal

| Arquitectura | Regla de dependencias | Aislamiento del dominio | Formalización de puertos | Uso típico |
|-------------|----------------------|------------------------|-------------------------|------------|
| Capas tradicional | Hacia abajo (Presentación → Datos) | Débil; el dominio depende de la infraestructura | No existe | Aplicaciones simples, CRUD |
| Hexagonal | Hacia adentro (infra → aplicación → dominio) | Fuerte | Puertos primarios/secundarios y adaptadores | Sistemas con lógica de negocio compleja, DDD |
| Onion | Hacia el centro (infra → app → domain services → domain) | Fuerte | Interfaces, sin nombrar puertos explícitamente | Similar a hexagonal, con énfasis en capas del dominio |
| Clean Architecture | Hacia adentro (frameworks → interface adapters → use cases → entities) | Fuerte | Gateways y presenters como adaptadores | Aplicaciones empresariales, con énfasis en la independencia del framework |
| Hexagonal + Microservicios | Hacia adentro por cada microservicio | Fuerte por servicio | Puertos para APIs síncronas/asíncronas | Sistemas distribuidos, equipos autónomos |

Todas las arquitecturas modernas que anteponen el negocio a la tecnología son variaciones del mismo principio. La hexagonal se distingue por su claridad y simetría al modelar las fronteras: el interior define contratos (puertos), el exterior los cumple (adaptadores). Entender esta base permite navegar con soltura entre la cebolla, la limpia y los microservicios, tomando prestadas las herramientas de cada una sin perder de vista el objetivo común: **proteger el dominio**.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hexagonal y microservicios](04-hexagonal-y-microservicios.md) | [🏠 Inicio](../index.md) | [Estructura de carpetas (Spring Boot + Hexagonal) ▶](../7-ejemplos-de-implementacion/1-ejemplo-spring-boot/01-estructura-de-carpetas-spring-boot-hexagonal.md) |
