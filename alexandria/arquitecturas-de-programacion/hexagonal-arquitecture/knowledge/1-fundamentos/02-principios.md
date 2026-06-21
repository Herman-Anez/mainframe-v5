# Principios

La arquitectura hexagonal se sostiene sobre unos pocos principios fundamentales, que derivan directamente de su motivación.

## 2.1. Principio de inversión de dependencias (DIP)
*“Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.”*

En el contexto hexagonal:
- El dominio (alto nivel) define interfaces (puertos) para lo que necesita del exterior.
- Las implementaciones concretas (bajo nivel) dependen de esas interfaces, no al revés.

Esto invierte la dirección de dependencia respecto a las capas tradicionales: ahora la infraestructura depende del dominio.

## 2.2. Separación estricta de intereses
El dominio solo contiene lógica de negocio pura. No incluye:
- Código de acceso a datos (SQL, ORM, APIs de repositorios).
- Llamadas a servicios externos.
- Formateo de fechas para la vista.
- Anotaciones de frameworks.

Cualquier interés técnico se externaliza en un adaptador. Así, el dominio permanece portable, entendible y testeable.

## 2.3. Testeabilidad innata
Como toda dependencia externa está detrás de un puerto, en los tests se pueden sustituir los adaptadores reales por dobles (stubs, mocks, fakes) sin modificar el dominio. Esto permite pruebas unitarias rápidas del núcleo y pruebas de integración que solo cambian la configuración del inyector de dependencias.

## 2.4. Independencia tecnológica
La aplicación no sabe si se está ejecutando sobre Spring Boot, Node.js, si usa PostgreSQL o MongoDB, o si recibe peticiones HTTP o gRPC. Cambiar cualquiera de estos detalles se reduce a escribir un nuevo adaptador, sin tocar el dominio.

## 2.5. El exterior como “detalle”
Cualquier tecnología externa (framework web, base de datos, sistema de colas) se considera un detalle que puede decidirse en etapas tardías del desarrollo. El dominio se puede construir y validar completamente en memoria, con repositorios simulados.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Origen y motivación](01-origen-y-motivacion.md) | [🏠 Inicio](../index.md) | [Metáfora del hexágono ▶](03-metafora-del-hexagono.md) |
