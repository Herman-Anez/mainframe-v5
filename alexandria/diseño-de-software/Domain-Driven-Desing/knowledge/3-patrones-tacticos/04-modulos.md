# Modulos

## Módulos como mecanismo de encapsulamiento

Un módulo (paquete, namespace) agrupa un conjunto de clases del dominio que comparten una misma área de significado. Es la unidad de organización para controlar la visibilidad y reducir la complejidad cognitiva.

## Principios de diseño de módulos

- **Alta cohesión:** todas las clases de un módulo deben cambiar juntas o estar relacionadas con un mismo concepto del dominio.
- **Bajo acoplamiento:** las dependencias entre módulos deben ser pocas y a través de interfaces estables.
- **Clausura común:** si un cambio de negocio afecta a múltiples módulos, posiblemente la división no es óptima.

## Niveles de visibilidad

- En Java, usar `package-private` para clases internas del módulo que no deben ser accedidas desde otros módulos del mismo Bounded Context.
- En C#, usar `internal` para lo mismo.
- Exponer solo las interfaces necesarias: el repositorio del agregado raíz, servicios de dominio que sirven de fachada, y value objects compartidos (preferiblemente movidos a un módulo `shared` interno).

## Ejemplo de estructura modular para un contexto de "Gestión de Pedidos"

```
com.empresa.pedidos
├── pedido
│   ├── Pedido (aggregate root)
│   ├── LineaPedido
│   ├── PedidoId
│   ├── PedidoRepository (interface)
│   └── DireccionEnvio
├── descuento
│   ├── DescuentoService (domain service)
│   └── EstrategiaDescuento (policy)
├── comunicacion
│   ├── EventoPedidoConfirmado (domain event)
│   └── PedidoEventPublisher (interface)
└── shared
    ├── ClienteId
    └── Dinero
```
Aquí, `descuento` depende de `pedido`, pero no al revés. `comunicacion` depende de eventos generados en `pedido`.

## Módulos y Bounded Contexts: relación

- Un Bounded Context contiene múltiples módulos.
- Los módulos nunca cruzan contextos; si un módulo crece y empieza a tener su propio lenguaje ubicuo, es candidato a convertirse en un nuevo Bounded Context.
- La modularización adecuada facilita la posterior extracción de microservicios.

## Anti-patrones

- **Módulo "Common" o "Util":** acumula clases dispares, se convierte en un punto de acoplamiento sin cohesión semántica. Sustituir por módulos específicos o, si la funcionalidad es transversal, crear un *mecanismo cohesivo* (patrón Supple Design).
- **Módulo demasiado granular:** un módulo por clase; no aporta agrupación conceptual y genera exceso de imports.
- **Dependencias circulares entre módulos:** indican que deberían fusionarse o que la responsabilidad está mal asignada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Servicios de dominio](03-servicios-de-dominio.md) | [🏠 Inicio](../index.md) | [Repositorios ▶](05-repositorios.md) |
