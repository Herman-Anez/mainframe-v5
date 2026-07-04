# Lenguaje ubicuo

El Lenguaje Ubicuo (UL) es el pegamento social y técnico de DDD. No es un diccionario ni una documentación al margen: es el idioma vivo que se encarna en el código, las conversaciones y los tests.

## Más que un glosario
Un glosario es estático y a menudo se ignora. El UL es un lenguaje compartido **en uso** que evoluciona con el entendimiento del dominio. Sus principios:

- **Se forja en colaboración:** desarrolladores y expertos del dominio negocian los términos hasta que haya acuerdo y precisión. No es impuesto por un solo lado.
- **Tiene un único significado por contexto:** "cliente" en Ventas es distinto que "cliente" en Soporte. Cada Bounded Context tendrá su propio UL.
- **Se expresa en el código:** nombres de clases, métodos, propiedades, parámetros, módulos y tests deben hablar el lenguaje del negocio, no el de la tecnología. Si un experto lee el código, debería entender el flujo de negocio sin traducción mental.

## Construcción y refinamiento iterativo
1. **Sesiones de descubrimiento:** mediante conversaciones, ejemplos concretos y escenarios. Los términos que surgen se anotan tal cual, incluso si hay ambigüedades.
2. **Desambiguación y definición conjunta:** se busca precisión. "¿Cuando dices ‘pedido pendiente’, te refieres a pendiente de pago o de envío?". Se acuerda el significado y se documenta de forma ligera.
3. **Codificación:** al implementar el modelo, el desarrollador traduce esos términos en el código. Si el código utiliza `Order.pendingPayment` y no un genérico `status = 1`, se fortalece el UL.
4. **Feedback desde el código:** los desarrolladores pueden descubrir que una palabra no encaja en el modelo o que falta un concepto. Se vuelve al experto para refinar.
5. **Refinamiento continuo:** el negocio cambia, el lenguaje cambia. El equipo debe mantener una conversación permanente para actualizar el modelo y el lenguaje a la vez.

## Ejemplo de divergencia sin UL
Imaginemos que el experto habla de “cuenta contable” y el desarrollador crea una clase `Account`. Luego, en otra área, el experto usa “cuenta” para referirse al “perfil de usuario”. El desarrollador reutiliza la misma clase `Account` para ambos. Con el tiempo, `Account` acumula atributos contables y de perfil, se vuelve confuso y surge la pregunta: “¿qué es una cuenta exactamente?”. El UL habría forzado dos conceptos explícitos: `AccountingAccount` y `UserProfile` en contextos separados.

## Lenguaje ubicuo y pruebas
El UL también vive en los tests, que actúan como especificación ejecutable del dominio. Un test escrito en lenguaje de negocio (`Cuando_un_cliente_realiza_un_pedido_superior_a_1000_euros_se_aplica_descuento_vip`) es más valioso que uno técnico. Frameworks como Cucumber o SpecFlow llevan esto al extremo con Gherkin. Al escribir tests, el equipo refina el UL y detecta imprecisiones.

## Anti-patrones
- **Doble lenguaje:** hablar diferente en reuniones y en código (ej. “póliza” en la conversación, `InsuranceContract` en el código). El coste de traducción recae en el desarrollador.
- **Jerga técnica en el modelo de dominio:** incluir `PolicyManagerHelper` o `AccountDTO` en el dominio. Los detalles de infraestructura deben estar fuera del modelo.
- **Términos ambiguos que sobrecargan un concepto:** por ejemplo, “producto” como “artículo físico”, “producto financiero” y “producto en catálogo” en un solo contexto.
- **Vocabulario impuesto por la herramienta:** si el framework obliga a ciertos nombres, se crea una capa de adaptación para que el dominio no se contamine.

## Relación con el diseño estratégico
El UL es local a un Bounded Context. Al dibujar un Context Map, cada contexto debe tener su propio glosario UL. Al integrar contextos, los términos se traducen (a través de una Capa Anticorrupción o un Published Language). Sin un UL sólido, los Bounded Contexts se desdibujan y el modelo canónico se corrompe.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Dominio y subdominios](01-dominio-y-subdominios.md) | [🏠 Inicio](../index.md) | [Bounded context ▶](03-bounded-context.md) |
