# Estructura de carpetas (Spring Boot + Hexagonal)

La estructura sigue el principio de dependencia hacia el centro. El proyecto se divide en tres grandes módulos o paquetes raíz: `domain`, `application` e `infrastructure`. En proyectos multi-módulo (Maven/Gradle) cada uno sería un submódulo; aquí se muestra como paquetes dentro de un único módulo para simplificar.

```
com.tiendapedidos
├── TiendaPedidosApplication.java        # Punto de entrada (Spring Boot)
│
├── domain/                              # Núcleo: entidades, VOs, servicios de dominio, eventos
│   ├── model/                           # Entidades, value objects, agregados
│   │   ├── Pedido.java
│   │   ├── LineaPedido.java
│   │   ├── PedidoId.java
│   │   ├── ClienteId.java
│   │   ├── Dinero.java
│   │   └── PedidoEstado.java
│   ├── service/                         # Servicios de dominio (lógica huérfana)
│   │   └── CalculadorDescuento.java
│   ├── event/                           # Eventos de dominio
│   │   └── PedidoCreado.java
│   ├── exception/                       # Excepciones de dominio
│   │   └── PedidoNoModificableException.java
│   └── port/                            # Puertos secundarios (interfaces requeridas)
│       ├── RepositorioPedidos.java
│       └── PublicadorEventos.java
│
├── application/                         # Capa de aplicación: casos de uso, comandos/consultas, puertos primarios
│   ├── port/                            # Puertos primarios (interfaces de entrada)
│   │   └── GestionPedidos.java
│   ├── service/                         # Servicios de aplicación (implementan puertos primarios)
│   │   └── PedidoApplicationService.java
│   ├── command/                         # Comandos (DTOs de entrada)
│   │   └── CrearPedidoCommand.java
│   └── query/                           # Consultas (DTOs de entrada/salida)
│       └── PedidoDto.java
│
├── infrastructure/                      # Adaptadores y configuración
│   ├── config/                          # Configuración de beans, DI (cableado)
│   │   ├── BeanConfiguration.java
│   │   └── KafkaConfig.java
│   ├── persistence/                     # Adaptadores secundarios de persistencia
│   │   ├── jpa/                         # Modelo JPA + Repositorios JPA
│   │   │   ├── PedidoJpaEntity.java
│   │   │   ├── LineaPedidoJpaEntity.java
│   │   │   └── PedidoJpaRepository.java  # Interfaz Spring Data JPA
│   │   ├── RepositorioPedidosJpa.java   # Adaptador que implementa el puerto secundario
│   │   └── PedidoMapper.java           # Mapper entre modelo JPA y modelo de dominio
│   ├── messaging/                       # Adaptadores secundarios de mensajería
│   │   ├── KafkaPublicadorEventos.java  # Implementa PublicadorEventos
│   │   └── EventoDominioSerializer.java
│   ├── web/                             # Adaptadores primarios (REST)
│   │   ├── PedidoController.java        # Controlador REST
│   │   ├── dto/                         # DTOs de transporte (entrada/salida HTTP)
│   │   │   ├── CrearPedidoRequest.java
│   │   │   └── PedidoResponse.java
│   │   └── PedidoTransportMapper.java   # Mapea entre DTOs de transporte y comandos
│   └── client/                          # Adaptadores secundarios para clientes HTTP a otros servicios
│       ├── ServicioClientesHttp.java    # Implementa un puerto secundario CatalogoClientes
│       └── ClienteExternoDto.java
│
└── test/                                # Pruebas organizadas según la capa
    ├── domain/
    │   ├── PedidoTest.java
    │   └── DineroTest.java
    ├── application/
    │   └── PedidoApplicationServiceTest.java   # Con dobles
    ├── infrastructure/
    │   ├── PedidoControllerTest.java          # Prueba de adaptador primario
    │   └── RepositorioPedidosJpaTest.java     # Prueba de integración con DB
    └── acceptance/
        └── CrearPedidoAcceptanceTest.java     # End-to-end opcional
```

## Explicación de la estructura

- **`domain`**: No depende de ningún otro paquete del proyecto. Contiene las reglas de negocio puras. Los puertos secundarios (`RepositorioPedidos`, `PublicadorEventos`) viven aquí porque son contratos que el dominio necesita, pero sus implementaciones están en infraestructura.
- **`application`**: Depende solo de `domain`. Contiene los servicios de aplicación (orquestación), los comandos/consultas y los puertos primarios. Aquí se implementan los casos de uso.
- **`infrastructure`**: Depende de `application` y `domain`. Implementa los adaptadores. Está subdividida en `persistence`, `web`, `messaging`, `client`, y contiene la `config` que hace el cableado.
- **`test`**: Refleja las capas, permitiendo pruebas unitarias de dominio (sin Spring), tests de servicios de aplicación con mocks, y tests de integración de adaptadores con tecnologías reales.

Esta estructura hace explícita la dirección de las dependencias: `infrastructure → application → domain`.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Síntesis transversal](../../6-comparativas/05-sintesis-transversal.md) | [🏠 Inicio](../../index.md) | [Fragmentos clave ▶](02-fragmentos-clave.md) |
