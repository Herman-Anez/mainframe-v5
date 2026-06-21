# Resumen del ejemplo .NET

La implementación en .NET refleja fielmente los principios hexagonales:

- El **dominio** es un conjunto de clases puras de C# sin dependencias de frameworks.
- Los **puertos** son interfaces C# definidas en `Domain` (secundarios) y `Application` (primarios).
- Los **servicios de aplicación** orquestan el flujo, sin contener lógica de negocio.
- Los **adaptadores** en `Infrastructure` (EF Core, ASP.NET Controllers, Kafka) implementan los puertos y transforman formatos externos en modelos del dominio.
- El **cableado** se centraliza en `Program.cs` y en las extensiones de `IServiceCollection`, donde se eligen las implementaciones concretas.
- Las **pruebas** se estructuran por nivel, usando dobles para los puertos y entornos ligeros (InMemoryDatabase) para integraciones.

Este diseño permite que la aplicación pueda cambiar de base de datos, de sistema de mensajería o de framework web sin que el corazón del negocio sufra ningún cambio. La arquitectura hexagonal en .NET no solo es factible sino que se beneficia del potente sistema de inyección de dependencias y de la madurez del ecosistema.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fragmentos clave](02-fragmentos-clave.md) | [🏠 Inicio](../../index.md) | [Fragmentos clave ▶](../02-fragmentos-clave.md) |
