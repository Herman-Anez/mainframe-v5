

### `partnership.md`

La **Partnership** (sociedad) es un patrón de integración donde dos equipos —cada uno responsable de su propio Bounded Context— establecen una relación de colaboración estrecha, simétrica y a largo plazo. A diferencia de una relación cliente-proveedor, aquí no hay una dirección única de dependencia; ambas partes se necesitan mutuamente para tener éxito y la comunicación es bidireccional continua.

#### Características fundamentales
- **Interdependencia recíproca:** el contexto A necesita que B exponga cierta funcionalidad, y B necesita que A consuma sus cambios de manera oportuna. El fallo de uno afecta seriamente al otro.
- **Coordinación de entregas:** los equipos planifican juntos sus sprints o hitos, sincronizando fechas de despliegue y versiones de interfaces.
- **Confianza y transparencia:** existe una cultura de compartir avances, problemas y decisiones de diseño. No hay “sorpresas” de última hora.
- **Propiedad compartida de la interfaz:** la API, los contratos de eventos o el esquema de datos no pertenecen exclusivamente a un equipo; ambos los definen y evolucionan de común acuerdo. En ocasiones incluso comparten un repositorio de pruebas de integración.
- **Evolución conjunta del modelo:** aunque cada contexto mantiene su propio modelo canónico, los cambios que afectan a la integración se discuten y se modelan juntos. Es habitual que miembros de ambos equipos participen en sesiones de Event Storming conjuntas.

#### Cuándo aplicar Partnership
- Ambos contextos forman parte del **Core Domain** o están fuertemente ligados a la propuesta de valor, y no es viable aislarlos completamente.
- La lógica de negocio cruza frecuentemente las fronteras (por ejemplo, el contexto de “Gestión de Pedidos” y el de “Logística” necesitan intercambiar información en tiempo real con reglas complejas).
- Los equipos pertenecen a la misma área organizativa o tienen una fuerte cultura de colaboración.
- El costo de formalizar una separación estricta (ACLs, contratos inamovibles) es mayor que el de coordinarse.

#### Riesgos y desventajas
- **Alto coste de comunicación:** requiere reuniones frecuentes, lo cual puede ralentizar a equipos que de otro modo serían autónomos. Si el equipo crece, la coordinación se vuelve exponencial.
- **Acoplamiento temporal:** los despliegues pueden quedar bloqueados hasta que ambos equipos estén listos, lo que contradice los principios de entrega continua.
- **Dependencia de personas y relaciones:** si la colaboración se basa solo en la buena voluntad de líderes concretos, un cambio organizativo puede romper la partnership.
- **Fragilidad ante la distancia geográfica o cultural:** la comunicación asíncrona puede no ser suficiente para la fineza que requiere una Partnership.

#### Diferencias con otros patrones
- **Frente a Customer-Supplier:** en Customer-Supplier el downstream es cliente, el upstream es proveedor y la relación es asimétrica. En Partnership, ambos se adaptan mutuamente.
- **Frente a Shared Kernel:** el Shared Kernel comparte *código o modelo* físico entre contextos. La Partnership puede existir sin compartir código, solo mediante interfaces acordadas y una cultura de trabajo común. En la práctica, una Partnership a menudo recomienda usar un Shared Kernel para formalizar ese acoplamiento, pero no es obligatorio.

#### Implementación práctica
1. Establecer un **foro de integración recurrente** (semanal o quincenal) donde se revisen las necesidades de ambos lados.
2. Mantener un **contrato de API versionado y pactado** en un repositorio compartido, con validación automática (ej. pruebas de contrato con Pact).
3. Crear **pruebas de integración end-to-end conjuntas** que validen el flujo de negocio completo, no solo la conexión técnica.
4. Acordar un **procedimiento de cambios de última hora** (quiénes pueden aprobar, qué rompe la compatibilidad).

La Partnership es el patrón más exigente desde el punto de vista organizativo y debe reevaluarse periódicamente. Si la colaboración empieza a generar fricciones, conviene migrar hacia Customer-Supplier o aislar más los contextos con una ACL.

---

### `shared-kernel.md`

Un **Shared Kernel** (núcleo compartido) es una porción del modelo de dominio y/o del código fuente que dos o más Bounded Contexts deciden compartir de forma explícita. Esa parte se extrae en un módulo, biblioteca o paquete común sobre el cual ambos equipos tienen responsabilidad conjunta y consensuan cualquier modificación.

#### Naturaleza del kernel compartido
- **Es un acuerdo, no una coincidencia:** no es simplemente reutilizar una utilidad; es declarar que una parte del modelo es común por razones de negocio y se gestiona como un activo compartido.
- **Tamaño acotado:** debe ser pequeño y estable. Cuanto mayor se vuelve el kernel, más acoplamiento genera y más difícil es de gestionar. La heurística de Evans: “el Shared Kernel debe ser tan pequeño que apenas se note, pero tan profundo que realmente aporte valor”.
- **Pertenece al lenguaje ubicuo de ambos contextos:** los términos y conceptos del kernel tienen exactamente el mismo significado en los dos contextos. Si hay la más mínima divergencia semántica, no debería formar parte del kernel.

#### Ejemplo típico
En un sistema de gestión académica, los contextos “Matrícula” y “Calificaciones” comparten el concepto de `Alumno` (identificador, nombre, plan de estudios). Ambos equipos se coordinan para mantener una definición común de `Alumno` y una tabla compartida de datos maestros, evitando así duplicar y desincronizar los datos básicos.

#### Coordinación y reglas de juego
- **Propiedad compartida sin dueño único:** cualquier cambio en el kernel debe ser aceptado por todas las partes. En la práctica, se suele designar un “guardián del kernel” o se utiliza un proceso de pull request obligatorio con revisores de ambos equipos.
- **Pruebas conjuntas:** las pruebas del kernel son responsabilidad de todos los contextos que lo usan. Si un cambio en el kernel rompe un test en el contexto A, no se integra hasta que se solucione.
- **Estrategia de versionado:** aunque se comparta en tiempo de compilación, es recomendable versionar el kernel para que cada contexto pueda migrar a su ritmo, sobre todo si los ciclos de despliegue son distintos.
- **Prohibido extender el kernel arbitrariamente:** si un contexto necesita añadir atributos a una entidad del kernel, debe hacerlo en su propio modelo mediante composición o herencia (si es value object mejor no heredar), pero no en el kernel común. El kernel solo contiene lo estrictamente común.

#### Cuándo usar Shared Kernel
- Cuando la duplicación de un concepto clave y su sincronización manual resulta más costosa y propensa a errores que el acoplamiento generado.
- Para datos maestros de alta estabilidad (monedas, países, unidades de medida) que son idénticos en múltiples contextos y cambian muy raramente.
- En equipos que ya trabajan en Partnership y necesitan formalizar su colaboración en una base de código.

#### Cuándo evitarlo
- **Cuando los ciclos de entrega son muy dispares:** un equipo que despliega semanalmente no puede quedar bloqueado por uno que despliega cada tres meses.
- **Si los contextos pertenecen a subdominios de naturaleza distinta (core vs. genérico):** un concepto “compartido” puede esconder diferencias semánticas que a la larga corrompen los modelos.
- **Si no hay una comunicación fluida entre equipos:** el kernel se convierte en cuello de botella y fuente de conflictos.

#### Relación con otros patrones
Un Shared Kernel es a menudo la materialización técnica de una Partnership o Customer-Supplier cuando se decide compartir artefactos. Pero también puede existir en una relación conformista forzada (poco recomendable). Siempre que se use, el contexto debe indicarse explícitamente en el Context Map con el estereotipo `[SK]` y enumerar qué elementos pertenecen al kernel.

#### Degradación y eliminación
Con el tiempo, es posible que los modelos de los contextos diverjan y el kernel deje de representar realmente lo común. En ese momento debe **extirparse**: cada equipo incorpora lo que necesita a su modelo, se duplica la funcionalidad y se elimina la dependencia compartida. La tendencia moderna con microservicios suele preferir la duplicación controlada de datos antes que mantener un Shared Kernel complejo.

---

### `customer-supplier.md`

El patrón **Customer-Supplier** (Cliente-Proveedor) define una relación asimétrica entre dos Bounded Contexts: un contexto **Upstream** (proveedor) suministra un servicio o datos a uno o varios contextos **Downstream** (clientes). A diferencia del Conformista, el proveedor sí se compromete a considerar y satisfacer las necesidades de sus clientes, aunque mantiene su autonomía y toma las decisiones finales sobre su modelo.

#### Roles y responsabilidades
- **Proveedor (Supplier):**
  - Publica una API o feed de datos estable y funcional.
  - Establece un canal para recibir peticiones, necesidades y feedback del cliente (reuniones periódicas, backlog compartido, embajadores).
  - Prioriza las demandas de los clientes en su roadmap en función de la criticidad para el negocio, no solo por requerimiento técnico.
  - Puede rechazar peticiones que desvirtúen su modelo, pero debe comunicar claramente los motivos y ofrecer alternativas.
- **Cliente (Customer):**
  - Consume la interfaz del proveedor adaptándose a su modelo en la medida en que el proveedor no puede satisfacer todas sus necesidades.
  - Notifica al proveedor cualquier limitación, bug o necesidad futura.
  - Planifica su trabajo asumiendo el roadmap y tiempos del proveedor. No puede forzar un cambio inmediato.
  - Puede optar por construir una ACL local si la interfaz ofrecida es demasiado genérica o sucia para su propio dominio, pero la relación sigue siendo Customer-Supplier porque existe comunicación.

#### Estableciendo la relación
1. **Acuerdo de nivel de servicio (SLA informal):** no necesariamente un contrato legal, sino expectativas claras: “los cambios en la API se anunciarán con 2 sprints de antelación”, “los bugs críticos se corrigen en 24h”.
2. **Grupo de trabajo cliente-proveedor:** reuniones mensuales con representantes de los equipos cliente y proveedor para revisar backlog y planificación.
3. **Pruebas de aceptación conjuntas:** los clientes definen pruebas de aceptación automatizadas (por ejemplo, con herramientas como Pact) que el proveedor integra en su pipeline. Si alguna prueba falla, el proveedor sabe que rompería a un cliente.
4. **Priorización basada en valor de negocio:** el proveedor no implementa todo lo que el cliente pide, pero atiende lo que tiene impacto directo en los objetivos estratégicos compartidos.

#### Ventajas frente a Partnership
- Menor carga de comunicación y acoplamiento. Cada equipo puede tener su propia cadencia de despliegue.
- El proveedor conserva la autoridad sobre su modelo, evitando que los clientes dicten su diseño interno y lo conviertan en un Big Ball of Mud.
- Escala mejor que la Partnership: un proveedor puede atender varios clientes (aunque cada cliente añade complejidad de priorización).

#### Desafíos y riesgos
- **Desconexión gradual:** si el proveedor no dedica tiempo real a los clientes, la relación degenera en un Conformista de facto, causando frustración.
- **Cuello de botella:** si el proveedor concentra demasiada lógica y todos los clientes dependen de él, se convierte en un monolito organizacional que frena la innovación.
- **Conflicto de intereses:** los clientes empujan por cambios que solo les benefician a ellos; el proveedor debe proteger la integridad del modelo común y el bien del colectivo.
- **Dependencia no gestionada:** si el proveedor decide una refactorización profunda sin avisar, los clientes sufren.

#### Customer-Supplier en entornos modernos
Es el patrón por defecto para equipos de plataforma que ofrecen servicios internos a equipos de producto. La API del proveedor suele incluir una capa de Open Host Service con un Published Language, mientras que internamente implementa su propia lógica de dominio. La relación se mantiene fluida con contratos orientados al consumidor (Consumer-Driven Contracts).

#### Señales de que hay que evolucionar
- Si la colaboración es tan intensa que ambos equipos se bloquean mutuamente con frecuencia, tal vez deban fusionarse temporalmente en Partnership o segregar el dominio de forma diferente.
- Si el cliente empieza a replicar datos del proveedor y a construir lógica propia masivamente, puede ser síntoma de que necesita su propio contexto o una ACL completa.

---

### `conformist.md`

El patrón **Conformist** (Conformista) describe una relación en la que el contexto Downstream decide **adaptarse completamente al modelo del Upstream sin esperar que el proveedor se ajuste a sus necesidades**. El cliente no tiene influencia sobre el diseño del proveedor y simplemente acepta lo que este le ofrece.

#### ¿Por qué conformarse?
- **Proveedor externo inamovible:** una pasarela de pagos, un ERP comercial, un servicio gubernamental. No hay capacidad de negociación ni interés del proveedor en adaptarse a un cliente concreto.
- **Proveedor interno con recursos limitados o sin interés:** un equipo que mantiene un sistema heredado y no tiene capacidad para atender peticiones. Intentar forzar cambios sería costoso y frustrante.
- **Costo de aislamiento mayor que el beneficio:** si el modelo del proveedor es razonablemente limpio y las diferencias con el modelo del cliente son mínimas, construir una ACL supone un sobreesfuerzo injustificado. El cliente se ahorra la capa de traducción.

#### Implicaciones del conformismo
- El lenguaje ubicuo del proveedor **se filtra** hasta cierto punto en el contexto cliente. El cliente terminará usando términos y conceptos que no son nativos de su dominio. Ejemplo: en un sistema de facturación que consume un ERP, puede acabar hablando de “centros de coste” aunque su dominio nativo hable de “departamentos”.
- La simplicidad de implementación se paga con **deuda de modelo**. Si en el futuro el cliente necesita independizarse, la refactorización será más dolorosa porque el modelo ajeno ha colonizado partes del código.
- El cliente queda **acoplado a la evolución del proveedor**. Si el proveedor cambia su API o sus conceptos, el cliente debe cambiar a su vez, sin más opción que seguir conformándose o, en ese momento, introducir una ACL.

#### Cuándo es una decisión consciente y aceptable
El conformismo no es malo per se cuando se aplica a **subdominios genéricos o de soporte**. El core domain del cliente debe protegerse; los subdominios genéricos pueden sacrificar pureza de modelo en aras de la velocidad. Por ejemplo, el contexto de “RRHH” puede conformarse al modelo de un SaaS de nóminas porque no es su core.

#### Cómo mitigar los efectos negativos
- **Aislar el conformismo en una capa de infraestructura:** aunque no se construya una ACL completa, se debe evitar que las clases del proveedor se usen directamente en la capa de dominio. Se pueden crear DTOs y repositorios que encapsulan la dependencia, pero que no reinterpretan el modelo.
- **Nombrar con conciencia:** si se usa un término del proveedor, documentar por qué y mantener la trazabilidad.
- **Vigilar la propagación:** si los conceptos del proveedor empiezan a aparecer en el núcleo del dominio, es hora de reconsiderar y colocar una ACL.

#### Diferencia con Customer-Supplier
En Customer-Supplier el proveedor se compromete activamente con los clientes; en Conformist, el proveedor es “sordo” por decisión propia o por imposibilidad. Gráficamente, en el Context Map se suele marcar la relación con una ‘C’ o la palabra ‘Conformist’ en la flecha del downstream hacia el upstream, indicando que el downstream se pliega.

#### De Conformista a ACL
Si el downstream empieza a sufrir demasiado por los cambios del proveedor o el modelo ajeno corrompe su lógica de negocio, puede introducir una **Anticorruption Layer** para aislarse. Esto es común en la evolución de sistemas: primero se integra de forma conformista para validar la necesidad, y si el dolor crece, se invierte en la ACL.

---

### `anticorruption-layer.md`

La **Anticorruption Layer** (ACL, capa anticorrupción) es un patrón defensivo que construye una barrera de traducción entre el modelo de dominio de un contexto Downstream y el modelo de un contexto Upstream (legado, externo o simplemente con un modelo diferente). Su misión es **evitar que los conceptos ajenos contaminen el dominio propio**, permitiendo que cada modelo evolucione de forma independiente.

#### Filosofía: proteger el core domain
El core domain debe ser puro y expresarse en su propio lenguaje ubicuo. Cuando necesitamos integrar un sistema externo, no podemos permitir que sus estructuras de datos, nomenclaturas y lógica se infiltren. La ACL actúa como un traductor bidireccional: las peticiones que salen del dominio se convierten al lenguaje del proveedor, y las respuestas entrantes se transforman en objetos del dominio local.

#### Estructura típica de una ACL
1. **Facade (fachada):** punto de entrada desde la capa de aplicación del dominio cliente. Expone interfaces con el lenguaje del dominio local y oculta la complejidad de la traducción.
2. **Adapters (adaptadores):** implementan las llamadas técnicas al proveedor (REST, SOAP, mensajería, etc.) y convierten formatos de transporte.
3. **Translators / Converters (traductores):** contienen la lógica de mapeo entre los dos modelos. Pueden ser simples mapeos propiedad a propiedad o transformaciones complejas con reglas de negocio de traducción (ej. agregación de datos, enriquecimiento).
4. **Service (opcional):** un servicio de dominio dentro de la ACL que orquesta las traducciones si la lógica es significativa.

Estos componentes viven en la **capa de infraestructura** del contexto cliente, nunca en la capa de dominio. El dominio solo ve interfaces (puertos) que prometen devolver entidades y value objects locales.

#### Ejemplo concreto
Un contexto de “Gestión de Pedidos” (core) necesita consultar el estado de crédito de un cliente desde un sistema financiero heredado (Big Ball of Mud) que devuelve XML con códigos numéricos. La ACL:
- Interfaz en dominio: `CreditService.CheckCredit(CustomerId): CreditLimit`
- Adaptador: llama al servicio SOAP del legado.
- Traductor: convierte el XML en un `CreditLimit` (value object del dominio) y mapea códigos como ‘01’ a `CreditRating.Excellent`. También traduce el `CustomerId` local al `ClientCode` del legado.
El dominio desconoce totalmente SOAP, XML y los códigos del sistema antiguo.

#### Cuándo es imprescindible
- El proveedor tiene un modelo muy distinto o de baja calidad (Big Ball of Mud).
- El cliente es un core domain y la pureza del modelo es estratégica.
- Se prevén múltiples cambios en el proveedor a lo largo del tiempo y se quiere aislar el impacto.
- Se necesita soportar varios proveedores alternativos para una misma funcionalidad (la ACL unifica la interfaz local y cambia el adaptador).

#### Costes y desventajas
- **Complejidad y mantenimiento:** cada cambio en la API del proveedor puede requerir ajustes en la ACL. Si el proveedor cambia a menudo, la ACL exige dedicación continua.
- **Rendimiento:** añade una capa de transformación que puede ser relevante en sistemas de alta carga. Se deben evitar traducciones innecesarias o que requieran muchas consultas extra.
- **Riesgo de sobre-ingeniería:** no todo proveedor merece una ACL. Si el modelo es similar, un simple adaptador sin traducción semántica (Conformista) puede bastar.

#### ACL y eventos de dominio
La ACL puede no solo traducir llamadas síncronas, sino también mensajes asíncronos. Cuando un contexto upstream publica eventos, la ACL del downstream los consume, los traduce a eventos de dominio locales y los despacha internamente, manteniendo la separación de modelos.

#### Patrones relacionados
- **Open Host Service (OHS):** el proveedor implementa un OHS para ofrecer una API limpia; la ACL del cliente puede ser más fina o incluso innecesaria si el OHS ya publica un modelo muy cercano al del cliente.
- **Published Language:** la ACL traduce desde el Published Language del proveedor al modelo local.

La ACL es una de las herramientas más poderosas para la **destilación del core domain**: rodea el núcleo con una coraza que lo mantiene aislado del caos exterior.

---

### `open-host-service.md`

Un **Open Host Service** (OHS, servicio de anfitrión abierto) es un patrón que define la interfaz pública de un Bounded Context como un servicio claramente delimitado, normalmente con un protocolo estándar (REST, gRPC, cola de mensajes) y un modelo de datos publicado. Su objetivo es **ofrecer una única puerta de acceso a las capacidades del contexto**, ocultando los detalles de su implementación interna y su modelo de dominio.

#### Motivación
Cuando múltiples clientes (contextos downstream) necesitan interactuar con un contexto proveedor, cada uno podría requerir una integración diferente. Sin OHS, el proveedor podría verse tentado a exponer partes internas de su modelo o a construir adaptadores específicos por cliente. Con un OHS, el proveedor centraliza el acceso en una API estable y bien diseñada, forzando a todos los clientes a pasar por ella. Esto protege la integridad del dominio proveedor y facilita su evolución interna.

#### Características de un OHS
- **API pública y documentada:** contratos expuestos como endpoints, colas o feeds, con un esquema formal (OpenAPI, protobuf, AsyncAPI). Esta API se convierte en el Published Language del proveedor.
- **Desacoplamiento radical entre lo público y lo interno:** el modelo de dominio del proveedor no se filtra. Los objetos expuestos en la API son DTOs específicamente diseñados para la comunicación; la lógica de dominio permanece privada.
- **Versionado:** la API se versiona para permitir evolución sin romper a los clientes (por ej., `/v1/`, `/v2/` o headers de versión).
- **Múltiples protocolos con un mismo modelo:** un contexto puede ofrecer tanto una API síncrona para consultas como una cola de eventos para notificaciones, siempre bajo el mismo lenguaje publicado.
- **Autoservicio para los consumidores:** idealmente con un portal de desarrolladores, sandboxes y documentación interactiva.

#### Relación con Published Language
El OHS casi siempre va acompañado de un **Published Language** (PL). El PL es el formato de datos estable; el OHS es el mecanismo que lo sirve. Juntos permiten que el proveedor ofrezca una interfaz estandarizada sin necesidad de negociar caso por caso con cada cliente (lo cual sería propio de Customer-Supplier con adaptaciones puntuales). Sin embargo, un OHS puede existir sin un PL formal si el proveedor simplemente expone una API única pero sus datos no se documentan como lenguaje compartido (aunque no es lo recomendable).

#### Cuándo aplicar OHS
- El contexto proveedor tiene muchos clientes actuales o potenciales, y la negociación individual es ineficiente.
- El proveedor quiere libertad para rediseñar su modelo interno sin impacto externo. La API actúa como costura anticorrupción propia.
- Se busca estandarizar la integración en toda la organización.
- El contexto proveedor implementa un **subdominio genérico** que será consumido por múltiples core domains (ej. un servicio de notificaciones centralizado).

#### Ventajas
- **Reduce el acoplamiento:** los clientes dependen de una interfaz estable, no de la estructura interna del proveedor.
- **Simplifica la gobernanza:** un cambio en la implementación no requiere modificar a los clientes si la API se mantiene.
- **Facilita la evolución independiente:** el equipo proveedor puede desplegar con confianza.
- **Escalabilidad organizativa:** nuevos clientes se integran sin añadir carga de comunicación al equipo proveedor.

#### Desventajas y riesgos
- **Costo inicial y de mantenimiento:** diseñar una buena API requiere esfuerzo de modelado y disciplina para no romper contratos.
- **Riesgo de API demasiado genérica:** al querer satisfacer a todos, la API puede volverse anémica o demasiado compleja (efecto “menú infinito”).
- **No elimina la necesidad de traducción en los clientes:** un OHS ofrece un modelo publicado, pero si este difiere mucho del modelo del cliente, este aún necesitará una ACL local. La responsabilidad de traducción se desplaza al cliente.

#### Ejemplo
Un contexto de “Gestión de Catálogo de Productos” expone un OHS REST con endpoints como `GET /products/{id}` y `POST /search`. Publica un esquema JSON de producto con campos estandarizados. Los clientes (web de e-commerce, app móvil, sistema de recomendaciones) consumen esa misma API. Si el equipo rediseña la base de datos del catálogo, la API no cambia (o lo hace con una nueva versión).

---

### `published-language.md`

El **Published Language** (Lenguaje Publicado) es un modelo de datos canónico, bien documentado y estable, que se utiliza como medio de intercambio entre Bounded Contexts. Representa un idioma común aceptado por varios equipos para la comunicación técnica, ya sea de forma síncrona (API) o asíncrona (eventos/mensajes).

#### Naturaleza del lenguaje publicado
- **Es un acuerdo de formato, no un modelo de dominio compartido:** cada contexto sigue teniendo su propio modelo interno. El Published Language es la “lingua franca” que hablan en la frontera.
- **Se expresa mediante esquemas formales:** JSON Schema, XML Schema (XSD), Protocol Buffers, Avro, etc. La definición es la fuente de verdad de la integración.
- **Debe ser estable y retrocompatible:** los cambios se gestionan con versionado semántico. Añadir campos opcionales es compatible; eliminar o renombrar campos requiere una nueva versión mayor.
- **Es un subproducto del diseño de API/OHS, o un contrato de eventos independiente:** puede estar contenido dentro de un Open Host Service o ser simplemente la definición de los mensajes en un tópico de Kafka.

#### El Published Language como patrón independiente
Aunque a menudo se asocia con OHS, puede existir solo: dos contextos acuerdan un esquema de eventos que publican y consumen, sin que necesariamente el proveedor exponga una API de servicio completa. El Published Language es el contrato; los equipos pueden usar herramientas como Schema Registry para gobernarlo.

#### Propósito y beneficios
- **Desacoplamiento de modelos:** los contextos no necesitan conocer los detalles internos del otro, solo el lenguaje de intercambio.
- **Interoperabilidad tecnológica:** al ser un formato estándar, distintos lenguajes y plataformas pueden comunicarse.
- **Evolución independiente:** el publicador puede cambiar su lógica interna mientras respete el esquema; el consumidor puede actualizarse a nuevas versiones a su ritmo.
- **Reducción de traducciones puntuales:** en lugar de tener transformaciones específicas para cada par de contextos, se usa un único lenguaje.

#### Desafíos
- **Diseño del lenguaje:** encontrar el equilibrio entre un lenguaje demasiado específico que solo sirve a un caso y uno demasiado genérico que no expresa bien la intención. Normalmente el lenguaje surge del consenso entre los equipos involucrados.
- **Governance:** sin una propiedad clara, el lenguaje puede crecer descontroladamente con campos que solo usa un consumidor, transformándose en un “Big Ball of Mud de integración”.
- **Evolución sin romper:** requiere disciplina. Las pruebas de contrato ayudan a detectar rupturas antes de desplegar.
- **No resuelve diferencias semánticas profundas:** si dos contextos entienden el mismo campo de forma distinta, el Published Language solo traslada el problema (se necesitará una ACL en el consumidor).

#### Ejemplo
En un ecosistema de microservicios, el contexto “Pedidos” publica un evento `OrderPlaced` con un esquema Avro:
```json
{
  "orderId": "string",
  "customerId": "string",
  "total": { "amount": "decimal", "currency": "string" },
  "timestamp": "long"
}
```
Los contextos “Facturación”, “Envíos” y “Recomendaciones” consumen ese mismo evento. El esquema está versionado y alojado en un Schema Registry. Los consumidores no necesitan preguntar a Pedidos cómo se calcula el total; solo necesitan confiar en el contrato.

#### Relación con otros patrones
- **Open Host Service:** el OHS incluye un Published Language para su API.
- **Anticorruption Layer:** la ACL traduce desde el Published Language del proveedor al modelo del cliente. Si el cliente no está de acuerdo con el lenguaje, la ACL hará una transformación adicional.
- **Shared Kernel:** son opuestos. El Shared Kernel comparte modelo y código; el Published Language solo comparte la estructura de datos en la frontera.

---

### `separate-ways.md`

**Separate Ways** (Caminos Separados) es la decisión consciente de que dos Bounded Contexts **no se integrarán**. Cada uno sigue su evolución de forma completamente independiente, sin comunicación técnica entre ellos, aunque puedan estar resolviendo problemas relacionados desde el punto de vista del negocio.

#### ¿Por qué separarse deliberadamente?
- **Costo de integración mayor que el beneficio:** la funcionalidad que se ganaría con la integración no compensa el esfuerzo de desarrollo, mantenimiento y coordinación.
- **Contextos con ciclos de vida y prioridades muy diferentes:** un sistema legacy estable que se va a retirar en un año no merece una integración compleja con un nuevo core domain; se duplica la funcionalidad necesaria temporalmente.
- **Equipos extremadamente autónomos:** en organizaciones grandes con divisiones independientes, a veces es más sano que cada unidad de negocio construya su solución completa sin depender de otras.
- **Duplicación aceptable:** se decide replicar datos y lógica de manera intencionada, asumiendo que la consistencia eventual o incluso la inconsistencia temporal es aceptable. Por ejemplo, dos aplicaciones pueden mantener cada una su propia lista de clientes, actualizada manualmente o mediante procesos batch, porque la sincronización en tiempo real no aporta valor.

#### Implicaciones y riesgos
- **Duplicación de funcionalidad y datos:** se rompe el principio DRY (Don’t Repeat Yourself) a nivel de sistema, pero se preserva la autonomía. Es una compensación estratégica.
- **Posibles incoherencias:** si los datos duplicados no se sincronizan nunca, las decisiones tomadas en cada contexto pueden divergir (ej. un cliente existe en un sistema pero no en otro). El negocio debe aceptar ese riesgo o introducir un mecanismo de reconciliación periódico fuera de la integración en línea.
- **Falta de trazabilidad end-to-end:** los procesos de negocio que cruzan los caminos separados no pueden automatizarse; requerirán intervención manual o sistemas de reporting que extraigan datos de ambos lados.

#### Diferencia con un Conformista o con ignorar la integración
Separate Ways es una decisión activa de diseño, documentada en el Context Map. No es un “no hemos tenido tiempo de integrar”. Es la aceptación de que ambos contextos no necesitan hablarse. En el mapa se representa con una línea discontinua o con la etiqueta “Separate Ways”.

#### Escenarios típicos
- **Módulos de un monolito que se desacoplan temporalmente durante una migración:** en lugar de integrar el viejo y el nuevo sistema, se duplican datos y cada uno opera con su propia copia hasta la migración completa.
- **Aplicaciones de backoffice y core operacional:** el sistema de Business Intelligence puede cargar datos desde un volcado nocturno sin necesidad de integración transaccional con el sistema de pedidos.
- **Startups o MVUs (Minimum Viable Units):** se opta por separar caminos para acelerar la salida al mercado, con la intención de integrarlos en el futuro.

#### Cómo gestionar Separate Ways
- Documentar claramente que la separación es intencionada y las razones de negocio que la justifican.
- Definir un ciclo de reevaluación: cada trimestre, preguntarse si sigue siendo válida o si los costes de la no-integración han crecido.
- Si se decide integrar en el futuro, comenzar por definir un Published Language y un OHS en lugar de acoplarse directamente.

#### Señales de que Separate Ways ya no es suficiente
- Los usuarios se quejan de datos inconsistentes o de tener que introducir la misma información dos veces.
- Surgen procesos manuales costosos para mantener la coherencia.
- La empresa crece y la necesidad de automatización de extremo a extremo se vuelve imperativa.

En ese punto, es momento de migrar a una relación Customer-Supplier o definir una capa de integración.

---

### `big-ball-of-mud.md`

**Big Ball of Mud** (Gran Bola de Barro) no es un patrón deseable, sino el reconocimiento de una realidad: un sistema o Bounded Context cuyo modelo es caótico, sin estructura discernible, con límites borrosos y una enorme deuda técnica. Es el anti-modelo por excelencia, pero DDD nos da herramientas para **contenerlo** en lugar de ignorarlo o intentar reescribirlo de golpe.

#### Características del Big Ball of Mud
- Código con alta complejidad ciclomática, sin separación de responsabilidades.
- Datos accedidos directamente desde múltiples puntos sin control de integridad.
- Inexistencia de un lenguaje ubicuo claro: los mismos términos significan cosas diferentes en distintas partes del código.
- Cambios aparentemente locales provocan efectos colaterales impredecibles.
- La lógica de negocio, la presentación y el acceso a datos están entremezclados.
- Suele ser el resultado de años de desarrollo sin refactorización, alta rotación de personal y falta de diseño.

#### Enfoque DDD: no arreglar, aislar
La estrategia principal es **no intentar convertir un Big Ball of Mud en un dominio bien modelado de forma directa**. Eso sería una tarea titánica y arriesgada. En su lugar, DDD propone:
1. **Reconocerlo como un contexto propio** en el Context Map (con la etiqueta “BBoM”).
2. **Proteger el resto del sistema con Anticorruption Layers (ACLs):** cualquier contexto nuevo o con un modelo limpio que necesite interactuar con el Big Ball of Mud debe hacerlo exclusivamente a través de una ACL. De esta forma, el barro no se filtra.
3. **Estrangulamiento progresivo (Strangler Fig):** poco a poco, se van extrayendo capacidades del Big Ball of Mud hacia nuevos Bounded Contexts con modelos puros. Cada extracción reduce el tamaño y la complejidad del legado, que idealmente termina desapareciendo o quedando como una cáscara que solo delega en los nuevos servicios.

#### El Big Ball of Mud como contexto
- Se documenta en el mapa como cualquier otro contexto, para hacer visible el riesgo. Las relaciones con otros contextos suelen ser de tipo Conformist (si otros lo consumen sin remedio) o ACL (si se protegen).
- No tiene por qué representar un sistema completo; puede ser un módulo dentro de un monolito que es especialmente caótico, mientras que el resto del monolito está mejor estructurado.

#### Cómo tratar con él en la práctica
- **Nunca referenciar el modelo del BBoM en el dominio de otro contexto.** Si es inevitable obtener datos, se crea una ACL que convierta las estructuras anárquicas en value objects o DTOs limpios.
- **Evitar dependencias bidireccionales:** el BBoM puede llamar a nuevos servicios, pero siempre a través de interfaces bien definidas (OHS) y sin acoplarse a sus internals.
- **No invertir en mejoras internas mayores:** salvo correcciones de bugs críticos, el esfuerzo se dedica a la extracción, no a embellecer el barro.
- **Pruebas de regresión superficiales:** dado que es difícil testearlo en profundidad, se crean pruebas de humo que verifiquen que las extracciones no rompen funcionalidad básica.

#### Ejemplo típico
Un sistema de facturación con 20 años de antigüedad que mezcla lógica fiscal, generación de PDFs y envío de correos en procedimientos almacenados. El nuevo sistema de pedidos (core) necesita calcular impuestos. En lugar de invocar el legado directamente, el equipo construye una ACL “Servicio de Impuestos” que llama a un único endpoint moderno implementado sobre el legado o, mejor aún, extrae el motor de impuestos a un nuevo microservicio copiando/refactorizando la lógica. Con el tiempo, el viejo sistema se reduce a una cáscara que solo mantiene el histórico.

#### Implicaciones organizativas
Un Big Ball of Mud a menudo es síntoma de una falta de alineación organizativa o de inversión insuficiente en calidad. El Context Map ayuda a los stakeholders a ver el coste real de mantener ese sistema y a priorizar su sustitución gradual. Es una herramienta de comunicación: “esto es un barro, y cada mes gastamos X horas esquivándolo; necesitamos un plan de extracción”.

---

Estos nueve archivos cubren exhaustivamente todos los patrones de Context Mapping, desde los más colaborativos hasta los defensivos, proporcionando una base sólida para el diseño estratégico en DDD. Cada uno puede ampliarse con ejemplos de código, diagramas y casos de estudio reales según el repositorio evolucione.

---
