# Model driven design

**Model-Driven Design** (Diseño Dirigido por el Modelo) es el principio central de DDD que establece que el modelo de dominio debe estar íntimamente conectado con la implementación. El código es la expresión ejecutable del modelo y el modelo evoluciona a partir de la retroalimentación que el código proporciona. No se trata de un análisis previo exhaustivo, sino de un proceso iterativo de refinamiento mutuo entre modelo y código.

## Bucle de realimentación modelo-código
Evans describe un ciclo continuo:
1. **Análisis colaborativo:** se explora el dominio con los expertos y se esboza un modelo mental (a menudo con dibujos, tarjetas, Event Storming).
2. **Codificación:** se plasma ese modelo en código usando los patrones tácticos (entidades, value objects, servicios, etc.). Se aplica el lenguaje ubicuo sin concesiones.
3. **Refinamiento por el código:** al programar aparecen roces, se descubren conceptos que faltan, ambigüedades o mejoras. El código mismo genera nuevas preguntas para los expertos.
4. **Profundización del modelo (Breakthrough):** se produce una mejora repentina en la comprensión del dominio que simplifica radicalmente el modelo. Estas "destilaciones profundas" deben reflejarse inmediatamente en el código.

La clave es que el modelo no es un diagrama estático que se entrega a los desarrolladores, sino una entidad viva que evoluciona con cada iteración. El código es la única verdad del modelo; cualquier documentación separada tiende a desincronizarse.

## Cómo garantizar que el código refleja el modelo
- **Nombrado ubicuo:** clases, métodos y propiedades deben usar los sustantivos y verbos que los expertos del dominio reconocerían sin traducción. `Pedido.confirmar()` en lugar de `Pedido.setEstado(2)`.
- **Comportamiento encapsulado:** el código debe contener la lógica de negocio en los objetos del dominio, no en servicios externos anémicos. Un cambio en el negocio debe implicar un cambio localizado en el modelo.
- **Pruebas como especificación:** las pruebas unitarias y de aceptación se escriben usando el lenguaje ubicuo. Un test `debe_lanzar_error_si_pedido_ya_confirmado` verifica el modelo y a la vez documenta la regla.
- **Refactorización constante hacia el insight:** cuando se gana un nuevo entendimiento, se refactoriza el código para reflejarlo, aunque implique reestructurar módulos o agregados.

## Profundización del modelo (Model Breakthrough)
Es el momento en el que el equipo, tras muchas iteraciones, descubre una abstracción más profunda que simplifica todo el diseño. Señales de que se necesita un breakthrough:
- Complejidad excesiva para expresar reglas aparentemente simples.
- Vocabulario confuso entre expertos y desarrolladores.
- Imposibilidad de añadir una nueva funcionalidad sin romper el modelo existente.

Para facilitar breakthroughs:
- Sesiones periódicas de **modelado colaborativo** con expertos, no solo traspaso de requisitos.
- Cuestionar supuestos: "¿Por qué llamamos a esto Cliente? ¿Realmente es un Cliente o sería más preciso Comprador?"
- Explorar múltiples modelos alternativos en pizarra antes de codificar.

## Anti-patrones comunes
- **Modelo solo en papel:** se diseña un UML exhaustivo al inicio y luego se codifica de manera mecánica. El modelo se estanca y el código diverge.
- **Código sin modelo:** se programa directamente desde casos de uso sin un modelo explícito, cayendo en procedimentalismo y anemicidad.
- **Análisis parálisis:** se dedica demasiado tiempo a modelar sin validar con código, por miedo a equivocarse. La iteración código-modelo es la única forma de validar.
- **Modelo desconectado del lenguaje ubicuo:** se usan términos técnicos en el código y términos de negocio en la documentación; la desconexión hace que el equipo no se entienda.
