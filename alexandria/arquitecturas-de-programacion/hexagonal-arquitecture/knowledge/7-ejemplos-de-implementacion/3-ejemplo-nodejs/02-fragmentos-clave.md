# Fragmentos clave

## 2.1. Dominio (domain)

El dominio no utiliza decoradores de TypeORM, ni ningún símbolo ajeno. Solo código TypeScript puro que modela el negocio.

### Agregado Pedido y su fábrica
```typescript
// src/domain/model/Pedido.ts
import { PedidoId } from './PedidoId';
import { ClienteId } from './ClienteId';
import { LineaPedido } from './LineaPedido';
import { SolicitudLinea } from './SolicitudLinea'; // DTO del dominio
import { PedidoEstado } from './PedidoEstado';
import { PedidoCreado } from '../event/PedidoCreado';
import { PedidoNoModificableException } from '../exception/PedidoNoModificableException';

export class Pedido {
  private readonly _id: PedidoId;
  private _clienteId: ClienteId;
  private _lineas: LineaPedido[];
  private _estado: PedidoEstado;
  private _eventos: object[];

  private constructor(id: PedidoId, clienteId: ClienteId) {
    this._id = id;
    this._clienteId = clienteId;
    this._lineas = [];
    this._estado = PedidoEstado.PENDIENTE;
    this._eventos = [];
  }

  // Método factoría estático
  static crear(clienteId: ClienteId, solicitudes: SolicitudLinea[]): Pedido {
    const pedido = new Pedido(new PedidoId(crypto.randomUUID()), clienteId);
    for (const sl of solicitudes) {
      pedido.agregarLinea(sl.productoId, sl.cantidad, sl.precioUnitario);
    }
    pedido._eventos.push(new PedidoCreado(pedido._id));
    return pedido;
  }

  get id(): PedidoId { return this._id; }
  get clienteId(): ClienteId { return this._clienteId; }
  get estado(): PedidoEstado { return this._estado; }
  get lineas(): readonly LineaPedido[] { return this._lineas; }
  get eventos(): readonly object[] { return this._eventos; }

  agregarLinea(productoId: ProductoId, cantidad: number, precioUnitario: Dinero): void {
    if (this._estado !== PedidoEstado.PENDIENTE) {
      throw new PedidoNoModificableException('No se pueden agregar líneas en estado ' + this._estado);
    }
    const linea = new LineaPedido(productoId, cantidad, precioUnitario);
    this._lineas.push(linea);
  }

  cancelar(): void {
    if (this._estado === PedidoEstado.ENVIADO) {
      throw new PedidoNoModificableException('Un pedido enviado no puede cancelarse');
    }
    this._estado = PedidoEstado.CANCELADO;
    // Se podría añadir evento de cancelación
  }

  limpiarEventos(): void {
    this._eventos = [];
  }
}
```

### Value Object inmutable
```typescript
// src/domain/model/Dinero.ts
export class Dinero {
  readonly cantidad: number;
  readonly moneda: string;

  constructor(cantidad: number, moneda: string) {
    if (cantidad < 0) throw new Error('El dinero no puede ser negativo');
    this.cantidad = cantidad;
    this.moneda = moneda;
  }

  sumar(otro: Dinero): Dinero {
    if (this.moneda !== otro.moneda) throw new Error('Monedas incompatibles');
    return new Dinero(this.cantidad + otro.cantidad, this.moneda);
  }

  // equals, etc.
}
```

### Puerto secundario (Driven Port)
```typescript
// src/domain/port/IRepositorioPedidos.ts
import { Pedido } from '../model/Pedido';
import { PedidoId } from '../model/PedidoId';

export interface IRepositorioPedidos {
  guardar(pedido: Pedido): Promise<void>;
  buscarPorId(id: PedidoId): Promise<Pedido | null>;
}
```

```typescript
// src/domain/port/IPublicadorEventos.ts
export interface IPublicadorEventos {
  publicar(evento: object): Promise<void>;
}
```

## 2.2. Capa de aplicación (application)

### Puerto primario y comandos
```typescript
// src/application/command/CrearPedidoCommand.ts
import { ClienteId } from '../../domain/model/ClienteId';
import { SolicitudLinea } from '../../domain/model/SolicitudLinea';

export class CrearPedidoCommand {
  readonly clienteId: ClienteId;
  readonly lineas: SolicitudLinea[];

  constructor(clienteId: ClienteId, lineas: SolicitudLinea[]) {
    this.clienteId = clienteId;
    this.lineas = lineas;
  }
}
```

```typescript
// src/application/port/IGestionPedidos.ts
import { CrearPedidoCommand } from '../command/CrearPedidoCommand';
import { PedidoId } from '../../domain/model/PedidoId';

export interface IGestionPedidos {
  crearPedido(comando: CrearPedidoCommand): Promise<PedidoId>;
  cancelarPedido(id: PedidoId): Promise<void>;
}
```

### Servicio de aplicación (implementa el puerto primario)
```typescript
// src/application/service/PedidoApplicationService.ts
import { IGestionPedidos } from '../port/IGestionPedidos';
import { IRepositorioPedidos } from '../../domain/port/IRepositorioPedidos';
import { IPublicadorEventos } from '../../domain/port/IPublicadorEventos';
import { Pedido } from '../../domain/model/Pedido';
import { CrearPedidoCommand } from '../command/CrearPedidoCommand';
import { PedidoId } from '../../domain/model/PedidoId';

export class PedidoApplicationService implements IGestionPedidos {
  constructor(
    private readonly repositorio: IRepositorioPedidos,
    private readonly publicador: IPublicadorEventos
  ) {}

  async crearPedido(comando: CrearPedidoCommand): Promise<PedidoId> {
    const pedido = Pedido.crear(comando.clienteId, comando.lineas);
    await this.repositorio.guardar(pedido);

    // Publicar eventos generados por el dominio
    for (const evento of pedido.eventos) {
      await this.publicador.publicar(evento);
    }
    pedido.limpiarEventos();
    return pedido.id;
  }

  async cancelarPedido(id: PedidoId): Promise<void> {
    const pedido = await this.repositorio.buscarPorId(id);
    if (!pedido) throw new Error('Pedido no encontrado');
    pedido.cancelar();
    await this.repositorio.guardar(pedido);
    // publicar eventos...
  }
}
```

> [!NOTE]
> *Nota:* El servicio no tiene lógica de negocio, solo orquesta. La transacción podría manejarse con un `UnitOfWork` o con un decorador que encapsule la conexión de base de datos, pero en TypeScript normalmente se usa un `DataSource` de TypeORM y se envuelve con `dataSource.transaction()` en el servicio de aplicación.

## 2.3. Adaptadores (infrastructure)

### Adaptador primario: Controlador Express
```typescript
// src/infrastructure/web/controllers/PedidoController.ts
import { Router, Request, Response } from 'express';
import { IGestionPedidos } from '../../../application/port/IGestionPedidos';
import { CrearPedidoCommand } from '../../../application/command/CrearPedidoCommand';
import { PedidoTransportMapper } from '../PedidoTransportMapper';
import { PedidoResponse } from '../dto/PedidoResponse';

export function pedidoController(gestionPedidos: IGestionPedidos): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const comando = PedidoTransportMapper.aComando(req.body);
      const id = await gestionPedidos.crearPedido(comando);
      const response: PedidoResponse = { id: id.valor };
      res.status(201).json(response);
    } catch (error) {
      // manejo de errores
      res.status(400).json({ mensaje: error.message });
    }
  });

  return router;
}
```

DTO de transporte:
```typescript
// src/infrastructure/web/dto/CrearPedidoRequest.ts
export interface CrearPedidoRequest {
  clienteId: string;
  lineas: Array<{ productoId: string; cantidad: number; precioUnitario: number; moneda: string }>;
}
```

Mapper:
```typescript
// src/infrastructure/web/PedidoTransportMapper.ts
import { CrearPedidoRequest } from './dto/CrearPedidoRequest';
import { CrearPedidoCommand } from '../../../application/command/CrearPedidoCommand';
import { ClienteId } from '../../../domain/model/ClienteId';
import { SolicitudLinea } from '../../../domain/model/SolicitudLinea';
import { ProductoId } from '../../../domain/model/ProductoId';
import { Dinero } from '../../../domain/model/Dinero';

export class PedidoTransportMapper {
  static aComando(request: CrearPedidoRequest): CrearPedidoCommand {
    const lineas = request.lineas.map(l => new SolicitudLinea(
      new ProductoId(l.productoId),
      l.cantidad,
      new Dinero(l.precioUnitario, l.moneda)
    ));
    return new CrearPedidoCommand(new ClienteId(request.clienteId), lineas);
  }
}
```

### Adaptador secundario: Repositorio con TypeORM
```typescript
// src/infrastructure/persistence/typeorm/PedidoEntity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { LineaPedidoEntity } from './LineaPedidoEntity';

@Entity('pedidos')
export class PedidoEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  clienteId!: string;

  @Column()
  estado!: string;

  @OneToMany(() => LineaPedidoEntity, linea => linea.pedido, { cascade: true })
  lineas!: LineaPedidoEntity[];
}
```

```typescript
// src/infrastructure/persistence/RepositorioPedidosTypeORM.ts
import { IRepositorioPedidos } from '../../../domain/port/IRepositorioPedidos';
import { Pedido } from '../../../domain/model/Pedido';
import { PedidoId } from '../../../domain/model/PedidoId';
import { AppDataSource } from './typeorm/datasource';
import { PedidoEntity } from './typeorm/PedidoEntity';
import { PedidoMapper } from './PedidoMapper';

export class RepositorioPedidosTypeORM implements IRepositorioPedidos {
  private repo = AppDataSource.getRepository(PedidoEntity);

  constructor(private mapper: PedidoMapper) {}

  async guardar(pedido: Pedido): Promise<void> {
    const entity = this.mapper.toEntity(pedido);
    await this.repo.save(entity);
  }

  async buscarPorId(id: PedidoId): Promise<Pedido | null> {
    const entity = await this.repo.findOne({ where: { id: id.valor }, relations: ['lineas'] });
    return entity ? this.mapper.toDomain(entity) : null;
  }
}
```

El mapper es responsable de la traducción entre el modelo de dominio y la entidad ORM:
```typescript
// src/infrastructure/persistence/PedidoMapper.ts
import { Pedido } from '../../../domain/model/Pedido';
import { PedidoEntity } from './typeorm/PedidoEntity';
import { LineaPedidoEntity } from './typeorm/LineaPedidoEntity';
import { PedidoId } from '../../../domain/model/PedidoId';
import { ClienteId } from '../../../domain/model/ClienteId';
// ... otras importaciones del dominio

export class PedidoMapper {
  toEntity(pedido: Pedido): PedidoEntity {
    const entity = new PedidoEntity();
    entity.id = pedido.id.valor;
    entity.clienteId = pedido.clienteId.valor;
    entity.estado = pedido.estado;
    entity.lineas = pedido.lineas.map(linea => {
      const le = new LineaPedidoEntity();
      le.productoId = linea.productoId.valor;
      le.cantidad = linea.cantidad;
      le.precioUnitario = linea.precioUnitario.cantidad;
      le.moneda = linea.precioUnitario.moneda;
      return le;
    });
    return entity;
  }

  toDomain(entity: PedidoEntity): Pedido {
    // Reconstruye el Pedido. 
    // Se puede usar un constructor interno o un método 'hidratar' en Pedido.
    // Aquí se muestra un ejemplo con un factory estático 'reconstituir' (no implementado en Pedido anterior, 
    // pero se haría para mantener la encapsulación).
    // const pedido = Pedido.reconstituir(
    //   new PedidoId(entity.id),
    //   new ClienteId(entity.clienteId),
    //   entity.estado as PedidoEstado,
    //   entity.lineas.map(...)
    // );
    // ...
  }
}
```

### Adaptador secundario: Publicador de eventos con Kafka
```typescript
// src/infrastructure/messaging/KafkaPublicadorEventos.ts
import { IPublicadorEventos } from '../../../domain/port/IPublicadorEventos';
import { Kafka, Producer } from 'kafkajs';

export class KafkaPublicadorEventos implements IPublicadorEventos {
  private producer: Producer;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async publicar(evento: object): Promise<void> {
    await this.producer.connect();
    const topico = evento.constructor.name.toLowerCase().replace('evento', '');
    await this.producer.send({
      topic: topico,
      messages: [{ key: crypto.randomUUID(), value: JSON.stringify(evento) }],
    });
  }
}
```

## 2.4. Composición raíz y cableado (main + container)

En Node.js es común hacer el cableado manual en el punto de entrada o usar un contenedor ligero como `Awilix`. Aquí se muestra un ejemplo manual que crea la red de objetos.

```typescript
// src/main.ts
import express from 'express';
import { AppDataSource } from './infrastructure/persistence/typeorm/datasource';
import { RepositorioPedidosTypeORM } from './infrastructure/persistence/RepositorioPedidosTypeORM';
import { PedidoMapper } from './infrastructure/persistence/PedidoMapper';
import { KafkaPublicadorEventos } from './infrastructure/messaging/KafkaPublicadorEventos';
import { Kafka } from 'kafkajs';
import { PedidoApplicationService } from './application/service/PedidoApplicationService';
import { pedidoController } from './infrastructure/web/controllers/PedidoController';
import { settings } from './config/settings';

async function bootstrap() {
  // Inicializar TypeORM
  await AppDataSource.initialize();

  // Instanciar adaptadores secundarios
  const pedidoMapper = new PedidoMapper();
  const repositorio = new RepositorioPedidosTypeORM(pedidoMapper);

  const kafka = new Kafka({ brokers: settings.kafkaBrokers });
  const publicador = new KafkaPublicadorEventos(kafka);
  await (publicador as any).producer.connect(); // simplificación

  // Instanciar servicio de aplicación (inyecta puertos secundarios)
  const gestionPedidos = new PedidoApplicationService(repositorio, publicador);

  // Crear adaptador primario (controlador Express)
  const app = express();
  app.use(express.json());
  app.use('/api/v1/pedidos', pedidoController(gestionPedidos));

  app.listen(settings.port, () => {
    console.log(`Servidor escuchando en puerto ${settings.port}`);
  });
}

bootstrap().catch(console.error);
```

La configuración de variables de entorno se centraliza:
```typescript
// src/config/settings.ts
export const settings = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || 'localhost',
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
};
```

Este cableado manual es transparente y cumple estrictamente la regla de dependencia: el núcleo nunca ve las clases concretas; el `main` sí.

## 2.5. Pruebas

### Test unitario del dominio (sin dependencias)
```typescript
// tests/domain/Pedido.test.ts
import { Pedido } from '../../src/domain/model/Pedido';
import { ClienteId } from '../../src/domain/model/ClienteId';
import { PedidoEstado } from '../../src/domain/model/PedidoEstado';
import { PedidoNoModificableException } from '../../src/domain/exception/PedidoNoModificableException';

describe('Pedido', () => {
  it('no debe permitir cancelar un pedido en estado ENVIADO', () => {
    // Crear pedido en estado enviado usando un factory de test o reconstitución
    const pedido = Pedido.crear(new ClienteId('C1'), []);
    // Forzar estado mediante reflexión o método interno solo para test (no recomendado en producción)
    (pedido as any)._estado = PedidoEstado.ENVIADO;

    expect(() => pedido.cancelar()).toThrow(PedidoNoModificableException);
  });
});
```

### Test del servicio de aplicación con dobles
```typescript
// tests/application/PedidoApplicationService.test.ts
import { PedidoApplicationService } from '../../src/application/service/PedidoApplicationService';
import { IRepositorioPedidos } from '../../src/domain/port/IRepositorioPedidos';
import { IPublicadorEventos } from '../../src/domain/port/IPublicadorEventos';
import { CrearPedidoCommand } from '../../src/application/command/CrearPedidoCommand';
import { ClienteId } from '../../src/domain/model/ClienteId';
import { PedidoId } from '../../src/domain/model/PedidoId';

describe('PedidoApplicationService', () => {
  let repoMock: jest.Mocked<IRepositorioPedidos>;
  let pubMock: jest.Mocked<IPublicadorEventos>;
  let service: PedidoApplicationService;

  beforeEach(() => {
    repoMock = { guardar: jest.fn(), buscarPorId: jest.fn() };
    pubMock = { publicar: jest.fn() };
    service = new PedidoApplicationService(repoMock, pubMock);
  });

  it('debe guardar el pedido y publicar eventos al crearlo', async () => {
    const comando = new CrearPedidoCommand(new ClienteId('C1'), []);
    const id = await service.crearPedido(comando);

    expect(repoMock.guardar).toHaveBeenCalled();
    expect(pubMock.publicar).toHaveBeenCalledTimes(1); // PedidoCreado
    expect(id).toBeInstanceOf(PedidoId);
  });
});
```

### Test de integración del adaptador de persistencia
```typescript
// tests/infrastructure/RepositorioPedidosTypeORM.test.ts
import { RepositorioPedidosTypeORM } from '../../src/infrastructure/persistence/RepositorioPedidosTypeORM';
import { PedidoMapper } from '../../src/infrastructure/persistence/PedidoMapper';
import { AppDataSource } from '../../src/infrastructure/persistence/typeorm/datasource';
import { Pedido } from '../../src/domain/model/Pedido';

beforeAll(async () => {
  // Inicializar base de datos de prueba (puede ser SQLite en memoria)
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('RepositorioPedidosTypeORM', () => {
  it('debe guardar y recuperar un pedido', async () => {
    const repo = new RepositorioPedidosTypeORM(new PedidoMapper());
    const pedido = Pedido.crear(new ClienteId('C1'), []);
    await repo.guardar(pedido);

    const recuperado = await repo.buscarPorId(pedido.id);
    expect(recuperado).not.toBeNull();
    expect(recuperado!.clienteId.valor).toBe('C1');
  });
});
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Resumen del ejemplo .NET](2-ejemplo-dotnet/03-resumen-del-ejemplo-net.md) | [🏠 Inicio](../index.md) | [Resumen del ejemplo Node.js/TypeScript ▶](03-resumen-del-ejemplo-nodejstypescript.md) |
