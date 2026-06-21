# Published language

El **Published Language** (Lenguaje Publicado) es un modelo de datos canónico, bien documentado y estable, que se utiliza como medio de intercambio entre Bounded Contexts. Representa un idioma común aceptado por varios equipos para la comunicación técnica, ya sea de forma síncrona (API) o asíncrona (eventos/mensajes).

## Naturaleza del lenguaje publicado
- **Es un acuerdo de formato, no un modelo de dominio compartido:** cada contexto sigue teniendo su propio modelo interno. El Published Language es la “lingua franca” que hablan en la frontera.
- **Se expresa mediante esquemas formales:** JSON Schema, XML Schema (XSD), Protocol Buffers, Avro, etc. La definición es la fuente de verdad de la integración.
- **Debe ser estable y retrocompatible:** los cambios se gestionan con versionado semántico. Añadir campos opcionales es compatible; eliminar o renombrar campos requiere una nueva versión mayor.
- **Es un subproducto del diseño de API/OHS, o un contrato de eventos independiente:** puede estar contenido dentro de un Open Host Service o ser simplemente la definición de los mensajes en un tópico de Kafka.

## El Published Language como patrón independiente
Aunque a menudo se asocia con OHS, puede existir solo: dos contextos acuerdan un esquema de eventos que publican y consumen, sin que necesariamente el proveedor exponga una API de servicio completa. El Published Language es el contrato; los equipos pueden usar herramientas como Schema Registry para gobernarlo.

## Propósito y beneficios
- **Desacoplamiento de modelos:** los contextos no necesitan conocer los detalles internos del otro, solo el lenguaje de intercambio.
- **Interoperabilidad tecnológica:** al ser un formato estándar, distintos lenguajes y plataformas pueden comunicarse.
- **Evolución independiente:** el publicador puede cambiar su lógica interna mientras respete el esquema; el consumidor puede actualizarse a nuevas versiones a su ritmo.
- **Reducción de traducciones puntuales:** en lugar de tener transformaciones específicas para cada par de contextos, se usa un único lenguaje.

## Desafíos
- **Diseño del lenguaje:** encontrar el equilibrio entre un lenguaje demasiado específico que solo sirve a un caso y uno demasiado genérico que no expresa bien la intención. Normalmente el lenguaje surge del consenso entre los equipos involucrados.
- **Governance:** sin una propiedad clara, el lenguaje puede crecer descontroladamente con campos que solo usa un consumidor, transformándose en un “Big Ball of Mud de integración”.
- **Evolución sin romper:** requiere disciplina. Las pruebas de contrato ayudan a detectar rupturas antes de desplegar.
- **No resuelve diferencias semánticas profundas:** si dos contextos entienden el mismo campo de forma distinta, el Published Language solo traslada el problema (se necesitará una ACL en el consumidor).

## Ejemplo
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

## Relación con otros patrones
- **Open Host Service:** el OHS incluye un Published Language para su API.
- **Anticorruption Layer:** la ACL traduce desde el Published Language del proveedor al modelo del cliente. Si el cliente no está de acuerdo con el lenguaje, la ACL hará una transformación adicional.
- **Shared Kernel:** son opuestos. El Shared Kernel comparte modelo y código; el Published Language solo comparte la estructura de datos en la frontera.
