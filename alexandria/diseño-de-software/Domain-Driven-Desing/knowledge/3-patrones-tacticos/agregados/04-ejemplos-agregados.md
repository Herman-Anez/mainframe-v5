# Ejemplos agregados

En este archivo se recopilan varios ejemplos concretos de agregados en diferentes dominios, detallando su raíz, objetos internos, invariantes y decisiones de diseño. Se usa pseudocódigo cercano a Java/C#.

## Ejemplo 1: Pedido (e-commerce)
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

## Ejemplo 2: Reserva de asientos (eventos)
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

## Ejemplo 3: Foro/Discusión
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

## Ejemplo 4: Subasta y pujas (invariante de puja mínima)
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

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Tamanio y consistencia](03-tamanio-y-consistencia.md) | [🏠 Inicio](../../index.md) | [Hexagonal ports adapters ▶](../../4-arquitectura/01-hexagonal-ports-adapters.md) |
