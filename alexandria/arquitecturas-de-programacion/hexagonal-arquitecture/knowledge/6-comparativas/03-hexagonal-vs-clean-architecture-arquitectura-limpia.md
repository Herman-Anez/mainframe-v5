# Hexagonal vs. Clean Architecture (Arquitectura Limpia)

## Clean Architecture (Robert C. Martin, 2012)
Define un modelo de capas concéntricas:

1. **Entidades** (reglas de negocio de empresa)
2. **Casos de uso** (reglas de negocio de aplicación)
3. **Adaptadores de interfaz** (controladores, gateways, presentadores)
4. **Frameworks y drivers** (web, bases de datos, dispositivos)

La famosa regla de dependencia: *“El código fuente solo puede apuntar hacia adentro. Nada en un círculo interior puede saber algo sobre un círculo exterior.”*

## Puntos en común
- Ambas son arquitecturas que aplican DIP y aíslan el dominio.
- Ambas ponen la lógica de negocio en el centro, libre de frameworks.
- Los "Adaptadores de interfaz" de Clean Architecture se corresponden con los "Adaptadores" de la hexagonal.
- Los "Casos de uso" de Clean Architecture equivalen a los servicios de aplicación y puertos primarios de la hexagonal.
- El cuarto círculo (Frameworks & Drivers) es equivalente a la capa de infraestructura de la hexagonal.

## Diferencias y matices

| Aspecto | Clean Architecture | Hexagonal |
|--------|-------------------|-----------|
| Vocabulario | Entidades, Casos de Uso, Adaptadores de Interfaz, Frameworks | Dominio, Puertos (primarios/secundarios), Adaptadores (primarios/secundarios), Infraestructura |
| El "puerto" como concepto | Habla de "gateways" para comunicación externa (persistencia), pero el concepto de puerto no está tan formalizado | Define explícitamente puertos primarios y secundarios como contratos dentro del hexágono |
| Número de círculos/capas | Cuatro círculos fijos | Hexágono no prescribe un número de capas internas; puedes tener dominio y aplicación dentro del núcleo. La metáfora del hexágono se centra más en los bordes que en la estratificación interior. |
| Enfoque en la entrega | Pone énfasis en los "presentadores" y el flujo de datos hacia la UI (Modelo de Vista) | Trata la UI como un adaptador más, sin detallar cómo se construye la vista |
| Origen y comunidad | Muy popular gracias al libro de Uncle Bob y al artículo de 2012 | Más antigua (2005), originalmente una idea de Alistair Cockburn; ha resurgido con fuerza en DDD y microservicios |

## Superposición en la práctica
Clean Architecture se puede ver como una **formalización de la hexagonal con un enriquecimiento del interior** (separación explícita entre Entidades y Casos de Uso). De hecho, muchos diagramas de Clean Architecture dibujan un hexágono en lugar de un círculo. Son perfectamente compatibles: puedes diseñar con puertos y adaptadores (hexagonal) y estructurar el interior siguiendo la estratificación de Clean Architecture. El corazón de ambos es idéntico: proteger la lógica de negocio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Hexagonal vs. Onion Architecture (Arquitectura Cebolla)](02-hexagonal-vs-onion-architecture-arquitectura-cebolla.md) | [🏠 Inicio](../index.md) | [Hexagonal y microservicios ▶](04-hexagonal-y-microservicios.md) |
