# Anticorruption layer

La **Anticorruption Layer** (ACL, capa anticorrupción) es un patrón defensivo que construye una barrera de traducción entre el modelo de dominio de un contexto Downstream y el modelo de un contexto Upstream (legado, externo o simplemente con un modelo diferente). Su misión es **evitar que los conceptos ajenos contaminen el dominio propio**, permitiendo que cada modelo evolucione de forma independiente.

## Filosofía: proteger el core domain
El core domain debe ser puro y expresarse en su propio lenguaje ubicuo. Cuando necesitamos integrar un sistema externo, no podemos permitir que sus estructuras de datos, nomenclaturas y lógica se infiltren. La ACL actúa como un traductor bidireccional: las peticiones que salen del dominio se convierten al lenguaje del proveedor, y las respuestas entrantes se transforman en objetos del dominio local.

## Estructura típica de una ACL
1. **Facade (fachada):** punto de entrada desde la capa de aplicación del dominio cliente. Expone interfaces con el lenguaje del dominio local y oculta la complejidad de la traducción.
2. **Adapters (adaptadores):** implementan las llamadas técnicas al proveedor (REST, SOAP, mensajería, etc.) y convierten formatos de transporte.
3. **Translators / Converters (traductores):** contienen la lógica de mapeo entre los dos modelos. Pueden ser simples mapeos propiedad a propiedad o transformaciones complejas con reglas de negocio de traducción (ej. agregación de datos, enriquecimiento).
4. **Service (opcional):** un servicio de dominio dentro de la ACL que orquesta las traducciones si la lógica es significativa.

Estos componentes viven en la **capa de infraestructura** del contexto cliente, nunca en la capa de dominio. El dominio solo ve interfaces (puertos) que prometen devolver entidades y value objects locales.

## Ejemplo concreto
Un contexto de “Gestión de Pedidos” (core) necesita consultar el estado de crédito de un cliente desde un sistema financiero heredado (Big Ball of Mud) que devuelve XML con códigos numéricos. La ACL:
- Interfaz en dominio: `CreditService.CheckCredit(CustomerId): CreditLimit`
- Adaptador: llama al servicio SOAP del legado.
- Traductor: convierte el XML en un `CreditLimit` (value object del dominio) y mapea códigos como ‘01’ a `CreditRating.Excellent`. También traduce el `CustomerId` local al `ClientCode` del legado.
El dominio desconoce totalmente SOAP, XML y los códigos del sistema antiguo.

## Cuándo es imprescindible
- El proveedor tiene un modelo muy distinto o de baja calidad (Big Ball of Mud).
- El cliente es un core domain y la pureza del modelo es estratégica.
- Se prevén múltiples cambios en el proveedor a lo largo del tiempo y se quiere aislar el impacto.
- Se necesita soportar varios proveedores alternativos para una misma funcionalidad (la ACL unifica la interfaz local y cambia el adaptador).

## Costes y desventajas
- **Complejidad y mantenimiento:** cada cambio en la API del proveedor puede requerir ajustes en la ACL. Si el proveedor cambia a menudo, la ACL exige dedicación continua.
- **Rendimiento:** añade una capa de transformación que puede ser relevante en sistemas de alta carga. Se deben evitar traducciones innecesarias o que requieran muchas consultas extra.
- **Riesgo de sobre-ingeniería:** no todo proveedor merece una ACL. Si el modelo es similar, un simple adaptador sin traducción semántica (Conformista) puede bastar.

## ACL y eventos de dominio
La ACL puede no solo traducir llamadas síncronas, sino también mensajes asíncronos. Cuando un contexto upstream publica eventos, la ACL del downstream los consume, los traduce a eventos de dominio locales y los despacha internamente, manteniendo la separación de modelos.

## Patrones relacionados
- **Open Host Service (OHS):** el proveedor implementa un OHS para ofrecer una API limpia; la ACL del cliente puede ser más fina o incluso innecesaria si el OHS ya publica un modelo muy cercano al del cliente.
- **Published Language:** la ACL traduce desde el Published Language del proveedor al modelo local.

La ACL es una de las herramientas más poderosas para la **destilación del core domain**: rodea el núcleo con una coraza que lo mantiene aislado del caos exterior.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Conformist](04-conformist.md) | [🏠 Inicio](../../index.md) | [Open host service ▶](06-open-host-service.md) |
