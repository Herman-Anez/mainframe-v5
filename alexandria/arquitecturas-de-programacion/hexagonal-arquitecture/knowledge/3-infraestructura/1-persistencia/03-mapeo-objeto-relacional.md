# Mapeo objeto-relacional

## Definición y problemática
El mapeo objeto-relacional (ORM) es la técnica que permite salvar y recuperar grafos de objetos en tablas relacionales. En una arquitectura hexagonal, el mayor desafío es que las entidades de dominio **no deben** contener anotaciones, herencia o dependencias de ORM, porque eso acoplaría el corazón del negocio a un framework.

El mapeo se convierte en una responsabilidad exclusiva de la capa de infraestructura, utilizando patrones como **Data Mapper**, que mantiene al modelo de dominio y al esquema de base de datos completamente aislados.

## Estrategias de mapeo en la hexagonal

### A) Modelo de persistencia separado (recomendado)
Se crean clases específicas para la persistencia (llamadas `*Entity` o `*Document`) que viven en el paquete de infraestructura. Estas clases pueden tener anotaciones JPA (`@Entity`, `@Table`, `@Column`), anotaciones de MongoDB (`@Document`), o cualquier decoración propia de la tecnología.

Un **ensamblador / mapper** (clase de infraestructura) convierte entre el modelo de persistencia y el modelo de dominio en ambos sentidos.

Ventajas:
- El dominio permanece absolutamente puro.
- Se puede cambiar la estrategia de mapeo sin tocar el dominio.
- Se pueden optimizar las estructuras para la base de datos (por ejemplo, usar tipos nativos, relaciones LAZY) sin impactar la lógica de negocio.
- Múltiples fuentes de datos pueden requerir distintos modelos de persistencia para el mismo agregado.

Desventaja: requiere escribir código de mapeo, aunque herramientas como MapStruct, ModelMapper o JMapper lo automatizan.

### B) Uso directo del dominio con configuración externa
Algunos ORM permiten mapeo por XML o por anotaciones en clases externas (JPA permite `orm.xml`). Así, las clases de dominio no llevan anotaciones. Sigue siendo válido en hexagonal porque el acoplamiento en tiempo de compilación al framework ORM puede eliminarse. Sin embargo, en la práctica, las entidades de dominio a menudo deben cumplir requisitos del ORM (constructores sin argumentos, setters, tipos específicos) que pueden forzar concesiones en el diseño del dominio. Por ello, el modelo de persistencia separado es más limpio y alineado con DDD.

## Patrones de mapeo relevantes

### Data Mapper
Una capa de mapeo (el mapper) mueve datos entre objetos de dominio y la base de datos, manteniéndolos independientes. El repositorio usa el mapper. Es el enfoque canónico de la hexagonal.

```java
public class PedidoMapper {
    Pedido aDominio(PedidoJpaEntity entity) { ... }
    PedidoJpaEntity aJpaEntity(Pedido pedido) { ... }
}
```

### Identity Map
Dentro de una unidad de trabajo (p.ej., un contexto transaccional), asegura que cada agregado se carga una sola vez. En JPA, el `EntityManager` actúa como Identity Map para las entidades gestionadas. En un enfoque con modelo de persistencia separado, podemos implementar un mapa manual dentro del repositorio para evitar lecturas redundantes.

### Unit of Work
Coordina la escritura de todos los cambios en la base de datos como una operación atómica. En hexagonal, suele delegarse en el ORM o en la transacción de la base de datos. El servicio de aplicación abre una transacción; los repositorios se ejecutan en ese contexto. Si no se usa ORM, se puede implementar manualmente (por ejemplo, acumulando operaciones y ejecutándolas con JDBC batch).

## Mapeo de relaciones y agregados
El mapeo de un agregado conlleva traducir su raíz y todos sus objetos internos a tablas relacionadas. Si un agregado `Pedido` contiene una colección de `LineaPedido`, el repositorio SQL deberá:

- Al guardar, insertar/actualizar la fila de `Pedido` y sincronizar las filas de `LineaPedido` (insertar nuevas, eliminar las que ya no están, actualizar las existentes). Esto se puede hacer con `CascadeType.ALL` y `orphanRemoval=true` en el modelo de persistencia JPA, o manualmente con JDBC.
- Al leer, cargar el pedido y sus líneas en una sola consulta (JOIN) y reconstruir el agregado completo.

Es vital que el mapeo respete las invariantes del agregado. Por ejemplo, si el dominio exige que un pedido en estado `Enviado` no puede modificar sus líneas, el repositorio no necesita imponer esa regla (el dominio lo hace), pero el mapeo debe preservar el estado exacto para que el dominio lo valide al reconstruir.

## ORM y herencia en el dominio
Si el dominio utiliza herencia (por ejemplo, `Pago` con subclases `PagoConTarjeta`, `PagoConTransferencia`), el ORM ofrece estrategias de herencia (single table, joined, table per class). El modelo de persistencia reflejará esa jerarquía con anotaciones, pero el dominio trabajará con polimorfismo sin saber cómo se almacena. El mapper será responsable de instanciar la subclase correcta de dominio según el tipo de persistencia.

## Buenas prácticas
- **No filtrar identificadores técnicos**: El dominio utiliza identificadores semánticos (PedidoId); la base de datos puede usar claves subrogadas (UUID, secuencias). El repositorio convierte entre ambos.
- **Lazy loading controlado**: En el dominio, todas las asociaciones dentro del agregado se cargan eager (el repositorio devuelve el agregado completo). Si hay referencias a otros agregados, se almacenan solo los IDs. De esta forma se evita la necesidad de lazy loading, que acopla al ORM.
- **Consultas personalizadas**: Si se necesita una proyección parcial para una vista o reporte, se define un puerto secundario de consulta independiente, con su propio adaptador que ejecuta SQL y devuelve DTOs planos. Esto evita forzar al repositorio de agregados a devolver datos incompletos.

---

## Síntesis de la persistencia en la hexagonal
Los repositorios SQL y NoSQL son adaptadores que implementan los puertos secundarios del núcleo. Su misión es traducir las peticiones del dominio (en lenguaje ubicuo) a operaciones sobre la base de datos. El mapeo objeto-relacional es la técnica que permite esta traducción, y debe mantenerse completamente fuera del dominio, típicamente mediante un modelo de persistencia separado y mappers explícitos. Esta separación garantiza que la lógica de negocio sea independiente de cómo se almacenen los datos, y que cualquier cambio en la tecnología de persistencia no contamine el corazón de la aplicación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Repositorios NoSQL](02-repositorios-nosql.md) | [🏠 Inicio](../../index.md) | [REST API ▶](../2-comunicacion/01-rest-api.md) |
