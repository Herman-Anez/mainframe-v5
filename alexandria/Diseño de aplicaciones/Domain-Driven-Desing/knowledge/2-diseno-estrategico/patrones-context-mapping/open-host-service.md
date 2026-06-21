# Open host service

Un **Open Host Service** (OHS, servicio de anfitrión abierto) es un patrón que define la interfaz pública de un Bounded Context como un servicio claramente delimitado, normalmente con un protocolo estándar (REST, gRPC, cola de mensajes) y un modelo de datos publicado. Su objetivo es **ofrecer una única puerta de acceso a las capacidades del contexto**, ocultando los detalles de su implementación interna y su modelo de dominio.

## Motivación
Cuando múltiples clientes (contextos downstream) necesitan interactuar con un contexto proveedor, cada uno podría requerir una integración diferente. Sin OHS, el proveedor podría verse tentado a exponer partes internas de su modelo o a construir adaptadores específicos por cliente. Con un OHS, el proveedor centraliza el acceso en una API estable y bien diseñada, forzando a todos los clientes a pasar por ella. Esto protege la integridad del dominio proveedor y facilita su evolución interna.

## Características de un OHS
- **API pública y documentada:** contratos expuestos como endpoints, colas o feeds, con un esquema formal (OpenAPI, protobuf, AsyncAPI). Esta API se convierte en el Published Language del proveedor.
- **Desacoplamiento radical entre lo público y lo interno:** el modelo de dominio del proveedor no se filtra. Los objetos expuestos en la API son DTOs específicamente diseñados para la comunicación; la lógica de dominio permanece privada.
- **Versionado:** la API se versiona para permitir evolución sin romper a los clientes (por ej., `/v1/`, `/v2/` o headers de versión).
- **Múltiples protocolos con un mismo modelo:** un contexto puede ofrecer tanto una API síncrona para consultas como una cola de eventos para notificaciones, siempre bajo el mismo lenguaje publicado.
- **Autoservicio para los consumidores:** idealmente con un portal de desarrolladores, sandboxes y documentación interactiva.

## Relación con Published Language
El OHS casi siempre va acompañado de un **Published Language** (PL). El PL es el formato de datos estable; el OHS es el mecanismo que lo sirve. Juntos permiten que el proveedor ofrezca una interfaz estandarizada sin necesidad de negociar caso por caso con cada cliente (lo cual sería propio de Customer-Supplier con adaptaciones puntuales). Sin embargo, un OHS puede existir sin un PL formal si el proveedor simplemente expone una API única pero sus datos no se documentan como lenguaje compartido (aunque no es lo recomendable).

## Cuándo aplicar OHS
- El contexto proveedor tiene muchos clientes actuales o potenciales, y la negociación individual es ineficiente.
- El proveedor quiere libertad para rediseñar su modelo interno sin impacto externo. La API actúa como costura anticorrupción propia.
- Se busca estandarizar la integración en toda la organización.
- El contexto proveedor implementa un **subdominio genérico** que será consumido por múltiples core domains (ej. un servicio de notificaciones centralizado).

## Ventajas
- **Reduce el acoplamiento:** los clientes dependen de una interfaz estable, no de la estructura interna del proveedor.
- **Simplifica la gobernanza:** un cambio en la implementación no requiere modificar a los clientes si la API se mantiene.
- **Facilita la evolución independiente:** el equipo proveedor puede desplegar con confianza.
- **Escalabilidad organizativa:** nuevos clientes se integran sin añadir carga de comunicación al equipo proveedor.

## Desventajas y riesgos
- **Costo inicial y de mantenimiento:** diseñar una buena API requiere esfuerzo de modelado y disciplina para no romper contratos.
- **Riesgo de API demasiado genérica:** al querer satisfacer a todos, la API puede volverse anémica o demasiado compleja (efecto “menú infinito”).
- **No elimina la necesidad de traducción en los clientes:** un OHS ofrece un modelo publicado, pero si este difiere mucho del modelo del cliente, este aún necesitará una ACL local. La responsabilidad de traducción se desplaza al cliente.

## Ejemplo
Un contexto de “Gestión de Catálogo de Productos” expone un OHS REST con endpoints como `GET /products/{id}` y `POST /search`. Publica un esquema JSON de producto con campos estandarizados. Los clientes (web de e-commerce, app móvil, sistema de recomendaciones) consumen esa misma API. Si el equipo rediseña la base de datos del catálogo, la API no cambia (o lo hace con una nueva versión).
