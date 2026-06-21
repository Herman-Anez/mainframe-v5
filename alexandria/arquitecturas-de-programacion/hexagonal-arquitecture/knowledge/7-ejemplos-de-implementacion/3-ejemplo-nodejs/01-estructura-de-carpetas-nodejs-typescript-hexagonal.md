# Estructura de carpetas (Node.js + TypeScript + Hexagonal)

Se asume un proyecto con Node.js y TypeScript. La separación de responsabilidades se logra mediante carpetas estrictas. No hay módulos separados (npm workspaces), pero los imports respetan la regla: `infrastructure` → `application` → `domain`.

```
tienda-pedidos/
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts                       # Punto de entrada, composición raíz (cableado manual)
│   │
│   ├── domain/                       # Núcleo: entidades, VOs, puertos secundarios, excepciones, eventos
│   │   ├── model/
│   │   │   ├── Pedido.ts
│   │   │   ├── LineaPedido.ts
│   │   │   ├── PedidoId.ts
│   │   │   ├── ClienteId.ts
│   │   │   ├── Dinero.ts
│   │   │   └── PedidoEstado.ts
│   │   ├── service/
│   │   │   └── CalculadorDescuento.ts
│   │   ├── event/
│   │   │   └── PedidoCreado.ts
│   │   ├── exception/
│   │   │   └── PedidoNoModificableException.ts
│   │   └── port/                     # Puertos secundarios (interfaces que el dominio necesita)
│   │       ├── IRepositorioPedidos.ts
│   │       └── IPublicadorEventos.ts
│   │
│   ├── application/                  # Capa de aplicación: puertos primarios, comandos, servicios de aplicación
│   │   ├── port/                     # Puertos primarios (contratos de entrada)
│   │   │   └── IGestionPedidos.ts
│   │   ├── service/                  # Servicios de aplicación (implementan puertos primarios)
│   │   │   └── PedidoApplicationService.ts
│   │   ├── command/                  # Comandos (inmutables)
│   │   │   └── CrearPedidoCommand.ts
│   │   └── query/                    # Consultas (DTOs de salida)
│   │       └── PedidoDto.ts
│   │
│   ├── infrastructure/               # Adaptadores y configuración
│   │   ├── persistence/              # Adaptadores secundarios de persistencia
│   │   │   ├── typeorm/              # O cualquiera: Prisma, Mongoose...
│   │   │   │   ├── PedidoEntity.ts
│   │   │   │   └── LineaPedidoEntity.ts
│   │   │   ├── RepositorioPedidosTypeORM.ts
│   │   │   └── PedidoMapper.ts
│   │   ├── messaging/                # Adaptadores secundarios de mensajería
│   │   │   └── KafkaPublicadorEventos.ts
│   │   ├── web/                      # Adaptadores primarios (Express, Fastify...)
│   │   │   ├── controllers/
│   │   │   │   └── PedidoController.ts
│   │   │   ├── dto/
│   │   │   │   ├── CrearPedidoRequest.ts
│   │   │   │   └── PedidoResponse.ts
│   │   │   └── PedidoTransportMapper.ts
│   │   └── client/                   # Adaptadores secundarios para APIs externas
│   │       └── ServicioClientesHttp.ts
│   │
│   └── config/                       # Configuración de entorno y DI
│       ├── container.ts              # Contenedor de DI (Awilix, Inversify o manual)
│       └── settings.ts              # Carga de variables de entorno
│
└── tests/
    ├── domain/
    │   └── Pedido.test.ts
    ├── application/
    │   └── PedidoApplicationService.test.ts
    └── infrastructure/
        ├── PedidoController.test.ts
        └── RepositorioPedidosTypeORM.test.ts
```

**Principio de dependencia**: el código fuente de `domain` nunca importa de `application` ni de `infrastructure`. `application` solo importa de `domain`. `infrastructure` importa de `application` y `domain`. El cableado en `main.ts` o `container.ts` conecta todo.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Resumen del ejemplo Spring Boot](1-ejemplo-spring-boot/03-resumen-del-ejemplo-spring-boot.md) | [🏠 Inicio](../index.md) | [Estructura de carpetas (.NET + Hexagonal) ▶](2-ejemplo-dotnet/01-estructura-de-carpetas-net-hexagonal.md) |
