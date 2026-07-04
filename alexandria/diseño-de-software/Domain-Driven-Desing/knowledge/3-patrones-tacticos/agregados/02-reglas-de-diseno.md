# Reglas de diseno

Diseñar agregados correctamente es una de las tareas más críticas en DDD. Eric Evans y posteriormente Vaughn Vernon (en *Implementing Domain-Driven Design*) formalizaron un conjunto de reglas y heurísticas. Incumplirlas conduce a modelos frágiles, problemas de rendimiento y pérdida de integridad de negocio.

## Regla 1: Proteger las invariantes dentro de la frontera del agregado
Todas las invariantes que involucran a los objetos del agregado deben ser garantizadas por la raíz en cada operación de modificación. Si una invariante cruza dos agregados, no se puede garantizar de forma inmediata; se recurre a consistencia eventual.  
*Ejemplo:* "El total del pedido debe ser la suma de sus líneas" es una invariante del agregado `Pedido`. "Un cliente no puede tener más de 3 pedidos pendientes" es una invariante que cruza agregados (`Cliente` y `Pedido`); se implementa con una política que reaccione a eventos.

## Regla 2: Referenciar otros agregados solo por su identidad
Un agregado nunca debe contener una referencia directa a otro agregado. En su lugar, utiliza el identificador (Value Object) del otro agregado. Esto:
- Mantiene los agregados desacoplados.
- Evita cargar múltiples agregados en una sola transacción.
- Permite que cada agregado esté en su propio repositorio.

```java
public class Pedido {
    private ClienteId clienteId; // No Cliente cliente
    // ...
}
```

## Regla 3: Diseñar agregados pequeños
Un agregado debe contener la mínima cantidad de objetos necesarios para mantener sus propias invariantes. Agregados pequeños:
- Reducen la contención de recursos.
- Son más fáciles de testear.
- Tienen menor superficie de cambios concurrentes.

Como heurística, si un agregado tiene más de 3-4 entidades internas (sin contar value objects), puede ser síntoma de que se está modelando un grafo demasiado grande. La mayoría de agregados consisten en una única entidad raíz y unos pocos value objects.

## Regla 4: La raíz es la única puerta de entrada
Ningún objeto externo puede modificar directamente un objeto interno. La raíz decide cómo y cuándo se modifican sus partes. Los métodos públicos de la raíz son los únicos puntos de cambio.

**Práctica segura:** no exponer colecciones internas como `List<LineaPedido>` con getter; devolver una vista de solo lectura o copia inmutable.
```csharp
public IReadOnlyList<LineaPedido> Lineas => _lineas.AsReadOnly();
```

## Regla 5: Consistencia transaccional inmediata dentro del agregado, eventual fuera
Cada comando que modifica el estado debe afectar a un único agregado. La base de datos garantiza que los cambios en ese agregado son atómicos y consistentes. Si un caso de uso afecta a dos agregados, se utilizan eventos de dominio para propagar los efectos de forma asíncrona. La consistencia entre agregados será eventual.

## Regla 6: Evitar que los ORMs debiliten el encapsulamiento
Muchos ORMs exigen setters públicos y constructores sin parámetros. Esto viola el encapsulamiento. Para preservarlo:
- Usar mapeo a campos privados (`OwnsOne`, `HasField` en EF Core, `@Access` en JPA).
- Implementar constructores privados con parámetros y constructores sin parámetros privados/protegidos para el ORM.
- Nunca usar objetos del dominio como entradas de vistas o DTOs de API directamente; se crean proyecciones.

## Regla 7: Los repositorios solo deben existir para raíces de agregado
Nada de `LineaPedidoRepository`. Cualquier consulta o modificación de un objeto interno se hace a través del repositorio del agregado. Si necesitas consultar un objeto interno sin cargar todo el agregado, plantéate si ese objeto realmente es una entidad interna o merece su propio agregado.

## Heurísticas adicionales de Vaughn Vernon
- **Diseñar en base a los casos de uso:** ¿cada comando modifica un solo agregado? Si un comando toca múltiples agregados, el diseño debe replantearse.
- **No crear "agregados hoja":** si una entidad no tiene hijos ni invariantes complejas, puede ser un agregado raíz de sí misma.
- **Evitar el "agregado dios":** un agregado con demasiados atributos que intenta abarcar demasiado; produce cuellos de botella en concurrencia y carga innecesaria.

## Anti-patrones comunes
- **Colecciones expuestas:** `public List<LineaPedido> Lineas { get; set; }` permite añadir elementos sin pasar por la validación de la raíz.
- **Lazy loading en entidades internas:** un ORM puede cargar colecciones de manera perezosa, ocultando problemas de rendimiento. Las asociaciones entre agregados deben ser por ID, no por referencias lazy.
- **Raíz anémica:** la raíz no tiene lógica de negocio, solo get/set; el control de invariantes se dispersa en servicios.
- **Persistencia poliglota descontrolada:** partes del agregado guardadas en distintas tablas mediante joins complejos; la recuperación se vuelve ineficiente. El agregado debe mapearse a un modelo de persistencia unificado (documento, o tabla con child table).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Concepto agregado](01-concepto-agregado.md) | [🏠 Inicio](../../index.md) | [Tamanio y consistencia ▶](03-tamanio-y-consistencia.md) |
