# Conformist

El patrón **Conformist** (Conformista) describe una relación en la que el contexto Downstream decide **adaptarse completamente al modelo del Upstream sin esperar que el proveedor se ajuste a sus necesidades**. El cliente no tiene influencia sobre el diseño del proveedor y simplemente acepta lo que este le ofrece.

## ¿Por qué conformarse?
- **Proveedor externo inamovible:** una pasarela de pagos, un ERP comercial, un servicio gubernamental. No hay capacidad de negociación ni interés del proveedor en adaptarse a un cliente concreto.
- **Proveedor interno con recursos limitados o sin interés:** un equipo que mantiene un sistema heredado y no tiene capacidad para atender peticiones. Intentar forzar cambios sería costoso y frustrante.
- **Costo de aislamiento mayor que el beneficio:** si el modelo del proveedor es razonablemente limpio y las diferencias con el modelo del cliente son mínimas, construir una ACL supone un sobreesfuerzo injustificado. El cliente se ahorra la capa de traducción.

## Implicaciones del conformismo
- El lenguaje ubicuo del proveedor **se filtra** hasta cierto punto en el contexto cliente. El cliente terminará usando términos y conceptos que no son nativos de su dominio. Ejemplo: en un sistema de facturación que consume un ERP, puede acabar hablando de “centros de coste” aunque su dominio nativo hable de “departamentos”.
- La simplicidad de implementación se paga con **deuda de modelo**. Si en el futuro el cliente necesita independizarse, la refactorización será más dolorosa porque el modelo ajeno ha colonizado partes del código.
- El cliente queda **acoplado a la evolución del proveedor**. Si el proveedor cambia su API o sus conceptos, el cliente debe cambiar a su vez, sin más opción que seguir conformándose o, en ese momento, introducir una ACL.

## Cuándo es una decisión consciente y aceptable
El conformismo no es malo per se cuando se aplica a **subdominios genéricos o de soporte**. El core domain del cliente debe protegerse; los subdominios genéricos pueden sacrificar pureza de modelo en aras de la velocidad. Por ejemplo, el contexto de “RRHH” puede conformarse al modelo de un SaaS de nóminas porque no es su core.

## Cómo mitigar los efectos negativos
- **Aislar el conformismo en una capa de infraestructura:** aunque no se construya una ACL completa, se debe evitar que las clases del proveedor se usen directamente en la capa de dominio. Se pueden crear DTOs y repositorios que encapsulan la dependencia, pero que no reinterpretan el modelo.
- **Nombrar con conciencia:** si se usa un término del proveedor, documentar por qué y mantener la trazabilidad.
- **Vigilar la propagación:** si los conceptos del proveedor empiezan a aparecer en el núcleo del dominio, es hora de reconsiderar y colocar una ACL.

## Diferencia con Customer-Supplier
En Customer-Supplier el proveedor se compromete activamente con los clientes; en Conformist, el proveedor es “sordo” por decisión propia o por imposibilidad. Gráficamente, en el Context Map se suele marcar la relación con una ‘C’ o la palabra ‘Conformist’ en la flecha del downstream hacia el upstream, indicando que el downstream se pliega.

## De Conformista a ACL
Si el downstream empieza a sufrir demasiado por los cambios del proveedor o el modelo ajeno corrompe su lógica de negocio, puede introducir una **Anticorruption Layer** para aislarse. Esto es común en la evolución de sistemas: primero se integra de forma conformista para validar la necesidad, y si el dolor crece, se invierte en la ACL.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Customer supplier](03-customer-supplier.md) | [🏠 Inicio](../../index.md) | [Anticorruption layer ▶](05-anticorruption-layer.md) |
