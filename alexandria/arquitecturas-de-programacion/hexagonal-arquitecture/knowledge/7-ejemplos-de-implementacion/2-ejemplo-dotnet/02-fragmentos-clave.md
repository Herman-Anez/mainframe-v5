# Fragmentos clave

## 2.1. Dominio puro (Domain)

El dominio está completamente libre de dependencias externas (ni Entity Framework, ni ASP.NET, ni Newtonsoft.Json). Solo usa tipos base de .NET y sus propias excepciones.

### Agregado y entidad principal
```csharp
namespace TiendaPedidos.Api.Domain.Model;

public class Pedido
{
    private readonly List<LineaPedido> _lineas = new();
    private readonly List<object> _eventos = new();

    public PedidoId Id { get; }
    public ClienteId ClienteId { get; }
    public PedidoEstado Estado { get; private set; }
    public IReadOnlyList<LineaPedido> Lineas => _lineas.AsReadOnly();
    public IReadOnlyList<object> Eventos => _eventos.AsReadOnly();

    private Pedido(PedidoId id, ClienteId clienteId)
    {
        Id = id;
        ClienteId = clienteId;
        Estado = PedidoEstado.Pendiente;
    }

    public static Pedido Crear(ClienteId clienteId, List<SolicitudLinea> solicitudes)
    {
        var pedido = new Pedido(new PedidoId(Guid.NewGuid()), clienteId);
        foreach (var sl in solicitudes)
        {
            pedido.AgregarLinea(sl.ProductoId, sl.Cantidad, sl.PrecioUnitario);
        }
        pedido._eventos.Add(new PedidoCreado(pedido.Id));
        return pedido;
    }

    public void AgregarLinea(ProductoId productoId, int cantidad, Dinero precioUnitario)
    {
        if (Estado != PedidoEstado.Pendiente)
            throw new PedidoNoModificableException("No se pueden agregar líneas en estado " + Estado);

        var nuevaLinea = new LineaPedido(productoId, cantidad, precioUnitario);
        _lineas.Add(nuevaLinea);
    }

    public void Cancelar()
    {
        if (Estado == PedidoEstado.Enviado)
            throw new PedidoNoModificableException("Un pedido enviado no puede cancelarse");

        Estado = PedidoEstado.Cancelado;
        // registrar evento...
    }

    public void LimpiarEventos() => _eventos.Clear();
}
```

### Value Object inmutable
```csharp
namespace TiendaPedidos.Api.Domain.Model;

public class Dinero
{
    public decimal Cantidad { get; }
    public string Moneda { get; }

    public Dinero(decimal cantidad, string moneda)
    {
        if (cantidad < 0) throw new ArgumentException("El dinero no puede ser negativo");
        Cantidad = cantidad;
        Moneda = moneda ?? throw new ArgumentNullException(nameof(moneda));
    }

    public Dinero Sumar(Dinero otro)
    {
        if (Moneda != otro.Moneda)
            throw new InvalidOperationException("No se pueden sumar distintas monedas");
        return new Dinero(Cantidad + otro.Cantidad, Moneda);
    }
    // Equals, GetHashCode...
}
```

### Puerto secundario (Driven Port)
```csharp
namespace TiendaPedidos.Api.Domain.Port;

public interface IRepositorioPedidos
{
    Task GuardarAsync(Pedido pedido);
    Task<Pedido?> ObtenerPorIdAsync(PedidoId id);
}
```

```csharp
namespace TiendaPedidos.Api.Domain.Port;

public interface IPublicadorEventos
{
    Task PublicarAsync(object evento);
}
```

---

## 2.2. Capa de aplicación (Application)

Define las operaciones del sistema (puertos primarios) y los comandos/consultas.

### Puerto primario (Driving Port)
```csharp
namespace TiendaPedidos.Api.Application.Port;

public interface IGestionPedidos
{
    Task<PedidoId> CrearPedidoAsync(CrearPedidoCommand comando);
    Task CancelarPedidoAsync(PedidoId pedidoId);
}
```

### Comando
```csharp
namespace TiendaPedidos.Api.Application.Command;

public record CrearPedidoCommand(ClienteId ClienteId, List<SolicitudLinea> Lineas);
public record SolicitudLinea(ProductoId ProductoId, int Cantidad, Dinero PrecioUnitario);
```

### Servicio de aplicación (implementa el puerto primario)
```csharp
namespace TiendaPedidos.Api.Application.Service;

using Domain.Model;
using Domain.Port;

public class PedidoApplicationService : IGestionPedidos
{
    private readonly IRepositorioPedidos _repositorio;
    private readonly IPublicadorEventos _publicador;

    public PedidoApplicationService(IRepositorioPedidos repositorio, IPublicadorEventos publicador)
    {
        _repositorio = repositorio;
        _publicador = publicador;
    }

    public async Task<PedidoId> CrearPedidoAsync(CrearPedidoCommand comando)
    {
        var pedido = Pedido.Crear(comando.ClienteId, comando.Lineas);
        await _repositorio.GuardarAsync(pedido);

        foreach (var evento in pedido.Eventos)
        {
            await _publicador.PublicarAsync(evento);
        }
        pedido.LimpiarEventos();
        return pedido.Id;
    }

    public async Task CancelarPedidoAsync(PedidoId pedidoId)
    {
        var pedido = await _repositorio.ObtenerPorIdAsync(pedidoId)
            ?? throw new PedidoNoEncontradoException(pedidoId);
        pedido.Cancelar();
        await _repositorio.GuardarAsync(pedido);
        // publicar eventos...
    }
}
```

La transacción se puede manejar con `DbContext.Database.BeginTransactionAsync` desde un decorador o un `UnitOfWork`. En .NET suele usarse `TransactionScope` o el `DbContext` directamente, pero siempre desde la capa de aplicación, nunca en el dominio.

---

## 2.3. Adaptadores (Infrastructure)

### Adaptador primario: Controlador ASP.NET Core
```csharp
namespace TiendaPedidos.Api.Infrastructure.Web.Controllers;

using Microsoft.AspNetCore.Mvc;
using Application.Port;
using Application.Command;

[ApiController]
[Route("api/v1/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IGestionPedidos _gestionPedidos;

    public PedidosController(IGestionPedidos gestionPedidos)
    {
        _gestionPedidos = gestionPedidos;
    }

    [HttpPost]
    public async Task<ActionResult<PedidoResponse>> Crear([FromBody] CrearPedidoRequest request)
    {
        var comando = PedidoTransportMapper.AComando(request);
        var id = await _gestionPedidos.CrearPedidoAsync(comando);
        var response = new PedidoResponse { Id = id.Valor };
        return CreatedAtAction(nameof(Crear), new { id = id.Valor }, response);
    }
}
```

### DTOs de transporte
```csharp
namespace TiendaPedidos.Api.Infrastructure.Web.Dto;

public class CrearPedidoRequest
{
    public string ClienteId { get; set; }
    public List<LineaRequest> Lineas { get; set; }
}

public class LineaRequest
{
    public string ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public string Moneda { get; set; }
}
```

### Mapper de transporte
```csharp
namespace TiendaPedidos.Api.Infrastructure.Web;

using Application.Command;
using Domain.Model;

public static class PedidoTransportMapper
{
    public static CrearPedidoCommand AComando(CrearPedidoRequest request)
    {
        var lineas = request.Lineas.Select(l => new SolicitudLinea(
            new ProductoId(l.ProductoId),
            l.Cantidad,
            new Dinero(l.PrecioUnitario, l.Moneda)
        )).ToList();

        return new CrearPedidoCommand(new ClienteId(request.ClienteId), lineas);
    }
}
```

### Adaptador secundario: Repositorio con Entity Framework Core
**Entidad EF (modelo de persistencia)**:
```csharp
namespace TiendaPedidos.Api.Infrastructure.Persistence.EntityFramework;

public class PedidoEntity
{
    public string Id { get; set; }
    public string ClienteId { get; set; }
    public string Estado { get; set; }
    public List<LineaPedidoEntity> Lineas { get; set; }
}

public class LineaPedidoEntity
{
    public int Id { get; set; }
    public string ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public string Moneda { get; set; }
    public string PedidoId { get; set; }
    public PedidoEntity Pedido { get; set; }
}
```

**DbContext**:
```csharp
public class AppDbContext : DbContext
{
    public DbSet<PedidoEntity> Pedidos { get; set; }
    // configuración...
}
```

**Adaptador del repositorio**:
```csharp
namespace TiendaPedidos.Api.Infrastructure.Persistence;

using Domain.Model;
using Domain.Port;
using EntityFramework;
using Microsoft.EntityFrameworkCore;

public class RepositorioPedidosEf : IRepositorioPedidos
{
    private readonly AppDbContext _context;
    private readonly PedidoMapper _mapper;

    public RepositorioPedidosEf(AppDbContext context, PedidoMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task GuardarAsync(Pedido pedido)
    {
        var entity = _mapper.AEntidad(pedido);
        var existente = await _context.Pedidos.FindAsync(entity.Id);
        if (existente == null)
            _context.Pedidos.Add(entity);
        else
            _context.Entry(existente).CurrentValues.SetValues(entity);

        await _context.SaveChangesAsync();
    }

    public async Task<Pedido?> ObtenerPorIdAsync(PedidoId id)
    {
        var entity = await _context.Pedidos
            .Include(p => p.Lineas)
            .FirstOrDefaultAsync(p => p.Id == id.Valor);
        return entity is null ? null : _mapper.ADominio(entity);
    }
}
```

**Mapper**:
```csharp
namespace TiendaPedidos.Api.Infrastructure.Persistence;

using Domain.Model;
using EntityFramework;

public class PedidoMapper
{
    public PedidoEntity AEntidad(Pedido pedido)
    {
        return new PedidoEntity
        {
            Id = pedido.Id.Valor.ToString(),
            ClienteId = pedido.ClienteId.Valor,
            Estado = pedido.Estado.ToString(),
            Lineas = pedido.Lineas.Select(l => new LineaPedidoEntity
            {
                ProductoId = l.ProductoId.Valor,
                Cantidad = l.Cantidad,
                PrecioUnitario = l.PrecioUnitario.Cantidad,
                Moneda = l.PrecioUnitario.Moneda
            }).ToList()
        };
    }

    public Pedido ADominio(PedidoEntity entity)
    {
        // Reconstruye el agregado desde la entidad. 
        // En un diseño más estricto usaríamos un constructor interno o un método factory.
        // Aquí simplificamos usando un enfoque con setters internos o reflexión, pero se puede diseñar mejor.
        // La lógica de reconstrucción es responsabilidad exclusiva del mapper.
        // ...
    }
}
```

### Adaptador secundario: Publicador de eventos con Kafka
```csharp
namespace TiendaPedidos.Api.Infrastructure.Messaging;

using Domain.Port;
using Confluent.Kafka;

public class KafkaPublicadorEventos : IPublicadorEventos
{
    private readonly IProducer<string, string> _producer;

    public KafkaPublicadorEventos(IProducer<string, string> producer)
    {
        _producer = producer;
    }

    public async Task PublicarAsync(object evento)
    {
        var topico = evento.GetType().Name.ToLowerInvariant().Replace("evento", "");
        var mensaje = System.Text.Json.JsonSerializer.Serialize(evento);
        await _producer.ProduceAsync(topico, new Message<string, string> { Key = Guid.NewGuid().ToString(), Value = mensaje });
    }
}
```

---

## 2.4. Configuración y cableado (DI)

La composición raíz se realiza en `Program.cs` y mediante métodos de extensión en `DependencyInjection`.

```csharp
// Archivo: src/TiendaPedidos.Api/Program.cs
using TiendaPedidos.Api.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios: cableado de la arquitectura hexagonal
builder.Services.AddDomainServices();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();
```

```csharp
// Archivo: src/TiendaPedidos.Api/Infrastructure/DependencyInjection/ServiceCollectionExtensions.cs
using Microsoft.EntityFrameworkCore;
using TiendaPedidos.Api.Application.Port;
using TiendaPedidos.Api.Application.Service;
using TiendaPedidos.Api.Domain.Port;
using TiendaPedidos.Api.Infrastructure.Persistence;
using TiendaPedidos.Api.Infrastructure.Persistence.EntityFramework;
using TiendaPedidos.Api.Infrastructure.Messaging;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        // Los servicios de dominio (si tienen dependencias de puertos) se registran aquí.
        // Normalmente el dominio no necesita registrarse, a menos que tenga factorías o servicios con DI.
        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IGestionPedidos, PedidoApplicationService>();
        // otros servicios de aplicación...
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration config)
    {
        // Persistencia
        services.AddDbContext<AppDbContext>(opts =>
            opts.UseNpgsql(config.GetConnectionString("DefaultConnection")));
        services.AddScoped<IRepositorioPedidos, RepositorioPedidosEf>();
        services.AddSingleton<PedidoMapper>();

        // Mensajería
        services.AddSingleton<IPublicadorEventos, KafkaPublicadorEventos>();
        // Configurar Kafka Producer...

        return services;
    }
}
```

El controlador no necesita registro manual porque `AddControllers` lo descubre (está anotado con `[ApiController]`), y recibe `IGestionPedidos` por inyección de dependencias, que se resuelve a `PedidoApplicationService`.

---

## 2.5. Pruebas

### Test unitario del dominio
```csharp
using FluentAssertions;
using TiendaPedidos.Api.Domain.Model;

namespace TiendaPedidos.Api.Tests.Domain;

public class PedidoTests
{
    [Fact]
    public void Cancelar_pedido_enviado_lanza_excepcion()
    {
        var pedido = PedidoFactory.PedidoEnEstado(PedidoEstado.Enviado);
        Action act = () => pedido.Cancelar();
        act.Should().Throw<PedidoNoModificableException>();
    }
}
```

### Test del servicio de aplicación con dobles
```csharp
using Moq;
using TiendaPedidos.Api.Application.Command;
using TiendaPedidos.Api.Application.Service;
using TiendaPedidos.Api.Domain.Model;
using TiendaPedidos.Api.Domain.Port;

public class PedidoApplicationServiceTests
{
    [Fact]
    public async Task Crear_pedido_guarda_y_publica_evento()
    {
        var repoMock = new Mock<IRepositorioPedidos>();
        var pubMock = new Mock<IPublicadorEventos>();
        var service = new PedidoApplicationService(repoMock.Object, pubMock.Object);
        var comando = new CrearPedidoCommand(new ClienteId("C1"), new List<SolicitudLinea>());

        var id = await service.CrearPedidoAsync(comando);

        repoMock.Verify(r => r.GuardarAsync(It.IsAny<Pedido>()), Times.Once);
        pubMock.Verify(p => p.PublicarAsync(It.IsAny<object>()), Times.AtLeastOnce);
        id.Should().NotBeNull();
    }
}
```

### Test de integración del adaptador de persistencia
```csharp
[Collection("Database")]
public class RepositorioPedidosEfTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly RepositorioPedidosEf _repositorio;

    public RepositorioPedidosEfTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        _context = new AppDbContext(options);
        _repositorio = new RepositorioPedidosEf(_context, new PedidoMapper());
    }

    [Fact]
    public async Task Guardar_y_recuperar_pedido()
    {
        var pedido = Pedido.Crear(new ClienteId("C1"), new List<SolicitudLinea>());
        await _repositorio.GuardarAsync(pedido);
        var recuperado = await _repositorio.ObtenerPorIdAsync(pedido.Id);
        recuperado.Should().NotBeNull();
        recuperado!.ClienteId.Valor.Should().Be("C1");
    }

    public void Dispose() => _context.Dispose();
}
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estructura de carpetas (.NET + Hexagonal)](01-estructura-de-carpetas-net-hexagonal.md) | [🏠 Inicio](../../index.md) | [Resumen del ejemplo .NET ▶](03-resumen-del-ejemplo-net.md) |
