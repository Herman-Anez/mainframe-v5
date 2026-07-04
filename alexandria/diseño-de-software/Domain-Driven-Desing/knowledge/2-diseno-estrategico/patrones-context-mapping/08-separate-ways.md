# Separate ways

**Separate Ways** (Caminos Separados) es la decisión consciente de que dos Bounded Contexts **no se integrarán**. Cada uno sigue su evolución de forma completamente independiente, sin comunicación técnica entre ellos, aunque puedan estar resolviendo problemas relacionados desde el punto de vista del negocio.

## ¿Por qué separarse deliberadamente?
- **Costo de integración mayor que el beneficio:** la funcionalidad que se ganaría con la integración no compensa el esfuerzo de desarrollo, mantenimiento y coordinación.
- **Contextos con ciclos de vida y prioridades muy diferentes:** un sistema legacy estable que se va a retirar en un año no merece una integración compleja con un nuevo core domain; se duplica la funcionalidad necesaria temporalmente.
- **Equipos extremadamente autónomos:** en organizaciones grandes con divisiones independientes, a veces es más sano que cada unidad de negocio construya su solución completa sin depender de otras.
- **Duplicación aceptable:** se decide replicar datos y lógica de manera intencionada, asumiendo que la consistencia eventual o incluso la inconsistencia temporal es aceptable. Por ejemplo, dos aplicaciones pueden mantener cada una su propia lista de clientes, actualizada manualmente o mediante procesos batch, porque la sincronización en tiempo real no aporta valor.

## Implicaciones y riesgos
- **Duplicación de funcionalidad y datos:** se rompe el principio DRY (Don’t Repeat Yourself) a nivel de sistema, pero se preserva la autonomía. Es una compensación estratégica.
- **Posibles incoherencias:** si los datos duplicados no se sincronizan nunca, las decisiones tomadas en cada contexto pueden divergir (ej. un cliente existe en un sistema pero no en otro). El negocio debe aceptar ese riesgo o introducir un mecanismo de reconciliación periódico fuera de la integración en línea.
- **Falta de trazabilidad end-to-end:** los procesos de negocio que cruzan los caminos separados no pueden automatizarse; requerirán intervención manual o sistemas de reporting que extraigan datos de ambos lados.

## Diferencia con un Conformista o con ignorar la integración
Separate Ways es una decisión activa de diseño, documentada en el Context Map. No es un “no hemos tenido tiempo de integrar”. Es la aceptación de que ambos contextos no necesitan hablarse. En el mapa se representa con una línea discontinua o con la etiqueta “Separate Ways”.

## Escenarios típicos
- **Módulos de un monolito que se desacoplan temporalmente durante una migración:** en lugar de integrar el viejo y el nuevo sistema, se duplican datos y cada uno opera con su propia copia hasta la migración completa.
- **Aplicaciones de backoffice y core operacional:** el sistema de Business Intelligence puede cargar datos desde un volcado nocturno sin necesidad de integración transaccional con el sistema de pedidos.
- **Startups o MVUs (Minimum Viable Units):** se opta por separar caminos para acelerar la salida al mercado, con la intención de integrarlos en el futuro.

## Cómo gestionar Separate Ways
- Documentar claramente que la separación es intencionada y las razones de negocio que la justifican.
- Definir un ciclo de reevaluación: cada trimestre, preguntarse si sigue siendo válida o si los costes de la no-integración han crecido.
- Si se decide integrar en el futuro, comenzar por definir un Published Language y un OHS en lugar de acoplarse directamente.

## Señales de que Separate Ways ya no es suficiente
- Los usuarios se quejan de datos inconsistentes o de tener que introducir la misma información dos veces.
- Surgen procesos manuales costosos para mantener la coherencia.
- La empresa crece y la necesidad de automatización de extremo a extremo se vuelve imperativa.

En ese punto, es momento de migrar a una relación Customer-Supplier o definir una capa de integración.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Published language](07-published-language.md) | [🏠 Inicio](../../index.md) | [Big ball of mud ▶](09-big-ball-of-mud.md) |
