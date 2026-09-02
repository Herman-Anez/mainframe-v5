# Evaluación del código + conceptos aplicados — `z-todo/core`

Fecha: 2026-09-02 (revisada tras la limpieza de copias). Basado en lectura completa de `core/` (todos
los `.ts`), ejecución de `pnpm test` (**52/52 en verde**) y `tsc --noEmit -p tsconfig.json` (**limpio,
exit 0**).

> Limpieza aplicada: se eliminaron del repo el duplicado `core copy/` (traía `5-angular/` y arrastraba
> ~30 errores de `tsc`) y la variante paralela `core-cqrs/` (CQRS con read model separado; su dominio y
> sus comandos eran idénticos a `core/`). Se quitó el script `test:cqrs` de `package.json`. `core/`
> quedó como único árbol del proyecto.

---

## 1. Evaluación

### 1.1 Veredicto

Código de **calidad didáctica alta**: es una implementación de manual de Clean Architecture +
Arquitectura Hexagonal + DDD táctico, con la **regla de dependencia respetada de verdad**
(no solo en los nombres de carpeta). La consistencia entre los 9 casos de uso es casi
mecánica —bueno para leer, malo si se quiere reducir boilerplate—. No hay dependencias de
framework en el núcleo. Los tests son rápidos, deterministas y sin librería de mocks.

El punto flojo no es la arquitectura sino que **está incompleta en el borde**: todo el
contrato HTTP existe como datos y tipos pero **nadie lo sirve** (gap #1 del handoff).

### 1.2 Fortalezas

| # | Qué | Dónde |
|---|-----|-------|
| F1 | Regla de dependencia real: `4-infrastructure/persistence/` no importa `1-domain` en absoluto (verificado por diseño: habla en `TodoListRecord`) | `InMemoryTodoListRepository.ts`, `TodoListRepositoryPort.ts` |
| F2 | Value Objects bien hechos: `private constructor` + factory, inmutables (`readonly value`), autovalidantes, con `equals()` | `1-domain/value-objects/*` |
| F3 | Agregado con invariante en la raíz: `TodoItem` solo se muta vía `TodoList`; `MAX_ITEMS` se chequea en `addItem()` | `TodoList.ts:15,50-58` |
| F4 | Taxonomía de errores transporte-agnóstica: `DomainException.code` (`NOT_FOUND`/`CONFLICT`/`VALIDATION`) → un `switch` traduce a HTTP, sin cadenas de `instanceof` | `DomainException.ts`, `httpErrorStatus.ts` |
| F5 | Reconstitución modelada explícitamente y separada de creación: `restore()` / `X.from()` no disparan eventos ("reconstruir no es crear") | `TodoList.ts:37-41`, `TodoItem.ts:38-52`, `Status.from`, `Priority.from` |
| F6 | Data Mapper separado del repositorio → un adapter Postgres/archivo reusaría `TodoListMapper` sin tocar dominio | `TodoListMapper.ts` |
| F7 | Puertos chicos y segregados (ISP): `EventBusPort`, `UnitOfWorkPort`, `TodoListRepositoryPort` son interfaces mínimas independientes | `2-application/ports/out/*` |
| F8 | Composition Root único y legible; los interactores reciben todo por constructor | `5-generic-implementation/main.ts` |
| F9 | `as const satisfies Record<...>` en la tabla de rutas: valida forma sin ensanchar el tipo literal | `routeMetadata.ts:20` |
| F10 | Contrato de tipos que se borra en runtime (`ApiContractTypes`) separado del objeto runtime (`ApiContract`) | `apiContract.ts:36,49` |
| F11 | Single Source of Truth para método+path (`ROUTE_METHOD_PATH`) consumida por server y por cliente | `routeMetadata.ts` |
| F12 | Tests como fakes, no mocks: los adapters in-memory son los dobles de prueba (LSP en acción) | `*.test.ts`, `routes.test.ts:21-37` |
| F13 | Aislamiento de referencias en el store con `structuredClone` en save/read — se comporta como una BD real | `InMemoryTodoListRepository.ts:14,19,23` |
| F14 | DRY aplicado con criterio: 9 `OutputBoundary` idénticos colapsados en un genérico; `.map(toTodoItemView)` extraído; `persistAndPublish` compartido | `shared/OutputBoundary.ts`, `shared/TodoItemView.ts`, `shared/persistAndPublish.ts` |

### 1.3 Debilidades y olores

| # | Sev | Qué | Dónde |
|---|-----|-----|-------|
| D1 | ~~media~~ **RESUELTO** | Antes: `tsconfig.json` con `include: ["**/*.ts"]` sin `exclude` arrastraba `core copy/` (duplicado con `5-angular`) → `tsc -p tsconfig.json` tiraba ~30 errores de ahí. Ahora `core copy/` fue eliminado y `tsc --noEmit -p tsconfig.json` da **exit 0, limpio** (verificado). Ya no hace falta un `exclude`. | `tsconfig.json:12` |
| D2 | media | **`try/catch` + `output.presentError(error)` repetido literal en los 9 interactores**. Es el mismo bloque copiado. Cabe un helper/plantilla (`runUseCase(fn, output)`), un decorator, o mover el catch al borde. | todos los `*Interactor.ts` |
| D3 | media | **`persistAndPublish` publica eventos DESPUÉS del `commit`** (`persistAndPublish.ts:21`). Si `eventBus.publish` falla, el estado quedó commiteado y los eventos se pierden. Para ir a una BD real hace falta patrón *outbox* (o publicar dentro de la transacción). Aceptable en in-memory, conviene anotarlo. | `persistAndPublish.ts:13-22` |
| D4 | media | **`OutputBoundary` es sincrónico** (`presentSuccess(): void`) pero los interactores son `async`. Un presenter que haga I/O async no se puede esperar. Un binder HTTP real tiene que usar el truco de `capture()` (presenter que guarda estado y después se lee). Fricción conocida del patrón EBI en TS. | `shared/OutputBoundary.ts` |
| D5 | baja | **Queries rehidratan el agregado completo solo para leer**: `GetTodoList`/`ListTodoLists` hacen `TodoListMapper.toDomain(record)` + `TodoListDomainService` y después aplanan a `TodoItemView`. Para listas grandes es un round-trip por el dominio innecesario; un read model plano (CQRS) lo evita — de hecho la variante `core-cqrs/`, ya eliminada, lo hacía así. | `GetTodoListInteractor.ts:22`, `ListTodoListsInteractor.ts:17-26` |
| D6 | baja | **`DeleteTodoListInteractor` no usa `persistAndPublish`**: reimplementa `begin/commit/rollback` + `publish` a mano (porque no reconstruye el agregado). Inconsistencia leve; cabría un `withUnitOfWork(uow, fn)`. | `DeleteTodoListInteractor.ts:25-33` |
| D7 | baja | **`new Date()` en constructores de eventos y `randomUUID()` en los VO id** no son inyectables → no se pueden testear timestamps/ids deterministas. Gap ya reconocido. | `events/*.ts`, `TodoListId.ts:8`, `TodoItemId.ts:8` |
| D8 | baja | **Gap principal (ya documentado): no hay binder HTTP**. `RouteDescriptor`/`routes.ts`/`apiContract.ts` no tienen quien los sirva; `httpExample.ts` "corre" tirando 9 *connection refused* a propósito. | `2-application/use-cases-ports/http/*` |
| D9 | nitpick | `ListTodoListsInput` es `interface {}` vacía (consistencia de patrón, no bug). | `ListTodoListsInput.ts` |
| D10 | nitpick | `package.json` raíz: `main: "index.js"` apunta a un archivo que no existe (no hay build a `dist/`). Sigue pendiente. (El script `test:cqrs`, que apuntaba a la carpeta ya borrada `core-cqrs/`, sí se removió.) | `package.json:5` |
| D11 | nitpick | `Priority.from` normaliza con `.toUpperCase()`; `Status.from` no (case-sensible). Asimetría menor entre dos VO hermanos. | `Priority.ts:21` vs `Status.ts:18` |
| D12 | nitpick | `TodoItem` expone `get status(): string` (string plano, no el VO). Práctico para el mapper, pero filtra representación; un `StatusValue` tipado sería más estricto. | `TodoItem.ts:57` |

### 1.4 Métricas

- **Tests:** 52/52 verde (`node:test`, sin framework). Cubren los 9 casos de uso + mapper + `httpErrorStatus` + `httpValidation` + `routes` (flujo HTTP simulado) + repo in-memory.
- **Typecheck:** `tsc --noEmit -p tsconfig.json` **limpio, exit 0** (los ~30 errores previos venían de `core copy/`, ya eliminado — ver D1).
- **Acoplamiento de framework en el núcleo:** cero (ni Express, ni Angular, ni React; solo `node:crypto`).
- **Archivos por caso de uso:** 4 (Input, Output, UseCase, Interactor) tras colapsar los OutputBoundary.
- **Árboles del proyecto:** uno solo (`core/`). Se eliminaron `core copy/` y la variante `core-cqrs/`.

---

## 2. Conceptos aplicados

Cada concepto con al menos un lugar donde se ve.

### 2.1 Domain-Driven Design (táctico)

| Concepto | Dónde |
|----------|-------|
| **Entity** (identidad propia, no por atributos) | `TodoList`, `TodoItem` — identidad vía `TodoListId`/`TodoItemId` |
| **Aggregate / Aggregate Root** | `TodoList` es la raíz; `TodoItem` solo se accede y muta a través de ella |
| **Aggregate boundary / límite de consistencia** | invariante `MAX_ITEMS` chequeada en `TodoList.addItem` |
| **Value Object** (inmutable, sin identidad, `equals`) | `Title`, `Description`, `Status`, `Priority`, `TodoListId`, `TodoItemId` |
| **Self-validating value objects** | `Title.create` (long. 3–100), `Description.create` (≤500), `Priority.from`, `Status.from` |
| **Domain Event** (hecho pasado, inmutable, con `occurredOn`) | `DomainEvent` + `TodoListCreated`, `TodoItemAdded`, `TodoItemCompleted`, `TodoItemRenamed`, `TodoItemDescriptionChanged`, `TodoItemPriorityChanged`, `TodoListDeleted` |
| **Domain Service** (lógica sin estado que no es de una entidad) | `TodoListDomainService.calculateCompletionPercentage` / `isFullyCompleted` |
| **Domain Exception / errores de dominio** | `DomainException` (abstracta) + 5 subclases |
| **Factory Method** (creación) | `TodoList.create`, `TodoItem.create`, `Status.todo/completed`, `Priority.low/medium/high` |
| **Reconstitution / rehidratación** (≠ creación, sin eventos) | `TodoList.restore`, `TodoItem.restore`, `Status.from`, `Priority.from`, `TodoListId.from` |
| **Invariantes forzadas / fail-fast** | título mínimo, tope de items, no completar dos veces (`TodoItem.complete`) |
| **Rich domain model** (anti-anemia) | comportamiento en `TodoList`/`TodoItem`, no en servicios |
| **Tell, Don't Ask** | `list.completeItem(id)` en vez de exponer setters de estado |
| **Encapsulación** | campos `private _x`, getters `readonly`, `get items(): readonly TodoItem[]` |
| **Ubiquitous language** | `create`, `addItem`, `complete`, `rename`, `changePriority`, `TodoListFull` |
| **Collection of domain events por agregado** | `TodoList._domainEvents`, `domainEvents`, `clearEvents()` |

### 2.2 Arquitectura (Clean / Hexagonal / Onion)

| Concepto | Dónde |
|----------|-------|
| **Layered architecture + Dependency Rule** | carpetas `1-domain` → `5-generic-implementation`; dependencias siempre hacia adentro |
| **Ports & Adapters (Hexagonal)** | puertos de salida `TodoListRepositoryPort`/`EventBusPort`/`UnitOfWorkPort`; adapters `InMemory*` |
| **Driven (secondary) ports** | los 3 `ports/out/*` |
| **Driving (primary) ports** | `UseCase<I,O>`, `TodoListControllerPort`, `RouteDescriptor` |
| **Dependency Inversion Principle** | dominio/aplicación definen interfaces; `4-infrastructure` las implementa |
| **Dependency Injection (constructor)** | interactores, `TodoListController`, repos reciben deps por constructor |
| **Composition Root** | `5-generic-implementation/main.ts` — único lugar con `new` de todo |
| **Use Case / Interactor (Clean Architecture)** | los 9 `*Interactor.ts` implementan su `*UseCase` |
| **Input / Output boundaries (EBI)** | `*Input.ts` / `*Output.ts` por caso de uso; `OutputBoundary<T>` |
| **Presenter pattern / inversión del retorno** | `OutputBoundary` + presenters concretos en `5-generic-implementation/api/presenters/*` |
| **Interface Adapters layer** | `3-adapters/backend/TodoListController`, presenters, `*Route.ts` |
| **Frameworks & Drivers layer aislada** | `4-infrastructure/*`, `5-generic-implementation/*` |
| **Framework independence** | `RouteDescriptor.ts` comentario explícito "nada acá importa un framework" |
| **Screaming architecture / feature folders** | una carpeta por caso de uso, con su Input/Output/UseCase/Interactor/Route juntos |
| **Anti-corruption boundary (persistencia)** | `TodoListRecord` + `TodoListMapper` aíslan el dominio del almacén |
| **Serializable persistence model** | `TodoListRecord`/`TodoItemRecord` — solo strings |

### 2.3 CQRS (parcial) y modelo de lectura

| Concepto | Dónde |
|----------|-------|
| **Separación command / query (carpetas)** | `use-cases/commands/*` vs `use-cases/query/*` |
| **Command methods con efecto + eventos; queries sin mutación** | interactores de comando llaman `persistAndPublish`; `GetTodoList`/`ListTodoLists` no |
| **Read model / DTO de lectura plano** | `TodoItemView` + `toTodoItemView` para cruzar el borde |
| **CQRS completo NO aplicado** | comandos y queries comparten el mismo modelo y almacén (hubo una variante `core-cqrs/` con read model separado, ya eliminada) |

### 2.4 Patrones de diseño

| Patrón | Dónde |
|--------|-------|
| **Repository** | `TodoListRepositoryPort` / `InMemoryTodoListRepository` |
| **Unit of Work** | `UnitOfWorkPort` / `InMemoryUnitOfWork`; `begin/commit/rollback` en `persistAndPublish` |
| **Data Mapper** | `TodoListMapper.toRecord` / `toDomain` (separado del repo) |
| **DTO / Record** | `TodoListRecord`, `TodoItemRecord`, `CreateTodoListRequest`, `AddTodoItemRequest`, todos los `*Input`/`*Output` |
| **Factory Method** | `static create` / `static from` en entidades y VO; `createXxxRoute(useCase)` |
| **Observer / Publish–Subscribe** | `EventBusPort.subscribe/publish`; `InMemoryEventBus`; `main.ts` suscribe loggers |
| **Adapter** | `InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork` adaptan puertos |
| **Facade** | `TodoListController` (agrupa los 9 casos de uso); `createHttpRoutes` |
| **Strategy (función inyectada)** | `RouteDescriptor.buildInput` y `RouteDescriptor.errorStatus` (`defaultErrorStatus`) |
| **Null Object** | `InMemoryUnitOfWork` — `begin/commit/rollback` son no-ops |
| **Assembler / Mapper de salida** | `toTodoItemView` |
| **Registry / metadata table** | `ROUTE_METHOD_PATH` como única fuente método+path |
| **Higher-order function / partial application** | `createXxxRoute(useCase) → RouteDescriptor`; `persistAndPublish(list, repo, bus, uow)` |
| **Template-ish shared step** | `persistAndPublish` reusado por 6 comandos |

### 2.5 SOLID

| Principio | Evidencia |
|-----------|-----------|
| **SRP** | un archivo = una razón de cambio (VO, interactor, mapper, presenter, route) |
| **OCP** | nuevo adapter sin tocar dominio; nueva excepción extiende `DomainException`; `switch` por `code` |
| **LSP** | los `InMemory*` sustituyen a cualquier implementación real; en tests se usan como fakes |
| **ISP** | `EventBusPort`, `UnitOfWorkPort`, `TodoListRepositoryPort` mínimos y separados |
| **DIP** | interactores dependen de `...Port`, nunca de `InMemory*` (salvo tests) |

### 2.6 TypeScript / tipos

| Concepto | Dónde |
|----------|-------|
| **Generics** | `UseCase<TInput,TOutput>`, `OutputBoundary<TOutput>`, `RouteDescriptor<TInput,TOutput>`, `CapturedPresenter<TOutput>` |
| **Nominal typing sobre structural** | `interface AddTodoItemUseCase extends UseCase<...> {}` — nombre legible sin repetir la firma |
| **`as const satisfies T`** | `ROUTE_METHOD_PATH` — chequea forma sin perder los literales |
| **Type-only (borrado en runtime)** | `ApiContractTypes` vs `ApiContract` (objeto real) |
| **Union de literales** | `StatusValue`, `PriorityValue`, `HttpMethod`, `DomainErrorCode` |
| **`readonly` / inmutabilidad** | `readonly value` en VO; `readonly DomainEvent[]` devuelto |
| **`private constructor` + factory** | todos los VO y ambas entidades |
| **Narrowing con `instanceof`** | `defaultErrorStatus` (`RequestValidationError` / `DomainException`) |
| **`structuredClone`** | aislamiento de referencias en el repo in-memory |
| **Parámetros opcionales con default** | `addItem(title, description = '', priority = 'MEDIUM')` |
| **`satisfies Record<string,...>`** | `routeMetadata.ts` |

### 2.7 Testing

| Concepto | Dónde |
|----------|-------|
| **Test runner nativo, sin framework** | `node:test` + `node:assert/strict` en todos los `*.test.ts` |
| **Test doubles = fakes reales** | `InMemory*` como stand-in de infra (no mocks) |
| **Spy / captura del boundary** | `capture()` → `CapturedPresenter` guarda `success`/`error`/`settled` |
| **Arrange–Act–Assert** | estructura de cada test |
| **Seed helpers** | `seedList()` en `AddTodoItemInteractor.test.ts`; `buildRealUseCases()` en `routes.test.ts` |
| **State verification + behavior verification** | se asserta el estado (`repository.findById`) y el efecto (evento publicado) |
| **Test del contrato HTTP sin servidor** | `routes.test.ts` arma requests falsos y recorre el flujo completo + mapeo de status |

### 2.8 Otros principios / prácticas

| Concepto | Dónde |
|----------|-------|
| **Separation of Concerns** | transporte (`http/`) vs aplicación (`use-cases/`) vs dominio (`1-domain/`) vs persistencia (`4-infrastructure/`) |
| **Single Source of Truth** | `ROUTE_METHOD_PATH`, `TodoUseCases` (bundle único de los 9) |
| **DRY con criterio** | colapso de 9 `OutputBoundary`; `persistAndPublish`; `TodoItemView` |
| **Defensive programming en el borde** | `requireString` (400 si falta), `buildPath` lanza si falta un param |
| **Error taxonomy → status mapping desacoplado** | `DomainErrorCode` → `defaultErrorStatus` (única pieza que conoce HTTP) |
| **Transport-agnostic contract** | `RouteDescriptor` describe endpoints como datos; el "binder" (inexistente aún) es lo único atado a un framework |
| **Event-driven side effects** | logging por suscripción al `EventBus`, desacoplado de los interactores |
| **Vertical slicing / package by feature** | dentro de `use-cases/` se agrupa por caso de uso, no por tipo de archivo |
| **Explicit "restore ≠ create"** | documentado en los JSDoc de `TodoList.restore` / `TodoItem.restore` |
| **Convención de capas numeradas** | prefijos `1-` … `5-` imponen orden de dependencia visualmente |

---

## 3. Recomendaciones priorizadas

1. ~~**D1**~~ — hecho: `core copy/` eliminado, `tsc --noEmit -p tsconfig.json` limpio.
2. **D8** — construir el binder Express (Opción 1 sobre `routes.ts`) + cliente tipado: es el gap que impide llamar a esto "completo".
3. **D2** — extraer el `try/catch → presentError` repetido a un helper (`runUseCase(fn, output)`), quitando ~9 bloques idénticos.
4. **D3** — dejar anotado (o resolver con outbox) que `persistAndPublish` publica fuera de la transacción antes de ir a una BD real.
5. **D7** — inyectar `clock`/`idGenerator` si se quieren tests deterministas de timestamps e ids.
6. **D5/D6** — al agregar más casos de uso, evaluar un read model plano para queries y un `withUnitOfWork` para unificar `DeleteTodoList` con el resto.
