# Customer supplier

El patrón **Customer-Supplier** (Cliente-Proveedor) define una relación asimétrica entre dos Bounded Contexts: un contexto **Upstream** (proveedor) suministra un servicio o datos a uno o varios contextos **Downstream** (clientes). A diferencia del Conformista, el proveedor sí se compromete a considerar y satisfacer las necesidades de sus clientes, aunque mantiene su autonomía y toma las decisiones finales sobre su modelo.

## Roles y responsabilidades
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

## Estableciendo la relación
1. **Acuerdo de nivel de servicio (SLA informal):** no necesariamente un contrato legal, sino expectativas claras: “los cambios en la API se anunciarán con 2 sprints de antelación”, “los bugs críticos se corrigen en 24h”.
2. **Grupo de trabajo cliente-proveedor:** reuniones mensuales con representantes de los equipos cliente y proveedor para revisar backlog y planificación.
3. **Pruebas de aceptación conjuntas:** los clientes definen pruebas de aceptación automatizadas (por ejemplo, con herramientas como Pact) que el proveedor integra en su pipeline. Si alguna prueba falla, el proveedor sabe que rompería a un cliente.
4. **Priorización basada en valor de negocio:** el proveedor no implementa todo lo que el cliente pide, pero atiende lo que tiene impacto directo en los objetivos estratégicos compartidos.

## Ventajas frente a Partnership
- Menor carga de comunicación y acoplamiento. Cada equipo puede tener su propia cadencia de despliegue.
- El proveedor conserva la autoridad sobre su modelo, evitando que los clientes dicten su diseño interno y lo conviertan en un Big Ball of Mud.
- Escala mejor que la Partnership: un proveedor puede atender varios clientes (aunque cada cliente añade complejidad de priorización).

## Desafíos y riesgos
- **Desconexión gradual:** si el proveedor no dedica tiempo real a los clientes, la relación degenera en un Conformista de facto, causando frustración.
- **Cuello de botella:** si el proveedor concentra demasiada lógica y todos los clientes dependen de él, se convierte en un monolito organizacional que frena la innovación.
- **Conflicto de intereses:** los clientes empujan por cambios que solo les benefician a ellos; el proveedor debe proteger la integridad del modelo común y el bien del colectivo.
- **Dependencia no gestionada:** si el proveedor decide una refactorización profunda sin avisar, los clientes sufren.

## Customer-Supplier en entornos modernos
Es el patrón por defecto para equipos de plataforma que ofrecen servicios internos a equipos de producto. La API del proveedor suele incluir una capa de Open Host Service con un Published Language, mientras que internamente implementa su propia lógica de dominio. La relación se mantiene fluida con contratos orientados al consumidor (Consumer-Driven Contracts).

## Señales de que hay que evolucionar
- Si la colaboración es tan intensa que ambos equipos se bloquean mutuamente con frecuencia, tal vez deban fusionarse temporalmente en Partnership o segregar el dominio de forma diferente.
- Si el cliente empieza a replicar datos del proveedor y a construir lógica propia masivamente, puede ser síntoma de que necesita su propio contexto o una ACL completa.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Shared kernel](02-shared-kernel.md) | [🏠 Inicio](../../index.md) | [Conformist ▶](04-conformist.md) |
