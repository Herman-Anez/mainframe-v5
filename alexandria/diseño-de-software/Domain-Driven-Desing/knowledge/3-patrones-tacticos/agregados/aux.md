

### `concepto-agregado.md`

Un **Agregado** (Aggregate) es un clúster de objetos del dominio (entidades y value objects) que se tratan como una única unidad para los cambios de datos. Cada agregado tiene una **Raíz de Agregado** (Aggregate Root), una entidad específica que actúa como puerta de entrada y guardiana de la consistencia del grupo. El resto de objetos dentro del agregado no son accesibles desde fuera; cualquier operación que modifique el estado del agregado debe pasar obligatoriamente por la raíz.

#### ¿Por qué surgen los agregados?
En un dominio complejo, las entidades y value objects establecen relaciones entre sí. Sin un mecanismo de control, estas relaciones pueden dar lugar a grafos de objetos enormes y frágiles, donde un cambio local desencadena cascadas de modificaciones no controladas, violando invariantes de negocio. Los agregados ponen límites explícitos a esas relaciones:
- Definen una **frontera de consistencia**: todas las invariantes dentro del agregado se mantienen en cada operación que se realiza sobre él.
- Reducen el acoplamiento: ningún objeto externo puede referenciar un objeto interno del agregado excepto a través de la raíz.
- Simplifican la persistencia: se recupera y almacena el agregado como una unidad.

#### La Raíz del Agregado (Aggregate Root)
Es la única entidad a la que el mundo exterior puede tener referencia directa. Sus responsabilidades:
1. **Identidad global del agregado:** cualquier petición para modificar el agregado llega mediante el identificador de la raíz.
2. **Garantizar invariantes:** todos los métodos de la raíz que cambian estado deben dejar el agregado en un estado válido según las reglas de negocio.
3. **Controlar el acceso a los objetos internos:** nunca expone referencias a entidades internas mutables; si es necesario exponer información, se devuelven copias inmutables (value objects) o DTOs.
4. **Registrar eventos de dominio:** normalmente es la raíz quien recopila y emite los eventos que han ocurrido dentro del agregado.

**Ejemplo básico:**
```java
public class Pedido { // Raíz
    private PedidoId id;
    private List<LineaPedido> lineas; // Entidades internas
    private DireccionEnvio direccion; // Value Object
    private EstadoPedido estado;

    public void añadirProducto(ProductoId producto, Cantidad cantidad) {
        if (estado != EstadoPedido.BORRADOR) throw new PedidoNoModificableException();
        // Verificar invariante: no duplicar producto
        LineaPedido nueva = new LineaPedido(producto, cantidad);
        lineas.add(nueva);
        // Disparar evento ProductoAñadido
    }

    public void confirmar() {
        if (lineas.isEmpty()) throw new PedidoSinLineasException();
        this.estado = EstadoPedido.CONFIRMADO;
        // Evento PedidoConfirmado
    }
}
```
Aquí `LineaPedido` es una entidad interna; nunca se accede directamente a ella desde fuera.

#### Objetos internos del agregado
Pueden ser:
- **Entidades** (con identidad local, válida solo dentro del agregado). Ejemplo: `LineaPedido` tiene un `lineaId` único dentro del pedido, pero sin sentido fuera.
- **Value Objects** (inmutables, definen propiedades). Ejemplo: `DireccionEnvio`.

Las entidades internas no son accesibles desde fuera. Si otro agregado necesita referenciar algo, lo hace por el ID del agregado raíz.

#### Invariantes del agregado
Las invariantes son reglas de negocio que deben cumplirse en todo momento dentro de la frontera de consistencia. Ejemplos:
- Un `Pedido` confirmado no puede modificarse.
- El total del pedido debe ser la suma de los importes de sus líneas.
- El saldo de una cuenta nunca puede ser negativo.

El raíz es responsable de que cada método público verifique y mantenga estas invariantes. No se puede delegar en servicios externos; la raíz debe rechazar cualquier cambio que las viole.

#### Agregados y repositorios
Solo deben existir repositorios para raíces de agregado. Un `PedidoRepository` recupera y guarda el pedido completo (incluidas sus líneas). No se crea un `LineaPedidoRepository`. El repositorio devuelve un agregado íntegro; la responsabilidad de construir correctamente los objetos internos recae en la infraestructura de persistencia.

#### Identificadores como Value Objects
El ID de la raíz se modela como un Value Object (`PedidoId`, `ClienteId`). Esto evita la obsesión por primitivos y proporciona tipado fuerte.

#### Agregados y operaciones atómicas
Un comando que modifica el agregado debe modificar solo **un agregado** por transacción. Si un caso de uso requiere modificar dos agregados, se utiliza consistencia eventual mediante eventos de dominio o procesos en saga (no se fuerza una transacción distribuida). Esta es una regla de diseño fundamental.

#### ¿Por qué no poner toda la base de datos en un solo agregado?
Porque un agregado enorme genera contención, problemas de rendimiento y acopla lógica que debería ser independiente. Cada agregado es una unidad transaccional; hacerlos pequeños y con un propósito claro es esencial para sistemas escalables y mantenibles.

#### Ejemplo de un agregado mal diseñado (antipatrón)
Un `Cliente` que contiene una colección de `Pedido`. Si se necesitara consultar el historial de pedidos, cargar el cliente con miles de pedidos en memoria es ineficiente. Peor aún, una modificación en un pedido requeriría cargar todo el cliente. La solución: `Cliente` y `Pedido` son agregados separados; `Pedido` referencia al `ClienteId` como identidad.

---

### `reglas-de-diseno.md`

Diseñar agregados correctamente es una de las tareas más críticas en DDD. Eric Evans y posteriormente Vaughn Vernon (en *Implementing Domain-Driven Design*) formalizaron un conjunto de reglas y heurísticas. Incumplirlas conduce a modelos frágiles, problemas de rendimiento y pérdida de integridad de negocio.

#### Regla 1: Proteger las invariantes dentro de la frontera del agregado
Todas las invariantes que involucran a los objetos del agregado deben ser garantizadas por la raíz en cada operación de modificación. Si una invariante cruza dos agregados, no se puede garantizar de forma inmediata; se recurre a consistencia eventual.  
*Ejemplo:* "El total del pedido debe ser la suma de sus líneas" es una invariante del agregado `Pedido`. "Un cliente no puede tener más de 3 pedidos pendientes" es una invariante que cruza agregados (`Cliente` y `Pedido`); se implementa con una política que reaccione a eventos.

#### Regla 2: Referenciar otros agregados solo por su identidad
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

#### Regla 3: Diseñar agregados pequeños
Un agregado debe contener la mínima cantidad de objetos necesarios para mantener sus propias invariantes. Agregados pequeños:
- Reducen la contención de recursos.
- Son más fáciles de testear.
- Tienen menor superficie de cambios concurrentes.

Como heurística, si un agregado tiene más de 3-4 entidades internas (sin contar value objects), puede ser síntoma de que se está modelando un grafo demasiado grande. La mayoría de agregados consisten en una única entidad raíz y unos pocos value objects.

#### Regla 4: La raíz es la única puerta de entrada
Ningún objeto externo puede modificar directamente un objeto interno. La raíz decide cómo y cuándo se modifican sus partes. Los métodos públicos de la raíz son los únicos puntos de cambio.

**Práctica segura:** no exponer colecciones internas como `List<LineaPedido>` con getter; devolver una vista de solo lectura o copia inmutable.
```csharp
public IReadOnlyList<LineaPedido> Lineas => _lineas.AsReadOnly();
```

#### Regla 5: Consistencia transaccional inmediata dentro del agregado, eventual fuera
Cada comando que modifica el estado debe afectar a un único agregado. La base de datos garantiza que los cambios en ese agregado son atómicos y consistentes. Si un caso de uso afecta a dos agregados, se utilizan eventos de dominio para propagar los efectos de forma asíncrona. La consistencia entre agregados será eventual.

#### Regla 6: Evitar que los ORMs debiliten el encapsulamiento
Muchos ORMs exigen setters públicos y constructores sin parámetros. Esto viola el encapsulamiento. Para preservarlo:
- Usar mapeo a campos privados (`OwnsOne`, `HasField` en EF Core, `@Access` en JPA).
- Implementar constructores privados con parámetros y constructores sin parámetros privados/protegidos para el ORM.
- Nunca usar objetos del dominio como entradas de vistas o DTOs de API directamente; se crean proyecciones.

#### Regla 7: Los repositorios solo deben existir para raíces de agregado
Nada de `LineaPedidoRepository`. Cualquier consulta o modificación de un objeto interno se hace a través del repositorio del agregado. Si necesitas consultar un objeto interno sin cargar todo el agregado, plantéate si ese objeto realmente es una entidad interna o merece su propio agregado.

#### Heurísticas adicionales de Vaughn Vernon
- **Diseñar en base a los casos de uso:** ¿cada comando modifica un solo agregado? Si un comando toca múltiples agregados, el diseño debe replantearse.
- **No crear "agregados hoja":** si una entidad no tiene hijos ni invariantes complejas, puede ser un agregado raíz de sí misma.
- **Evitar el "agregado dios":** un agregado con demasiados atributos que intenta abarcar demasiado; produce cuellos de botella en concurrencia y carga innecesaria.

#### Anti-patrones comunes
- **Colecciones expuestas:** `public List<LineaPedido> Lineas { get; set; }` permite añadir elementos sin pasar por la validación de la raíz.
- **Lazy loading en entidades internas:** un ORM puede cargar colecciones de manera perezosa, ocultando problemas de rendimiento. Las asociaciones entre agregados deben ser por ID, no por referencias lazy.
- **Raíz anémica:** la raíz no tiene lógica de negocio, solo get/set; el control de invariantes se dispersa en servicios.
- **Persistencia poliglota descontrolada:** partes del agregado guardadas en distintas tablas mediante joins complejos; la recuperación se vuelve ineficiente. El agregado debe mapearse a un modelo de persistencia unificado (documento, o tabla con child table).

---

### `tamanio-y-consistencia.md`

El tamaño de los agregados y la estrategia de consistencia asociada son decisiones de diseño que impactan profundamente en la escalabilidad, el rendimiento y la corrección del sistema.

#### El trade-off fundamental
Agregados grandes permiten garantizar más invariantes de forma transaccional (inmediata) porque abarcan más objetos relacionados. Sin embargo, generan:
- Mayor contención en sistemas multiusuario: dos usuarios pueden querer modificar distintas partes del mismo agregado grande, bloqueándose mutuamente.
- Mayor consumo de memoria y tiempo de carga al recuperar toda la estructura de la base de datos.
- Dificultad para particionar datos (sharding) si un agregado contiene demasiados datos.

Agregados pequeños resuelven los problemas de contención y rendimiento, pero fuerzan a manejar invariantes que cruzan agregados con **consistencia eventual**, lo que añade complejidad de diseño.

La filosofía DDD se decanta por **agregados lo más pequeños posible** que aún mantengan sus propias invariantes. La consistencia eventual no es un defecto, sino una realidad del dominio que podemos modelar con eventos y políticas.

#### Cómo determinar el tamaño correcto
Analiza cada invariante de negocio:
- ¿Qué objetos deben ser consistentes en todo momento después de una operación? Esos deben estar juntos en el mismo agregado.
- ¿Qué reglas pueden tolerar un pequeño retraso en la sincronización? Esas se implementan entre agregados mediante eventos.

**Preguntas guía:**
1. ¿Si modifico A, debo recalcular o validar B obligatoriamente antes de dar la operación por completada? Si es sí, A y B están en el mismo agregado.
2. ¿Qué pasa si B se actualiza unos segundos después? Si el negocio lo permite, separemos los agregados.

**Ejemplo: Pedido y Factura**
- Invariante: "El total de la factura debe coincidir con el total del pedido confirmado". ¿Deben estar en el mismo agregado? No necesariamente. Cuando se confirma un pedido, se emite `PedidoConfirmado`. El servicio de facturación lo consume y genera la factura. Si por un error la factura tarda 2 segundos en generarse, el negocio puede aceptarlo. Separar en dos agregados evita que facturación bloquee la confirmación del pedido.

#### Tipos de consistencia
- **Inmediata:** transaccional, dentro de un agregado. Usa mecanismos de base de datos (bloqueo optimista, transacción ACID local).
- **Eventual:** entre agregados. Se implementa con mensajería asíncrona (eventos de dominio, colas). La consistencia no se garantiza al milisegundo, pero se alcanza en un tiempo finito. A menudo se combina con políticas de compensación (sagas) si algo falla.

#### Diseñando para consistencia eventual
Cuando un agregado necesita notificar cambios a otros:
1. El agregado raíz registra un **Evento de Dominio** después de cada cambio significativo.
2. Un manejador (dentro del mismo contexto o en otro) recibe el evento y ejecuta la lógica correspondiente.
3. Se debe garantizar al menos *entrega una vez* (at-least-once), por lo que los consumidores deben ser idempotentes.

**Patrón de ejemplo:** cuando se confirma un `Pedido` (agregado A), se publica `PedidoConfirmado`. El agregado `Cliente` (agregado B) podría querer aumentar un contador de pedidos realizados. El manejador en B recibe el evento y actualiza el contador en su propio agregado, guardándolo en su propia transacción.

#### Agregados grandes: cuándo pueden ser aceptables
Rara vez, si la invariante es estrictamente transaccional y el negocio no tolera ningún retraso (por ej., transferencias de fondos entre cuentas en el mismo banco, donde débito y crédito deben ser atómicos). En esos casos:
- Se puede tener un agregado que abarque ambas cuentas, pero tiene el problema de bloqueo.
- Alternativa: usar un servicio de dominio que orqueste dentro de una transacción de base de datos (pero tocando dos agregados, lo que rompe la regla pura). Muchos sistemas reales optan por esta vía con mecanismos de bloqueo distribuido.

La recomendación ortodoxa es mantener la atomicidad dentro del agregado y eventual fuera, pero en la práctica se evalúa caso a caso.

#### Concurrencia y agregados pequeños
Usar agregados pequeños permite manejar la concurrencia con bloqueo optimista (un campo `Version` o `Timestamp` en la raíz). Si dos usuarios modifican el mismo agregado, solo uno tiene éxito; el otro reintenta. Con agregados pequeños, la probabilidad de colisión disminuye.

#### División de un agregado grande
Si detectas un agregado sobrecargado, el proceso de división implica:
1. Identificar subgrafos que son consistentemente accedidos juntos.
2. Verificar que no haya invariantes transaccionales entre los subgrafos candidatos.
3. Introducir eventos de dominio para mantener cualquier dependencia entre ellos.
4. Crear nuevos repositorios y refactorizar los clientes para usar los nuevos IDs.

**Ejemplo:** un `Pedido` que contenía todo el historial de estados (`HistorialEstado`). El historial es solo de consulta; las operaciones de escritura solo añaden un nuevo estado. Se puede partir: `Pedido` como un agregado con su estado actual, y `HistorialPedido` como otro agregado actualizado vía eventos `PedidoEstadoCambiado`. Las consultas del historial se hacen al segundo agregado.

#### Eventualidad y UX
La consistencia eventual puede tener impacto en la experiencia de usuario. Si un usuario realiza una acción y la interfaz no refleja inmediatamente la consecuencia, se debe diseñar una UX optimista: se muestra el cambio esperado y, si eventualmente hay un fallo, se notifica. Patrones como *Read Models* actualizados mediante eventos reducen la latencia.

---

### `ejemplos-agregados.md`

En este archivo se recopilan varios ejemplos concretos de agregados en diferentes dominios, detallando su raíz, objetos internos, invariantes y decisiones de diseño. Se usa pseudocódigo cercano a Java/C#.

#### Ejemplo 1: Pedido (e-commerce)
```java
public class Pedido {  // Aggregate Root
    private PedidoId id;
    private ClienteId clienteId; // referencia por ID a otro agregado
    private List<LineaPedido> lineas; // entidades internas
    private DatosEnvio datosEnvio;   // value object
    private EstadoPedido estado;

    public Pedido(PedidoId id, ClienteId clienteId, DatosEnvio datos) {
        this.id = id;
        this.clienteId = clienteId;
        this.datosEnvio = datos;
        this.estado = EstadoPedido.BORRADOR;
        this.lineas = new ArrayList<>();
    }

    public void añadirProducto(ProductoId prod, Dinero precioUnitario, int cantidad) {
        if (estado != BORRADOR) throw new IllegalStateException("Pedido no es borrador");
        // invariante: no duplicar producto
        if (lineas.stream().anyMatch(l -> l.getProductoId().equals(prod))) throw new ProductoDuplicadoException();
        lineas.add(new LineaPedido(prod, precioUnitario, cantidad));
    }

    public void confirmar() {
        if (lineas.isEmpty()) throw new PedidoVacioException();
        this.estado = CONFIRMADO;
        // Evento: PedidoConfirmado(this.id, this.clienteId, ...)
    }

    public Dinero calcularTotal() {
        return lineas.stream()
                .map(LineaPedido::calcularSubtotal)
                .reduce(Dinero.cero(), Dinero::sumar);
    }
    // ...
}

@Entity
public class LineaPedido { // Entidad interna, no root
    @EmbeddedId
    private LineaPedidoId id; // identidad local
    private ProductoId productoId;
    private Dinero precioUnitario;
    private int cantidad;
    // ...
}
```
**Decisiones:**
- `ClienteId` es referencia externa; `Pedido` no carga el cliente.
- `LineaPedido` tiene identidad local para referenciar cambios (por ejemplo, eliminar línea específica), pero nunca se accede desde fuera de `Pedido`.
- El total se calcula bajo demanda pero se protege la invariante de que cada línea contribuye; si hiciera falta consistencia estricta, se podría almacenar el total como propiedad y recalcular en cada modificación.

#### Ejemplo 2: Reserva de asientos (eventos)
```csharp
public class Reserva { // Aggregate Root
    public ReservaId Id { get; private set; }
    public ClienteId ClienteId { get; private set; }
    public FuncionId FuncionId { get; private set; }
    private List<AsientoReservado> _asientos; // entidades internas
    public EstadoReserva Estado { get; private set; }

    public void AgregarAsiento(Asiento asiento) {
        if (Estado != EstadoReserva.Pendiente) throw new ReservaNoModificableException();
        if (_asientos.Any(a => a.Asiento == asiento)) throw new AsientoYaReservadoException();
        // Invariante: máximo 6 asientos por reserva
        if (_asientos.Count >= 6) throw new LimiteAsientosExcedidoException();
        _asientos.Add(new AsientoReservado(asiento));
    }

    public void Confirmar() {
        if (!_asientos.Any()) throw new ReservaSinAsientosException();
        Estado = EstadoReserva.Confirmada;
        // Evento: ReservaConfirmada(Id)
    }
}
```
**Decisiones:**
- La reserva limita el número de asientos; esa invariante está dentro del agregado.
- Los asientos son value objects (`Asiento` con fila y número) y se almacenan como entidades internas para permitir modificaciones. Alternativamente, `Asiento` podría ser VO dentro de una colección.
- Se referencia a `FuncionId` y `ClienteId` por ID, no como objetos.

#### Ejemplo 3: Foro/Discusión
```java
public class Hilo { // Aggregate Root
    private HiloId id;
    private TituloHilo titulo; // VO
    private UsuarioId autorId; // referencia externa
    private List<Mensaje> mensajes; // entidades internas
    private EstadoHilo estado;

    public void agregarMensaje(UsuarioId autor, String contenido) {
        if (estado == EstadoHilo.CERRADO) throw new HiloCerradoException();
        if (contenido == null || contenido.isBlank()) throw new ContenidoVacioException();
        Mensaje nuevo = new Mensaje(new MensajeId(), autor, contenido, Instant.now());
        mensajes.add(nuevo);
        // Evento: MensajeAgregado(this.id, nuevo)
    }
}
```
**Decisiones:**
- Un `Hilo` contiene mensajes. Podría pensarse que un hilo con miles de mensajes se vuelve un agregado grande; en este caso el contexto de consulta puede usar un read model paginado, mientras que el agregado solo se carga para añadir un mensaje. Si el rendimiento se resiente, se puede optar por separar `Mensaje` como su propio agregado y actualizar vía eventos.

#### Ejemplo 4: Subasta y pujas (invariante de puja mínima)
```csharp
public class Subasta { // Aggregate Root
    public SubastaId Id { get; private set; }
    public ArticuloId Articulo { get; private set; }
    private Dinero _pujaMinima;
    private List<Puja> _pujas;
    public EstadoSubasta Estado { get; private set; }

    public void RealizarPuja(UsuarioId usuario, Dinero cantidad) {
        if (Estado != EstadoSubasta.Activa) throw new SubastaNoActivaException();
        if (cantidad.CompareTo(_pujaMinima) < 0) throw new PujaDemasiadoBajaException();
        _pujas.Add(new Puja(usuario, cantidad, DateTime.UtcNow));
        _pujaMinima = cantidad.Multiplicar(new decimal(1.05)); // incremento 5%
        // Evento: PujaRealizada(Id, cantidad)
    }
}
```
**Decisiones:**
- La subasta contiene la colección de pujas. Si el número de pujas es muy elevado, podría separarse. Se evalúa según el dominio: si el número de pujas es normalmente < 100, está bien. Si es una subasta de alta frecuencia, `Puja` podría ser su propio agregado y la subasta solo mantendría la puja máxima y la mínima (evento `PujaRealizada` actualizaría un read model de pujas históricas).

Estos ejemplos ilustran cómo aplicar las reglas de diseño de agregados, poniendo el foco en encapsular invariantes y minimizar el tamaño para garantizar la consistencia y la escalabilidad.

---
