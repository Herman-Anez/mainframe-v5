# Síntesis de la capa de comunicación en la hexagonal

Los adaptadores de comunicación son la puerta de entrada y salida del hexágono. Siguen estrictamente estas reglas:

1. **Dependen de puertos**: Primarios (si son inbound) o secundarios (si son outbound).
2. **No contienen lógica de negocio**: Solo traducción y transporte.
3. **Son reemplazables**: Cambiar REST por gRPC, o RabbitMQ por Kafka, implica cambiar solo el adaptador. El núcleo permanece intacto.
4. **Viven en infraestructura**: Nunca en el dominio o en la aplicación (salvo las interfaces de los puertos secundarios).
5. **Respetan el lenguaje ubicuo**: Los nombres de los puertos y los comandos hablan el lenguaje del negocio; los adaptadores traducen al lenguaje del protocolo (JSON, Avro, Protobuf) sin contaminar el significado.

Esta organización garantiza que el sistema pueda comunicarse de cualquier manera sin que su corazón deje de latir con independencia tecnológica.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Clientes HTTP](05-clientes-http.md) | [🏠 Inicio](../../index.md) | [`controladores web ▶](../3-ui-y-presentacion/01-`controladores-web.md) |
