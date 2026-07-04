# Context mapping

El Context Map es el diagrama y la práctica que documenta las relaciones entre Bounded Contexts. Es una herramienta estratégica para visualizar y gestionar la integración y las dependencias organizacionales.

## Propósito y representación
No es un diagrama de componentes técnico; es un mapa sociotécnico. Muestra:
- Los contextos implicados.
- El tipo de relación (patrón) entre cada par de contextos.
- La dirección del flujo de influencia: upstream (proveedor) y downstream (cliente). El equipo upstream puede afectar al downstream, no al revés.
- Roles organizativos (equipo que posee cada contexto).

Un contexto puede tener múltiples relaciones con otros. Cada relación se modela con un patrón de Context Mapping.

## Profundización en los patrones

**1. Partnership (Sociedad)**  
Dos equipos colaboran estrechamente. Los cambios en las interfaces se coordinan de forma bilateral y las entregas se sincronizan. Es adecuada cuando hay interdependencia y confianza. Requiere comunicación frecuente y alineación continua. Si un equipo cambia sin avisar, el otro sufre. No es escalable para muchas dependencias.

**2. Shared Kernel (Núcleo Compartido)**  
Una parte explícita del modelo y/o código se comparte entre dos contextos. Ambas partes acuerdan no modificar el kernel sin coordinación. Reduce duplicación pero crea acoplamiento. Solo debe usarse para partes muy estables y pequeñas. Si el kernel crece, es difícil de mantener. Implica tests compartidos y propiedad conjunta.

**3. Customer-Supplier (Cliente-Proveedor)**  
Relación asimétrica: el contexto proveedor (upstream) sirve al cliente (downstream). El proveedor se compromete a satisfacer las necesidades del cliente. Se establecen mecanismos de planificación conjunta y feedback, pero el proveedor mantiene autonomía. Funciona bien en organizaciones con dependencias jerárquicas o equipos centrales que proveen servicios a unidades de negocio. El riesgo es que el proveedor ignore al cliente y se convierta en un cuello de botella o en un “conformista” de facto.

**4. Conformist (Conformista)**  
El contexto cliente se adapta al modelo del proveedor sin esperar adaptación. El proveedor no responde a las necesidades específicas del cliente. Se usa cuando el costo de negociar o de construir una ACL es mayor que el de adaptarse. Típico con proveedores externos cuyo API es inamovible, o con equipos internos que no pueden atender peticiones. Implica que el modelo del proveedor puede “manchar” el del cliente, así que se debe aislar en una capa de infraestructura.

**5. Anticorruption Layer (ACL, Capa Anticorrupción)**  
El contexto cliente crea una capa de traducción entre su modelo y el modelo del proveedor, protegiendo así su dominio. La ACL contiene adaptadores, convertidores y lógica para filtrar el modelo externo y presentar solo lo necesario en el lenguaje del dominio cliente. Es la defensa por excelencia del core domain frente a sistemas heredados (Big Ball of Mud) o proveedores con modelos distintos. Tiene costo de implementación y mantenimiento; solo se justifica cuando el cliente valora la pureza de su modelo (normalmente en core domains).

**6. Open Host Service (OHS, Servicio de Anfitrión Abierto)**  
Un contexto proveedor define un API pública y bien documentada como único canal de acceso para todos los clientes. Puede ofrecer múltiples protocolos (REST, gRPC, mensajería) pero con un modelo publicado estable. Centraliza la integración: los clientes no hablan directamente con el dominio interno. A menudo se combina con Published Language.

**7. Published Language (Lenguaje Publicado)**  
Es un formato de datos canónico y estable, compartido entre contextos, generalmente en forma de esquemas JSON, XML, Avro o Protocol Buffers. El proveedor publica este lenguaje; los clientes lo consumen. Puede ser parte de un OHS o simplemente un contrato asíncrono (eventos). Debe versionarse. Reduce la necesidad de traducciones punto a punto, pero requiere un estándar que satisfaga a muchos, lo cual puede llevarlo a ser demasiado genérico.

**8. Separate Ways (Caminos Separados)**  
Dos contextos deciden no integrarse. Cada uno resuelve sus necesidades sin comunicación alguna, incluso duplicando datos y funcionalidades. Se aplica cuando el costo de integración supera los beneficios. Por ejemplo, un pequeño contexto de reportes puede simplemente leer de una réplica de datos y no necesitar una API. Debe ser una decisión consciente para evitar integraciones forzadas.

**9. Big Ball of Mud (Gran Bola de Barro)**  
Contexto con un modelo desordenado, límites difusos y alta complejidad. Generalmente es un sistema legado monolítico. DDD no busca arreglarlo directamente (sería muy costoso), sino aislarlo del resto de contextos mediante ACLs. De este modo, el barro no se filtra a los nuevos desarrollos. Gradualmente, se pueden ir extrayendo funcionalidades del Big Ball of Mud hacia Bounded Contexts bien definidos (estrategia de estrangulamiento).

## Dinámica organizacional y evolución
El Context Map no es estático. A medida que los equipos maduran, las relaciones cambian (un conformista puede pasar a customer-supplier si el proveedor accede a adaptarse; una partnership puede romperse en separate ways si la colaboración se vuelve insostenible). El mapa debe revisarse periódicamente y ser transparente para toda la organización, funcionando como un radar de dependencias y riesgos.

## La importancia para la destilación del core domain
El Context Map es la herramienta para proteger el core domain. Normalmente se rodea al core con ACLs para blindarlo de sistemas externos y genéricos. Los subdominios genéricos se conectan vía Conformist o OHS. El mapa permite visualizar si el core domain depende de muchos sistemas inestables y tomar decisiones arquitectónicas para mitigarlo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bounded context](03-bounded-context.md) | [🏠 Inicio](../index.md) | [Destilacion core domain ▶](05-destilacion-core-domain.md) |
