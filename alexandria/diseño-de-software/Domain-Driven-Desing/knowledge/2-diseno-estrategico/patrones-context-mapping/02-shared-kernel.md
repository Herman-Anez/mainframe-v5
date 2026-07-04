# Shared kernel

Un **Shared Kernel** (núcleo compartido) es una porción del modelo de dominio y/o del código fuente que dos o más Bounded Contexts deciden compartir de forma explícita. Esa parte se extrae en un módulo, biblioteca o paquete común sobre el cual ambos equipos tienen responsabilidad conjunta y consensuan cualquier modificación.

## Naturaleza del kernel compartido
- **Es un acuerdo, no una coincidencia:** no es simplemente reutilizar una utilidad; es declarar que una parte del modelo es común por razones de negocio y se gestiona como un activo compartido.
- **Tamaño acotado:** debe ser pequeño y estable. Cuanto mayor se vuelve el kernel, más acoplamiento genera y más difícil es de gestionar. La heurística de Evans: “el Shared Kernel debe ser tan pequeño que apenas se note, pero tan profundo que realmente aporte valor”.
- **Pertenece al lenguaje ubicuo de ambos contextos:** los términos y conceptos del kernel tienen exactamente el mismo significado en los dos contextos. Si hay la más mínima divergencia semántica, no debería formar parte del kernel.

## Ejemplo típico
En un sistema de gestión académica, los contextos “Matrícula” y “Calificaciones” comparten el concepto de `Alumno` (identificador, nombre, plan de estudios). Ambos equipos se coordinan para mantener una definición común de `Alumno` y una tabla compartida de datos maestros, evitando así duplicar y desincronizar los datos básicos.

## Coordinación y reglas de juego
- **Propiedad compartida sin dueño único:** cualquier cambio en el kernel debe ser aceptado por todas las partes. En la práctica, se suele designar un “guardián del kernel” o se utiliza un proceso de pull request obligatorio con revisores de ambos equipos.
- **Pruebas conjuntas:** las pruebas del kernel son responsabilidad de todos los contextos que lo usan. Si un cambio en el kernel rompe un test en el contexto A, no se integra hasta que se solucione.
- **Estrategia de versionado:** aunque se comparta en tiempo de compilación, es recomendable versionar el kernel para que cada contexto pueda migrar a su ritmo, sobre todo si los ciclos de despliegue son distintos.
- **Prohibido extender el kernel arbitrariamente:** si un contexto necesita añadir atributos a una entidad del kernel, debe hacerlo en su propio modelo mediante composición o herencia (si es value object mejor no heredar), pero no en el kernel común. El kernel solo contiene lo estrictamente común.

## Cuándo usar Shared Kernel
- Cuando la duplicación de un concepto clave y su sincronización manual resulta más costosa y propensa a errores que el acoplamiento generado.
- Para datos maestros de alta estabilidad (monedas, países, unidades de medida) que son idénticos en múltiples contextos y cambian muy raramente.
- En equipos que ya trabajan en Partnership y necesitan formalizar su colaboración en una base de código.

## Cuándo evitarlo
- **Cuando los ciclos de entrega son muy dispares:** un equipo que despliega semanalmente no puede quedar bloqueado por uno que despliega cada tres meses.
- **Si los contextos pertenecen a subdominios de naturaleza distinta (core vs. genérico):** un concepto “compartido” puede esconder diferencias semánticas que a la larga corrompen los modelos.
- **Si no hay una comunicación fluida entre equipos:** el kernel se convierte en cuello de botella y fuente de conflictos.

## Relación con otros patrones
Un Shared Kernel es a menudo la materialización técnica de una Partnership o Customer-Supplier cuando se decide compartir artefactos. Pero también puede existir en una relación conformista forzada (poco recomendable). Siempre que se use, el contexto debe indicarse explícitamente en el Context Map con el estereotipo `[SK]` y enumerar qué elementos pertenecen al kernel.

## Degradación y eliminación
Con el tiempo, es posible que los modelos de los contextos diverjan y el kernel deje de representar realmente lo común. En ese momento debe **extirparse**: cada equipo incorpora lo que necesita a su modelo, se duplica la funcionalidad y se elimina la dependencia compartida. La tendencia moderna con microservicios suele preferir la duplicación controlada de datos antes que mantener un Shared Kernel complejo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Partnership](01-partnership.md) | [🏠 Inicio](../../index.md) | [Customer supplier ▶](03-customer-supplier.md) |
