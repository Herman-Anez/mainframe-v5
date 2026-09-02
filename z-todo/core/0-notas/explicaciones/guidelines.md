# Guidelines — cómo construir un módulo nuevo con estos patrones

Guía **prescriptiva**: reglas, recetas paso a paso y un checklist para levantar un módulo nuevo
siguiendo exactamente los patrones que ya usa `core/`. Codifica el estado actual del código, sin
proponer mejoras ni desviaciones.

**Esto no explica los conceptos.** Para eso:

| Si querés entender… | Leé |
|---|---|
| Qué es un port, un adapter, la regla de dependencia, DIP, el patrón presenter | `arquitectura.md` |
| El dominio en términos de DDD (aggregate, VO, eventos, lenguaje ubicuo, RF/UC) | `domio/documentacion del modulo.md` |
| El recorrido carpeta por carpeta de `core/` | `ESTRUCTURA-cqs.md` |
| Qué concepto vive en qué archivo, fortalezas y olores del código actual | `evaluacion-conceptos.md` |
| Un caso de uso trazado de punta a punta (cliente y servidor) | `flujo-caso-de-uso.md` |
| El detalle del puerto HTTP y el binder que falta | `puertos/use-cases-ports-http.md` |

**Alcance de "módulo"**: cada módulo nuevo es un **árbol de capas propio**, hermano de `core/` (ej.
`z-todo/pagos/`, `z-todo/usuarios/`), con su propia numeración `1-domain/`…`5-generic-implementation/`
y su propio composition root. No se mezclan bounded contexts dentro de las mismas carpetas.

`core/` es el único árbol del proyecto — no hay copias ni variantes que mirar. (Hubo una variante CQRS,
`core-cqrs/`, y un duplicado `core copy/`; ambos se eliminaron.)

---

## 1. Regla de dependencia — lo innegociable

Las flechas de dependencia apuntan **siempre hacia adentro** (hacia el dominio). Concretamente:

| Capa | Puede importar de | Nunca importa de |
|---|---|---|
| `1-domain/` | nada externo salvo `node:crypto` | ninguna otra capa |
| `2-application/` | `1-domain/` | `3-`, `4-`, `5-` |
| `3-adapters/` | `2-application/` (interfaces) | `4-`, `5-` |
| `4-infrastructure/` | `2-application/` (interfaces). `messaging/` además `1-domain/events`; `persistence/` **nada** de `1-domain` | `3-`, `5-` |
| `5-generic-implementation/` | **todo** — es el composition root | — |

Excepción única: los tests (`*.test.ts`) de `2-application/` importan los adapters in-memory de
`4-infrastructure/` para usarlos como fakes. Eso es harness de prueba, no código de producción.

**Se prueba con grep** (corré esto en la raíz del módulo antes de dar por cerrada cualquier tanda):

```bash
# 1-domain no conoce ninguna capa externa:
grep -rn "2-application\|3-adapters\|4-infrastructure\|5-" <modulo>/1-domain --include="*.ts"
# (sin resultados)

# 2-application no conoce infraestructura ni frames (fuera de tests):
grep -rn "4-infrastructure\|5-generic" <modulo>/2-application --include="*.ts" | grep -v ".test.ts"
# (sin resultados)

# la persistencia no conoce el dominio:
grep -rn "1-domain" <modulo>/4-infrastructure/persistence/*.ts
# (ningún import)
```

---

## 2. Estructura de un módulo nuevo

Replicá este árbol. El prefijo numérico **es** el orden de dependencia — respetalo.

```
<modulo>/
  package.json                    ← script "test" propio (ver §13)
  1-domain/
    entities/                     ← aggregate root + entidades hijas
    value-objects/                ← VOs inmutables
    events/                       ← DomainEvent + un archivo por evento
    exceptions/                   ← DomainException + subclases con `code`
    services/                     ← domain services (solo si hace falta)
  2-application/
    ports/out/                    ← interfaces de salida (driven): Repository, EventBus, UnitOfWork
    shared/                       ← helpers entre interactores (§6)
      testing/                    ← capturePresenter (solo lo usan los tests)
    use-cases/
      commands/<caso-de-uso>/     ← 4 archivos + test (§5)
      query/<caso-de-uso>/
      <Modulo>UseCases.ts         ← bundle único de todos los casos de uso
    use-cases-ports/
      backend/                    ← <Modulo>ControllerPort.ts + dtos/
      http/                       ← RouteDescriptor, routeMetadata, un *Route.ts por caso de uso, routes.ts, apiContract.ts, httpErrorStatus.ts, httpValidation.ts, httpBody.ts
  3-adapters/
    backend/                      ← <Modulo>Controller.ts (implements el port)
  4-infrastructure/
    persistence/                  ← InMemory<Aggregate>Repository
    messaging/                    ← InMemoryEventBus
    unit-of-work/                 ← InMemoryUnitOfWork
  5-generic-implementation/
    api/presenters/               ← un presenter por caso de uso
    main.ts                       ← composition root
```

---

## 3. Convenciones de nombres (reglas, no sugerencias)

- **Carpetas de capa**: `<n>-kebab-case` (`1-domain`, `5-generic-implementation`).
- **Carpetas de caso de uso**: `kebab-case` (`add-todo-item`, `change-todo-item-priority`). El
  **mismo token** se reusa en `2-application/use-cases/` y en `2-application/use-cases-ports/http/`.
- **Archivos PascalCase**: el nombre del archivo = el tipo o clase que exporta. **Un solo export por
  archivo** (`TodoListInteractor.ts` exporta `TodoListInteractor`, `TodoItemView.ts` exporta
  `TodoItemView` + su fn proyectora).
- **Archivos camelCase**: solo para módulos-función sin un tipo dominante — `persistAndPublish.ts`,
  `httpValidation.ts`, `httpErrorStatus.ts`, `routeMetadata.ts`, `apiContract.ts`, `routes.ts`,
  `capturePresenter.ts`, `httpBody.ts`.
- **Tests**: siempre co-locados, `<Unidad>.test.ts` al lado de `<Unidad>.ts`.
- **Split port ↔ adapter**: la interface vive en `2-application/` (`ports/out/` si es driven,
  `use-cases-ports/` si es driving); la implementación vive hacia afuera (`4-infrastructure/` o
  `3-adapters/`). Pares de ejemplo: `TodoListRepositoryPort` ↔ `InMemoryTodoListRepository`,
  `TodoListControllerPort` ↔ `TodoListController`.

---

## 4. Recetas de dominio (`1-domain/`)

### 4.1 Value object

- `private constructor(readonly value: T)` — nunca `new` desde afuera.
- Factory estático `create(raw)` que **valida** y tira `ValidationException` si el dato es inválido
  (un VO inválido no puede existir en memoria).
- Factory `from(string)` para **rehidratar** desde persistencia (valida forma, no reglas de negocio
  completas).
- `equals(other): boolean`.
- Inmutable. Para enum-like: `type XValue = 'A' | 'B' | 'C'` (union cerrada) + factories nombrados
  (`Priority.low()`, `Priority.high()`).
- Referencia: `1-domain/value-objects/Title.ts`, `Priority.ts`, `Status.ts`.

### 4.2 Entidad / aggregate root

- `private constructor(...)`.
- `static create(...)` — único punto de creación válida. Genera el id, valida vía VOs, y **emite el
  evento de creación** vía `this.addDomainEvent(...)`.
- `static restore(props)` — rehidrata una entidad ya existente (id previo, cualquier estado). **No
  emite eventos** — reconstruir no es crear. Recibe los hijos ya reconstruidos.
- Campos `private _x`; getters `readonly`. El array de hijos se expone como
  `get items(): readonly TodoItem[]` — nunca el array mutable.
- Los mutadores devuelven el hijo mutado (`TodoItem`) o `void`; nunca exponen estado interno mutable.
- **Todas las invariantes se protegen en la raíz** (`if (this._items.length >= MAX) throw ...`). Las
  entidades hijas solo se acceden y mutan a través del aggregate root.
- Buffer de eventos: `private _domainEvents: DomainEvent[]`, `get domainEvents(): readonly ...`,
  `clearEvents(): void`, `private addDomainEvent(e)`. El aggregate no conoce el event bus — quien lo
  persiste publica y limpia (ver §7).
- Referencia: `1-domain/entities/TodoList.ts`, `TodoItem.ts`.

### 4.3 Domain event

- `implements DomainEvent` (`{ eventName: string; occurredOn: Date }`).
- `readonly eventName = 'TodoItemAdded'` — literal, igual al nombre de la clase.
- `readonly occurredOn: Date` seteado en el constructor (`this.occurredOn = new Date()`).
- Carga los **datos mínimos** que un consumidor necesita para entender qué pasó sin ir a buscar más
  (`TodoItemAdded` lleva `title`, `description`, `priority`, no solo el id).
- Se emite **desde el método del aggregate**. Excepción: eventos de borrado (`TodoListDeleted`) — el
  aggregate no participa de su propia eliminación, así que el interactor arma el evento a mano tras un
  `delete` exitoso.
- Referencia: `1-domain/events/*.ts`.

### 4.4 Excepción de dominio

- Extiende `DomainException` (abstracta, extiende `Error`, fija `this.name`).
- Fija `readonly code: DomainErrorCode` — uno de `'NOT_FOUND' | 'CONFLICT' | 'VALIDATION'`.
- Mensaje concreto en `super(...)`.
- **Prohibido `throw new Error(...)` genérico** en el dominio.
- Semántica del `code`: `NOT_FOUND` = no existe; `CONFLICT` = invariante violada por estado (lista
  llena, item ya completo); `VALIDATION` = dato inválido (título corto, prioridad inexistente, id
  vacío).
- La capa HTTP mapea por `code` (404 / 409 / 422; cualquier cosa que **no** sea `DomainException` →
  500). Nunca encadenar `instanceof` en dominio ni en aplicación.
- Referencia: `1-domain/exceptions/DomainException.ts`, `TodoListFullException.ts`,
  `ValidationException.ts`.

### 4.5 Domain service

- Solo si la lógica **no pertenece naturalmente a una entidad** (ej. un cálculo que involucra a todos
  los hijos por igual).
- Métodos `static`, sin estado.
- Opera sobre la **forma mínima** que necesita (`readonly { status: string }[]`), no sobre el
  aggregate — así lo puede llamar tanto el interactor con el aggregate reconstruido como cualquier
  otro con datos planos.
- Referencia: `1-domain/services/TodoListDomainService.ts`.

---

## 5. Receta: agregar un caso de uso (el patrón central)

Cada caso de uso son **4 archivos + 1 test**, en `2-application/use-cases/commands/<nombre>/` o
`.../query/<nombre>/`.

### 5.1 `<Nombre>Input.ts`

Interface plana. Solo primitivos y DTOs, nunca tipos de dominio.

```ts
export interface AddTodoItemInput {
  listId: string;
  title: string;
  description: string;
  priority: string;
}
```

### 5.2 `<Nombre>Output.ts`

Interface plana con lo que sale en éxito. **Se omite el archivo** si el resultado es `void` — en ese
caso el interactor usa `OutputBoundary<void>` y la ruta HTTP lleva `successStatus: 204`.

```ts
export interface AddTodoItemOutput {
  itemId: string;
}
```

Comandos que devuelven el recurso mutado usan la proyección plana compartida (`{ item: TodoItemView }`).

### 5.3 `<Nombre>UseCase.ts` — el port de entrada

```ts
import { UseCase } from '../../../shared/UseCase';
import { AddTodoItemInput } from './AddTodoItemInput';
import { AddTodoItemOutput } from './AddTodoItemOutput';

export interface AddTodoItemUseCase extends UseCase<AddTodoItemInput, AddTodoItemOutput> {}
```

Nunca se repite la firma `execute(...)` — se extiende el genérico `UseCase<I, O>` para conservar un
nombre legible.

### 5.4 `<Nombre>Interactor.ts` — la implementación

Reglas:

- `class XInteractor implements XUseCase`.
- Inyecta por constructor **solo** los ports de salida que use (`private readonly repository: ...Port`,
  `eventBus`, `unitOfWork`). Las queries de lectura suelen recibir solo el repositorio.
- El cuerpo entero va envuelto en:
  ```ts
  try {
    // ...
    output.presentSuccess(/* ... */);
  } catch (error) {
    output.presentError(error as Error);
  }
  ```
- **El interactor nunca hace `return`.** Comunica el resultado llamando a `output.presentSuccess(...)`
  o `output.presentError(...)`.

Forma canónica de un **comando**:

```ts
async execute(input: AddTodoItemInput, output: OutputBoundary<AddTodoItemOutput>): Promise<void> {
  try {
    const id = TodoListId.from(input.listId);              // valida id vacío → VALIDATION → 422
    const record = await this.repository.findById(id.value);
    if (!record) throw new TodoListNotFoundException(input.listId);
    const list = TodoListMapper.toDomain(record);          // record → aggregate
    const item = list.addItem(input.title, input.description, input.priority);  // regla de negocio
    await persistAndPublish(list, this.repository, this.eventBus, this.unitOfWork);  // §7
    output.presentSuccess({ itemId: item.id.value });
  } catch (error) {
    output.presentError(error as Error);
  }
}
```

Forma canónica de una **query**:

```ts
async execute(input: GetTodoListInput, output: OutputBoundary<GetTodoListOutput>): Promise<void> {
  try {
    const id = TodoListId.from(input.listId);
    const record = await this.repository.findById(id.value);
    if (!record) throw new TodoListNotFoundException(input.listId);
    const list = TodoListMapper.toDomain(record);
    output.presentSuccess({
      id: list.id.value,
      name: list.name,
      completionPercentage: TodoListDomainService.calculateCompletionPercentage(list.items),
      items: list.items.map(toTodoItemView),              // proyección plana a DTO
    });
  } catch (error) {
    output.presentError(error as Error);
  }
}
```

Borrado: no reconstruye el aggregate — usa `record.id` / `record.name` para el evento, y hace el
`begin/commit/rollback` + `publish` a mano (es la excepción a §7).

### 5.5 `<Nombre>Interactor.test.ts`

- Co-locado. `node:test` + `node:assert/strict`. Sin Jest/Vitest.
- Los fakes **son los adapters in-memory reales** (`InMemoryTodoListRepository`, `InMemoryEventBus`,
  `InMemoryUnitOfWork`) — no se mockea nada.
- Presenter falso vía `capture<TOutput>()` de `shared/testing/capturePresenter` — devuelve
  `{ presenter, state }`; se asserta sobre `state.success` / `state.error` / `state.settled`.
- Helper `seed*` para dejar el repositorio en el estado de partida.
- Verificar **estado** (`repository.findById(...)`) **y comportamiento** (evento publicado, capturado
  con un `eventBus.subscribe(...)` en el test).
- Referencia: `2-application/use-cases/commands/add-todo-item/AddTodoItemInteractor.test.ts`.

### 5.6 Wiring (no te olvides ninguno)

1. Agregar el campo a la interface bundle `<Modulo>UseCases.ts`.
2. `use-cases-ports/backend/`: agregar la firma a `<Modulo>ControllerPort.ts` y el método a
   `<Modulo>Controller.ts`. Agregar un DTO en `dtos/` **solo si** la forma del request difiere del
   Input de aplicación (ej. `listId` llega como param de ruta, aparte del body).
3. `use-cases-ports/http/`: entrada en `routeMetadata.ts` + `<nombre>/<Nombre>Route.ts` + sumarla en
   `routes.ts` + tipos en `apiContract.ts` (`ApiContractTypes`).
4. Composition root `5-generic-implementation/main.ts`: instanciar el interactor y sumarlo al objeto
   `<Modulo>UseCases`. Crear su presenter en `api/presenters/`.

---

## 6. `shared/` — qué va y qué no

`2-application/shared/` es para código reusado **entre interactores**. No es un caso de uso, no tiene
Input/Output propios. Contenido esperado:

| Archivo | Qué es |
|---|---|
| `OutputBoundary.ts` | genérico `OutputBoundary<T>` (`presentSuccess(T)` / `presentError(Error)`) — reemplaza los N boundaries por caso de uso |
| `UseCase.ts` | genérico `UseCase<I, O>` (`execute(input, output): Promise<void>`) |
| `persistAndPublish.ts` | el epílogo compartido de los comandos (§7) |
| `<Cosa>View.ts` | proyección plana de una entidad para cruzar el borde + su fn `to<Cosa>View(entity)` |
| `<Cosa>Record.ts` | forma "de fila" del aggregate para persistencia — solo strings, serializable |
| `<Cosa>Mapper.ts` | `toRecord(aggregate)` / `toDomain(record)` — el data-mapper, separado del repositorio |
| `testing/capturePresenter.ts` | fábrica de un `OutputBoundary` falso; **solo lo importan los tests** |

---

## 7. El contrato `persistAndPublish`

Todo comando que muta un aggregate termina llamando a `persistAndPublish(aggregate, repo, bus, uow)`,
en una línea, después de mutar. Hace exactamente:

```
unitOfWork.begin()
  → repository.save(Mapper.toRecord(aggregate))
  → unitOfWork.commit()          (o rollback() + re-throw si falla)
→ eventBus.publish(aggregate.domainEvents)
→ aggregate.clearEvents()
```

El aggregate nunca sabe que existe un event bus ni una transacción — el interactor tampoco repite este
bloque, lo delega. Referencia: `2-application/shared/persistAndPublish.ts`.

**Excepción documentada**: `DeleteTodoListInteractor` no usa este helper (no reconstruye el aggregate);
hace el `begin/commit/rollback` + `publish` inline.

---

## 8. Ports de salida (`2-application/ports/out/`)

- Interfaces **chicas y segregadas** (ISP): una por responsabilidad
  (`TodoListRepositoryPort`, `EventBusPort`, `UnitOfWorkPort`) — no una interfaz gorda.
- **El repositorio habla en `Record` / `string`, nunca en tipos de dominio**:
  ```ts
  export interface TodoListRepositoryPort {
    save(record: TodoListRecord): Promise<void>;
    findById(id: string): Promise<TodoListRecord | null>;
    findAll(): Promise<TodoListRecord[]>;
    delete(id: string): Promise<void>;
  }
  ```
  Así `4-infrastructure/persistence/` no importa nada de `1-domain`. La traducción record↔aggregate la
  hace el `Mapper` (capa de aplicación, que sí puede conocer el dominio), habilitada por `restore()` /
  `from()` en las entidades y VOs.

---

## 9. Adapters de salida (`4-infrastructure/`)

- `class InMemoryXRepository implements XRepositoryPort`.
- In-memory = `Map<string, XRecord>` + `structuredClone` en `save` y en cada lectura — aísla el store
  de cualquier referencia externa (semántica de una BD real: mutar después de `save` no cambia lo
  guardado; dos `findById` devuelven objetos independientes).
- `InMemoryEventBus`: `Map<eventName, handler[]>`; `publish` es `async` y **espera** (`await`) cada
  handler antes de seguir.
- `InMemoryUnitOfWork`: `begin/commit/rollback` no-op — está bien mientras no haya BD transaccional
  detrás.
- Referencia: `4-infrastructure/persistence/InMemoryTodoListRepository.ts`,
  `messaging/InMemoryEventBus.ts`, `unit-of-work/InMemoryUnitOfWork.ts`.

---

## 10. Puerto + adapter de entrada (backend)

- **Puerto** en `2-application/use-cases-ports/backend/`: `<Modulo>ControllerPort.ts` — la fachada con
  una firma por caso de uso, sin lógica. `dtos/` al lado, con los request types que sean parte de la
  firma pública.
- **Adapter** en `3-adapters/backend/`: `class <Modulo>Controller implements <Modulo>ControllerPort`.
  Un método por caso de uso, cada uno delega en `this.useCases.xxx.execute(input, output)`.
- El controller **recibe el presenter como parámetro** en cada método — nunca instancia uno. Quien lo
  llama (el composition root, un binder, un test) decide qué `OutputBoundary` pasar.
- Referencia: `2-application/use-cases-ports/backend/TodoListControllerPort.ts`,
  `3-adapters/backend/TodoListController.ts`.

---

## 11. Puerto HTTP (`2-application/use-cases-ports/http/`)

Datos **agnósticos a framework** — describen qué endpoint existe y cómo se arma su Input, sin importar
Express/Fastify/nada.

| Archivo | Rol |
|---|---|
| `RouteDescriptor.ts` | tipos: `HttpMethod`, `HttpRequestData` (`{params, query, body}`), `RouteDescriptor<TInput, TOutput>` (`{method, path, buildInput, useCase, successStatus, errorStatus}`) |
| `routeMetadata.ts` | `ROUTE_METHOD_PATH` — **única fuente** de método+path, `as const satisfies Record<string, {method, path}>` |
| `<nombre>/<Nombre>Route.ts` | `create<Nombre>Route(useCase): RouteDescriptor<XInput, XOutput>` — los genéricos en la firma obligan a que `buildInput` y `useCase` coincidan en tipo |
| `routes.ts` | agregador puro: `createHttpRoutes(useCases): RouteDescriptor[]` — junta las factories, cero lógica |
| `apiContract.ts` | para un **frontend**: `ApiContractTypes` (mapa solo-de-tipos, se borra en runtime), `ApiContract` (objeto runtime = `ROUTE_METHOD_PATH`), `buildPath(path, params)` |
| `httpErrorStatus.ts` | `defaultErrorStatus(error)` — `RequestValidationError` → 400; `DomainException` por `code` → 404/409/422; resto → 500 |
| `httpValidation.ts` | `requireString(body, key)` para campos **obligatorios** → `RequestValidationError` → 400. Es error de transporte, no hereda de `DomainException` |
| `httpBody.ts` | `bodyAsRecord`, `stringField(body, key, fallback)` — fallback silencioso, **solo para opcionales** |

`buildInput` puede lanzar (`requireString`) — el binder tiene que envolver `buildInput` +
`useCase.execute` en el mismo `try` y rutear por `errorStatus`.

**No hay binder en esta carpeta, a propósito.** Un binder real (Express/Fastify) sería un frame aparte
(`5-express-implementation/`), no parte del puerto. Ver `use-cases-ports-http.md`.

---

## 12. Presenters + composition root (`5-generic-implementation/`)

- **Un presenter por caso de uso** en `api/presenters/`, `implements` el `OutputBoundary`
  correspondiente. Es un **Humble Object**: sin lógica, solo `console.log` (o, en otro frame, armar la
  respuesta HTTP). Si el composition root necesita leer un id generado para encadenar el flujo, el
  presenter puede guardarlo en un campo público (`CreateTodoListPresenter.result`).
- **`main.ts` = composition root**, el único lugar con `new` de adapters concretos:
  1. Instancia infraestructura (`repository`, `eventBus`, `unitOfWork`).
  2. Suscribe los handlers de evento (loggers).
  3. Instancia los interactores inyectándoles la infraestructura, y arma el objeto `<Modulo>UseCases`.
  4. Instancia el controller con ese bundle.
  5. Corre el flujo (o levanta el servidor, en un frame HTTP).
- Referencia: `5-generic-implementation/main.ts`, `api/presenters/GetTodoListPresenter.ts`.

---

## 13. Testing

- `node:test` + `node:assert/strict`. **Sin** Jest, Vitest, ni ninguna dependencia de testing.
- Co-locado: `<Unidad>.test.ts` al lado de `<Unidad>.ts`.
- Los adapters in-memory reales son los fakes.
- `capture<TOutput>()` para el presenter; AAA (Arrange-Act-Assert); helper `seed*` para el estado
  inicial.
- Verificar estado **y** comportamiento (evento publicado).
- Cubrir por caso de uso: camino feliz, cada excepción de dominio, publicación del evento, y algún
  fallo de infraestructura con rollback.
- Además: un test del contrato HTTP que simula el flujo completo sin servidor
  (`routes.test.ts` — arma `HttpRequestData` falsos, llama `buildInput` + `useCase.execute` a mano,
  chequea `successStatus` y `errorStatus`), y un test de coherencia `apiContract.test.ts`.
- Script en el `package.json` del módulo:
  ```json
  "scripts": { "test": "tsx --test $(find <modulo> -name '*.test.ts')" }
  ```

---

## 14. Checklist — "módulo nuevo listo"

```
[ ] Árbol de 5 capas creado con prefijos numéricos, hermano de core/
[ ] package.json propio con script "test"
[ ] grep: 1-domain no importa ninguna otra capa
[ ] grep: 2-application no importa 4-infrastructure ni 5-* (fuera de tests)
[ ] grep: 4-infrastructure/persistence no importa 1-domain
[ ] Cada value object: private constructor, create() valida, from() rehidrata, equals(), inmutable
[ ] Cada aggregate: private constructor, create() emite evento, restore() sin eventos
[ ] Invariantes protegidas en el aggregate root; hijos solo accesibles vía la raíz
[ ] Cada mutación relevante emite un domain event con datos mínimos
[ ] Cada error de dominio extiende DomainException y fija `code` (NOT_FOUND/CONFLICT/VALIDATION)
[ ] Cero `throw new Error` genérico en 1-domain
[ ] Cada caso de uso = Input + Output(*) + UseCase + Interactor + test co-locado   (*omitir si void)
[ ] Ningún interactor hace `return`; todos usan output.presentSuccess/presentError
[ ] Todo comando que muta pasa por persistAndPublish (salvo borrado, documentado)
[ ] Ports de salida hablan en Record/string, nunca tipos de dominio
[ ] <Modulo>UseCases.ts lista todos los casos de uso
[ ] <Modulo>ControllerPort + <Modulo>Controller con un método por caso de uso
[ ] routeMetadata + un *Route.ts por caso de uso + routes.ts + apiContract actualizado
[ ] Un presenter por caso de uso (Humble Object) + wiring en main.ts
[ ] Un solo composition root (5-generic-implementation/main.ts)
[ ] pnpm test verde
[ ] tsc --noEmit limpio para el módulo
```

---

## 15. Qué NO hacer

- **No** `throw new Error(...)` en `1-domain/` — siempre una subclase de `DomainException` con `code`.
- **No** encadenar `instanceof` para traducir error → status HTTP — mapear por `code`.
- **No** pasar el aggregate (`TodoList`) a través del borde de un caso de uso — proyectar a un DTO
  plano (`Output`, `TodoItemView`) armado a mano.
- **No** dejar que `4-infrastructure/persistence/` importe `1-domain` — habla en `Record`, el `Mapper`
  traduce.
- **No** instanciar presenters dentro de un controller ni de un interactor — se reciben como
  parámetro.
- **No** poner lógica de mapeo en el repositorio — vive en `<Cosa>Mapper.ts` (capa de aplicación).
- **No** hacer `return` desde un interactor.
- **No** agregar Jest, Vitest, ni ninguna dependencia de testing — `node:test` nativo.
- **No** repetir la firma `execute(...)` ni el shape del boundary — extender `UseCase<I,O>` /
  `OutputBoundary<T>` de `shared/`.
- **No** duplicar método/path de una ruta — `routeMetadata.ts` es la única fuente.

---

## 16. Punteros

- Conceptos y analogías: `arquitectura.md`
- DDD del dominio (RF/UC, lenguaje ubicuo): `domio/documentacion del modulo.md`
- Tour carpeta por carpeta: `ESTRUCTURA-cqs.md`
- Concepto → archivo, fortalezas y olores: `evaluacion-conceptos.md`
- Un caso de uso trazado punta a punta: `flujo-caso-de-uso.md`
- Puerto HTTP en detalle + el binder que falta: `puertos/use-cases-ports-http.md`

`core/` es el único árbol del proyecto. Hubo una variante CQRS (`core-cqrs/`) y un duplicado
(`core copy/`); ambos se eliminaron y no son referencia para nada.
