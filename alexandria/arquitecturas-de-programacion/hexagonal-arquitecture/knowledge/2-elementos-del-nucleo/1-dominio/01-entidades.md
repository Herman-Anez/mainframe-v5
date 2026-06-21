# Entidades

## Definición
Una entidad es un objeto del dominio definido por su **identidad continua** y no por sus atributos. Aunque sus propiedades cambien a lo largo del tiempo, la entidad sigue siendo la misma porque posee un identificador único que la distingue de cualquier otra.

## Características esenciales
- **Identidad inmutable**: El identificador (un `UUID`, un código de cliente, un número de pedido) se asigna en el momento de creación y nunca cambia.
- **Mutabilidad controlada**: Los atributos pueden variar, pero siempre respetando las invariantes del negocio. La entidad es dueña de su propia consistencia.
- **Ciclo de vida**: Las entidades se crean, sufren transiciones de estado y eventualmente se archivan o eliminan. El dominio modela explícitamente estos estados y las operaciones que los provocan.
- **Comparación por identidad**: Dos entidades son iguales si comparten el mismo identificador, sin importar el resto de sus campos.

## Rol en la arquitectura hexagonal
Las entidades residen en el centro absoluto del hexágono. No contienen ninguna anotación de persistencia, no heredan de clases base de frameworks y no saben cómo se almacenan. Un `Pedido` conoce sus propias reglas (por ejemplo, «no se puede modificar si el estado es `Enviado`»), pero no sabe si se guarda en una base de datos relacional o en un fichero. Los puertos de repositorio se encargan de devolver agregados completos, no entidades sueltas sin contexto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Flujo de dependencias](../../1-fundamentos/06-flujo-de-dependencias.md) | [🏠 Inicio](../../index.md) | [Value Objects (Objetos de valor) ▶](02-value-objects-objetos-de-valor.md) |
