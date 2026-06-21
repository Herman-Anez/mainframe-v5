# Síntesis de testabilidad en arquitectura hexagonal

La arquitectura hexagonal traza líneas claras que definen exactamente dónde y cómo probar cada componente. El **dominio** se prueba unitariamente sin ningún andamiaje externo. Los **servicios de aplicación** se prueban con dobles de los puertos secundarios, verificando la coordinación. Los **adaptadores** se prueban contra la tecnología real (o simulaciones fieles) para validar la traducción y la comunicación. Los **dobles de prueba** son el mecanismo que habilita el aislamiento, y su uso adecuado permite construir una suite de pruebas rápida, mantenible y alineada con la arquitectura.

Este diseño convierte a la testabilidad en un subproducto estructural, no en un esfuerzo añadido: cada pieza es intrínsecamente testeable porque sus dependencias están invertidas y sus responsabilidades, delimitadas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tests de casos de uso](04-tests-de-casos-de-uso.md) | [🏠 Inicio](../index.md) | [Patrón repositorio ▶](../5-patrones-y-buenas-practicas/01-patron-repositorio.md) |
