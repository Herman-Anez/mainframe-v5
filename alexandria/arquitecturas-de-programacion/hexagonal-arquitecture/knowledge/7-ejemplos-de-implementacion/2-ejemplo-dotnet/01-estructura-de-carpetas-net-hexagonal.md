# Estructura de carpetas (.NET + Hexagonal)

Se asume una solución con varios proyectos (o una estructura de carpetas dentro de un solo proyecto) para forzar la dirección de las dependencias. La división más limpia se consigue con proyectos separados, pero aquí se muestra una organización basada en carpetas dentro de un único proyecto ASP.NET Core para simplificar. Las dependencias entre namespaces siguen la regla: `Infrastructure → Application → Domain`.

```
TiendaPedidos.sln
└── src/
    └── TiendaPedidos.Api/                          # Proyecto ASP.NET Core (Web API)
        ├── Program.cs                              # Punto de entrada, composición raíz
        ├── appsettings.json                        # Configuración
        │
        ├── Domain/                                  # Núcleo: entidades, VOs, servicios de dominio, puertos secundarios
        │   ├── Model/
        │   │   ├── Pedido.cs
        │   │   ├── LineaPedido.cs
        │   │   ├── PedidoId.cs
        │   │   ├── ClienteId.cs
        │   │   ├── Dinero.cs
        │   │   └── PedidoEstado.cs
        │   ├── Service/
        │   │   └── CalculadorDescuento.cs
        │   ├── Event/
        │   │   └── PedidoCreado.cs
        │   ├── Exception/
        │   │   └── PedidoNoModificableException.cs
        │   └── Port/                                # Puertos secundarios (interfaces)
        │       ├── IRepositorioPedidos.cs
        │       └── IPublicadorEventos.cs
        │
        ├── Application/                             # Capa de aplicación: casos de uso, comandos/consultas, puertos primarios
        │   ├── Port/                                # Puertos primarios (interfaces)
        │   │   └── IGestionPedidos.cs
        │   ├── Service/                             # Servicios de aplicación
        │   │   └── PedidoApplicationService.cs
        │   ├── Command/
        │   │   └── CrearPedidoCommand.cs
        │   └── Query/
        │       └── PedidoDto.cs
        │
        ├── Infrastructure/                          # Adaptadores y configuración
        │   ├── Persistence/                         # Adaptadores secundarios de persistencia
        │   │   ├── EntityFramework/                 # Modelo EF Core
        │   │   │   ├── PedidoEntity.cs
        │   │   │   ├── LineaPedidoEntity.cs
        │   │   │   └── AppDbContext.cs
        │   │   ├── RepositorioPedidosEf.cs          # Adaptador que implementa IRepositorioPedidos
        │   │   └── PedidoMapper.cs
        │   ├── Messaging/                           # Adaptadores secundarios de mensajería
        │   │   ├── KafkaPublicadorEventos.cs
        │   │   └── EventoDominioSerializer.cs
        │   ├── Web/                                 # Adaptadores primarios (REST)
        │   │   ├── Controllers/
        │   │   │   └── PedidoController.cs
        │   │   ├── Dto/
        │   │   │   ├── CrearPedidoRequest.cs
        │   │   │   └── PedidoResponse.cs
        │   │   └── PedidoTransportMapper.cs
        │   └── Client/                              # Adaptadores secundarios para clientes HTTP
        │       ├── ServicioClientesHttp.cs
        │       └── ClienteExternoDto.cs
        │
        └── DependencyInjection/                     # Configuración de DI (cableado)
            └── ServiceCollectionExtensions.cs       # Métodos de extensión para registrar servicios
```

**Reglas de dependencia**:
- `Domain` no refiere a ningún otro namespace del proyecto, ni siquiera a `Application`.
- `Application` solo refiere a `Domain`.
- `Infrastructure` refiere a `Application` y `Domain` (usa sus interfaces y modelos).
- La DI (`ServiceCollectionExtensions`) está en `Infrastructure` o en un proyecto aparte de “Bootstrapper”.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estructura de carpetas (Node.js + TypeScript + Hexagonal)](../01-estructura-de-carpetas-nodejs-typescript-hexagonal.md) | [🏠 Inicio](../../index.md) | [Fragmentos clave ▶](02-fragmentos-clave.md) |
