# Big ball of mud

**Big Ball of Mud** (Gran Bola de Barro) no es un patrón deseable, sino el reconocimiento de una realidad: un sistema o Bounded Context cuyo modelo es caótico, sin estructura discernible, con límites borrosos y una enorme deuda técnica. Es el anti-modelo por excelencia, pero DDD nos da herramientas para **contenerlo** en lugar de ignorarlo o intentar reescribirlo de golpe.

## Características del Big Ball of Mud
- Código con alta complejidad ciclomática, sin separación de responsabilidades.
- Datos accedidos directamente desde múltiples puntos sin control de integridad.
- Inexistencia de un lenguaje ubicuo claro: los mismos términos significan cosas diferentes en distintas partes del código.
- Cambios aparentemente locales provocan efectos colaterales impredecibles.
- La lógica de negocio, la presentación y el acceso a datos están entremezclados.
- Suele ser el resultado de años de desarrollo sin refactorización, alta rotación de personal y falta de diseño.

## Enfoque DDD: no arreglar, aislar
La estrategia principal es **no intentar convertir un Big Ball of Mud en un dominio bien modelado de forma directa**. Eso sería una tarea titánica y arriesgada. En su lugar, DDD propone:
1. **Reconocerlo como un contexto propio** en el Context Map (con la etiqueta “BBoM”).
2. **Proteger el resto del sistema con Anticorruption Layers (ACLs):** cualquier contexto nuevo o con un modelo limpio que necesite interactuar con el Big Ball of Mud debe hacerlo exclusivamente a través de una ACL. De esta forma, el barro no se filtra.
3. **Estrangulamiento progresivo (Strangler Fig):** poco a poco, se van extrayendo capacidades del Big Ball of Mud hacia nuevos Bounded Contexts con modelos puros. Cada extracción reduce el tamaño y la complejidad del legado, que idealmente termina desapareciendo o quedando como una cáscara que solo delega en los nuevos servicios.

## El Big Ball of Mud como contexto
- Se documenta en el mapa como cualquier otro contexto, para hacer visible el riesgo. Las relaciones con otros contextos suelen ser de tipo Conformist (si otros lo consumen sin remedio) o ACL (si se protegen).
- No tiene por qué representar un sistema completo; puede ser un módulo dentro de un monolito que es especialmente caótico, mientras que el resto del monolito está mejor estructurado.

## Cómo tratar con él en la práctica
- **Nunca referenciar el modelo del BBoM en el dominio de otro contexto.** Si es inevitable obtener datos, se crea una ACL que convierta las estructuras anárquicas en value objects o DTOs limpios.
- **Evitar dependencias bidireccionales:** el BBoM puede llamar a nuevos servicios, pero siempre a través de interfaces bien definidas (OHS) y sin acoplarse a sus internals.
- **No invertir en mejoras internas mayores:** salvo correcciones de bugs críticos, el esfuerzo se dedica a la extracción, no a embellecer el barro.
- **Pruebas de regresión superficiales:** dado que es difícil testearlo en profundidad, se crean pruebas de humo que verifiquen que las extracciones no rompen funcionalidad básica.

## Ejemplo típico
Un sistema de facturación con 20 años de antigüedad que mezcla lógica fiscal, generación de PDFs y envío de correos en procedimientos almacenados. El nuevo sistema de pedidos (core) necesita calcular impuestos. En lugar de invocar el legado directamente, el equipo construye una ACL “Servicio de Impuestos” que llama a un único endpoint moderno implementado sobre el legado o, mejor aún, extrae el motor de impuestos a un nuevo microservicio copiando/refactorizando la lógica. Con el tiempo, el viejo sistema se reduce a una cáscara que solo mantiene el histórico.

## Implicaciones organizativas
Un Big Ball of Mud a menudo es síntoma de una falta de alineación organizativa o de inversión insuficiente en calidad. El Context Map ayuda a los stakeholders a ver el coste real de mantener ese sistema y a priorizar su sustitución gradual. Es una herramienta de comunicación: “esto es un barro, y cada mes gastamos X horas esquivándolo; necesitamos un plan de extracción”.

---

Estos nueve archivos cubren exhaustivamente todos los patrones de Context Mapping, desde los más colaborativos hasta los defensivos, proporcionando una base sólida para el diseño estratégico en DDD. Cada uno puede ampliarse con ejemplos de código, diagramas y casos de estudio reales según el repositorio evolucione.
