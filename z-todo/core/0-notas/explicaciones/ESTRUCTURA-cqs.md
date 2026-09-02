# Estructura del proyecto — z-todo (versión CQS)

Ejemplo de **DDD + Clean/Hexagonal Architecture** implementado en TypeScript puro (sin framework), organizando un dominio de "listas de tareas" en capas numeradas por orden de dependencia. Vive en `core/`.

`core/` es **CQS**: comandos y queries separados por carpeta/interface, pero ambos leen del mismo modelo (`TodoList`, el aggregate de escritura). Sin read model propio.

Hubo una variante **CQRS** paralela (`core-cqrs/`) — modelo de lectura separado (`TodoListReadModel`), sincronizado por un proyector que escuchaba domain events — que se usó para comparar los dos enfoques. Se eliminó del repo en la limpieza de 2026-09-02; su dominio y sus comandos eran idénticos a los de `core/`, la diferencia estaba acotada a 2 casos de uso (`get-todo-list`, `list-todo-lists`) y su infraestructura de lectura.

`core/` tiene un frame de entrega conectado al dominio/aplicación: `5-generic-implementation/` (consola). Hubo un segundo frame, `5-angular/` (SPA real), pero se eliminó.

## Regla de dependencia

```
1-domain                          ← no depende de nada
2-application                      ← depende solo de 1-domain
2-application/use-cases-ports/backend     ← puerto de entrada: TodoListControllerPort + dtos/, fachada que agrupa los 9 casos de uso
2-application/use-cases-ports/http        ← puerto de entrada: describe cómo se exponen los 9 casos de uso vía HTTP, agnóstico a framework
3-adapters/backend                ← implementa TodoListControllerPort con un Controller real
4-infrastructure                   ← implementa los ports de SALIDA de 2-application (repo, event bus, UoW)
5-generic-implementation  ← un frame: composition root + presenters de consola
```

Las flechas de dependencia siempre apuntan hacia adentro (hacia el dominio). El dominio no sabe que existen la aplicación, la infraestructura ni la UI. Este es el principio central de Clean Architecture (Robert C. Martin): las reglas de negocio no dependen de detalles técnicos.

`4-infrastructure` y `3-adapters/backend` son distintas direcciones dentro de la capa de adapters: `4-infrastructure` implementa lo que la aplicación **pide** hacia afuera (ports de salida — *driven*); `3-adapters/backend` es consumido por algo de afuera que **invoca** la aplicación (port de entrada — *driving*). `2-application/use-cases-ports/backend` y `2-application/use-cases-ports/http` son puertos, no adapters — viven junto a `2-application/ports/out/` (mismo rol que `TodoListRepositoryPort` etc, pero del lado entrante): describen el contrato sin implementarlo. `use-cases-ports/backend` sí tiene adapter real (`3-adapters/backend/TodoListController.ts`); `use-cases-ports/http` todavía no tiene ninguno. Ninguno de estos es un frame completo — no tienen composition root, no corren solos. El frame real (`5-generic-implementation`) los importa y los completa. Detalle a fondo, con analogías, en `arquitectura.md`.

---

## `1-domain/` — Dominio

El núcleo. Reglas de negocio puras, sin async, sin I/O, sin imports externos (salvo `crypto.randomUUID` para generar ids).

### `entities/`
- **`TodoList.ts`** — el **aggregate root**. Único punto de entrada para mutar una lista y sus items. Mantiene un buffer interno de `DomainEvent[]` que se llena en cada operación relevante (`addDomainEvent`) y se vacía externamente con `clearEvents()`.
  - `create(name)` — factory que valida el nombre vía `Title` y emite `TodoListCreated`.
  - `restore({ id, name, items })` — reconstrucción desde storage (recibe los `TodoItem` ya rehidratados), sin emitir eventos.
  - `addItem`, `completeItem`, `renameItem`, `changeItemDescription`, `changeItemPriority` — cada uno delega en el `TodoItem` correspondiente y emite su evento.
  - Regla de negocio hardcodeada: máximo 10 items por lista.
- **`TodoItem.ts`** — entidad hija, no es aggregate root (no se accede directo, solo a través de `TodoList`). Encapsula sus 4 value objects (`Title`, `Description`, `Status`, `Priority`) y expone comportamientos (`complete`, `rename`, `changeDescription`, `changePriority`).

### `value-objects/`
Objetos inmutables con factory estático `create`/`from`, constructor privado, y validación en el borde:
- **`TodoListId.ts`** / **`TodoItemId.ts`** — wrapper de UUID. `create()` genera uno nuevo, `from(value)` reconstruye validando no-vacío.
- **`Title.ts`** — entre 3 y 100 caracteres. Usado tanto por `TodoItem` como por `TodoList` (nombre de lista).
- **`Description.ts`** — hasta 500 caracteres, default `''`.
- **`Status.ts`** — `'TODO' | 'COMPLETED'`, con getter `isCompleted`.
- **`Priority.ts`** — `'LOW' | 'MEDIUM' | 'HIGH'`, `from(string)` lanza si no matchea.

### `events/`
Cada evento implementa `DomainEvent` (`eventName: string`, `occurredOn: Date`) y carga los datos mínimos del cambio:

| Evento | Emitido por |
|---|---|
| `TodoListCreated` | `TodoList.create` |
| `TodoListDeleted` | `DeleteTodoListInteractor` (no por el aggregate — ver nota abajo) |
| `TodoItemAdded` | `TodoList.addItem` (lleva `title`, `description` y `priority` — el evento carga el item completo, no solo el título) |
| `TodoItemCompleted` | `TodoList.completeItem` |
| `TodoItemRenamed` | `TodoList.renameItem` |
| `TodoItemDescriptionChanged` | `TodoList.changeItemDescription` |
| `TodoItemPriorityChanged` | `TodoList.changeItemPriority` |

> **Nota**: `TodoListDeleted` es el único evento que no nace del buffer interno del aggregate. Borrar una lista no es "mutarla", es removerla del repositorio — el aggregate no participa de esa operación, así que el interactor construye el evento a mano después de un `delete` exitoso.

En esta versión (CQS) los eventos se publican y quedan disponibles para quien quiera suscribirse (`main.ts` solo los loguea), pero **nada los consume para mantener una proyección**. La variante CQRS que hubo (`core-cqrs/`, ya eliminada) sí tenía un `TodoListProjector` que los escuchaba para actualizar un read model.

### `exceptions/`
- **`DomainException.ts`** — clase base, extiende `Error`, fija `this.name` al nombre de la subclase.
- **`TodoListNotFoundException.ts`** / **`TodoItemNotFoundException.ts`** — excepciones tipadas para los 2 casos de "no encontrado". Permiten a un presenter real (`instanceof`) diferenciar 404 de otros errores — `2-application/use-cases-ports/http/httpErrorStatus.ts` ya lo hace así.

### `services/`
- **`TodoListDomainService.ts`** — lógica que no pertenece a una sola entidad: `calculateCompletionPercentage(items)` y `isFullyCompleted(items)`. Opera sobre cualquier `{ status: string }[]`, no sobre `TodoList` directamente — por eso a `TodoItem[]` (que tiene un getter `status`) se le puede pasar tal cual. Usado por `GetTodoListInteractor` y `ListTodoListsInteractor`, que lo llaman **en el momento de leer**, sobre el aggregate recién reconstruido.

---

## `2-application/` — Aplicación

Orquesta el dominio. Define **qué** puede hacer el sistema (casos de uso) y **qué necesita del exterior** (ports), sin saber cómo se implementa nada de eso — tampoco sabe que existe HTTP, consola, ni Angular.

### `ports/out/` — Interfaces de salida (lo que la aplicación necesita, implementado en infraestructura)
- **`TodoListRepositoryPort.ts`** — `save`, `findById`, `findAll`, `delete`. El único puerto de persistencia — lo usan **tanto comandos como queries**, porque en CQS no hay un modelo de lectura separado.
- **`EventBusPort.ts`** — `publish(events): Promise<void>`, `subscribe(eventName, handler)`.
- **`UnitOfWorkPort.ts`** — `begin`, `commit`, `rollback`. Abstrae la noción de transacción.

### `use-cases/` — Un caso de uso = 5 archivos, siempre el mismo patrón (Clean Architecture "Input/Output Boundary")

```
<nombre>/
  <Nombre>Input.ts            interface — qué datos entran
  <Nombre>Output.ts           interface — qué datos salen en éxito
  <Nombre>OutputBoundary.ts   interface — presentSuccess(output) / presentError(error)
  <Nombre>UseCase.ts          interface — execute(input, output): Promise<void>
  <Nombre>Interactor.ts       clase — implementa UseCase, la lógica real
  <Nombre>Interactor.test.ts  tests contra fakes in-memory
```

El interactor nunca hace `return` — llama a `output.presentSuccess(...)` o `output.presentError(...)`. Esto desacopla el caso de uso de cómo se presenta el resultado (consola, HTTP, lo que sea).

- **`use-cases/TodoUseCases.ts`** — único archivo dentro de `use-cases/` que conoce a sus 9 hermanos: agrupa los 9 `*UseCase` en una sola interfaz (`{createTodoList, addTodoItem, ...}`). Fuente de verdad compartida entre `3-adapters/backend/TodoListController.ts` y `2-application/use-cases-ports/http/routes.ts` — antes cada uno tenía su propia copia de esta misma lista. Vive acá (y no en `3-adapters/*`) porque describe la superficie pública de la aplicación misma, no cómo se la invoca desde afuera.

**Comandos** (`use-cases/commands/`) — mutan estado:

| Caso de uso | Qué hace |
|---|---|
| `create-todo-list` | Crea una lista nueva |
| `add-todo-item` | Agrega un item a una lista existente |
| `complete-todo-item` | Marca un item como completado |
| `rename-todo-item` | Cambia el título de un item |
| `change-todo-item-description` | Cambia la descripción de un item |
| `change-todo-item-priority` | Cambia la prioridad de un item |
| `delete-todo-list` | Borra una lista |

**Queries** (`use-cases/query/`) — separadas de los comandos solo por **carpeta e interface**, no por modelo de datos: reciben el mismo `TodoListRepositoryPort` que usan los comandos, reconstruyen el aggregate completo (`TodoList`, con todos sus `TodoItem`) y lo mapean a DTO ahí mismo:

| Caso de uso | Qué hace |
|---|---|
| `get-todo-list` | Trae una lista por id vía `repository.findById`, calcula `completionPercentage`/`isFullyCompleted` con `TodoListDomainService` en el momento |
| `list-todo-lists` | Trae todas las listas vía `repository.findAll`, mismo cálculo por cada una |

Esto es **CQS** (Command Query Separation): separación de responsabilidad a nivel de método/carpeta, pero un solo modelo por debajo. No es CQRS — para eso hace falta un modelo de lectura genuinamente distinto (lo que tenía la variante `core-cqrs/`, ya eliminada).

### `shared/` — código compartido entre interactores (no es un caso de uso en sí)
- **`persistAndPublish.ts`** — extrae el boilerplate repetido en los 6 comandos que mutan un aggregate: `unitOfWork.begin()` → `repository.save(list)` → `unitOfWork.commit()` (o `rollback()` + re-throw si falla) → `await eventBus.publish(list.domainEvents)` → `list.clearEvents()`. Cada interactor lo llama en una línea después de mutar el aggregate.
- **`testing/capturePresenter.ts`** — fábrica de un `OutputBoundary` falso para tests. `capture<TOutput>()` devuelve `{ presenter, state }`: `presenter` se le pasa al interactor (cumple la interface por duck typing), `state` es donde queda guardado el resultado para hacer `assert` después. Nunca se importa desde código de producción.

---

## `4-infrastructure/` — Infraestructura (adapters de salida)

Implementaciones concretas de los ports de salida. Todas en memoria (`Map`/`Array`) porque es un ejemplo — en un sistema real acá irían Postgres, Redis, RabbitMQ, etc.

- **`persistence/InMemoryTodoListRepository.ts`** — implementa `TodoListRepositoryPort` con un `Map<string, TodoList>`. Único store — lo comparten comandos y queries.
- **`messaging/InMemoryEventBus.ts`** — implementa `EventBusPort` con un `Map<eventName, handler[]>`. `publish` es `async` y espera (`await`) cada handler antes de pasar al siguiente.
- **`unit-of-work/InMemoryUnitOfWork.ts`** — implementa `UnitOfWorkPort` con métodos no-op (`begin`/`commit`/`rollback` no hacen nada real, porque no hay una BD transaccional detrás).

---

## `2-application/use-cases-ports/backend/` — Puerto de entrada del backend (contrato, sin transporte)

No es un frame ni un adapter — es el puerto, simétrico a `2-application/ports/out/`. Describe la fachada que agrupa los 9 casos de uso como métodos, sin implementarla.

- **`TodoListControllerPort.ts`** — la interfaz: las 9 firmas, sin lógica. Mismo patrón exacto que `TodoListRepositoryPort` — acá aplicado a un port de **entrada** en vez de uno de salida, y más grueso (agrupa 9 firmas en una fachada en vez de un port por caso de uso).
- **`dtos/`** — `CreateTodoListRequest.ts` (`{name}`) y `AddTodoItemRequest.ts` (`{title, description?, priority?}`, sin `listId` — ese llega aparte, como parámetro de ruta). Viven junto al port porque son parte de su firma pública (`create(req: CreateTodoListRequest, ...)`), no del adapter que lo implementa.

## `3-adapters/backend/` — Implementación real del puerto de backend

Sí tiene un consumidor real y funcionando (`5-generic-implementation/main.ts`, in-process) — a diferencia de `2-application/use-cases-ports/http/`, que todavía no tiene ningún binder.

- **`TodoListController.ts`** — `implements TodoListControllerPort`. Un método por caso de uso. Cada método recibe **el presenter como parámetro** (`async addItem(listId, req, output)`), no lo instancia internamente — quien lo llama decide qué `OutputBoundary` usar. Antes instanciaba sus propios presenters de consola adentro; se desacopló para poder reusarlo desde cualquier frame. Al tener la interfaz separada (en `use-cases-ports/backend/`), cualquier otra implementación (un fake para tests, una versión que loguee cada llamada) puede sustituirlo sin que quien lo consume se entere. `create`/`addItem` arman el `Input` de aplicación completo a partir del DTO (`CreateTodoListRequest`/`AddTodoItemRequest`) + los params sueltos, aplicando los mismos defaults que el dominio (`description: ''`, `priority: 'MEDIUM'`). El resto de los 7 métodos toman el `Input` de aplicación directo, sin DTO propio.

---

## `2-application/use-cases-ports/http/` — Puerto de entrada HTTP agnóstico a framework

No es un adapter — es el puerto (contrato), simétrico a `2-application/ports/out/`. Tampoco es un frame — sin binder, sin servidor, sin `main.ts`. Describe **qué** endpoint existe y **cómo** se arma su Input, dejando el "cómo se sirve en Express/Fastify/Next.js/lo que sea" totalmente afuera (a propósito) — eso lo haría un adapter de entrada real (un binder concreto), que todavía no existe.

- **`RouteDescriptor.ts`** — los tipos compartidos: `HttpMethod`, `HttpRequestData` (`{params, query, body}`), `OutputBoundaryLike<TOutput>`, `UseCaseLike<TInput,TOutput>`, y `RouteDescriptor<TInput,TOutput>` (`{method, path, buildInput, useCase, successStatus, errorStatus}`). Es la única "interfaz" real de esta carpeta — cada ruta concreta es una implementación de esta forma, no necesita su propia sub-interfaz.
- **`routeMetadata.ts`** — `ROUTE_METHOD_PATH`, único lugar con los 9 pares `{method, path}`. Consumido tanto por las rutas reales como por `apiContract.ts` — nunca duplicado.
- **`httpErrorStatus.ts`** — `defaultErrorStatus(error)`: `TodoListNotFoundException`/`TodoItemNotFoundException` → 404, el resto → 400.
- **`httpBody.ts`** — `bodyAsRecord`/`stringField`, helpers de parseo defensivo (fallback silencioso, no valida esquema) usados por los `buildInput` que leen el body.
- **Una carpeta por caso de uso** (`create-todo-list/`, `add-todo-item/`, etc — mismo nombre kebab-case que en `2-application/use-cases/`) — cada una con un archivo `<Nombre>Route.ts` que exporta `createXRoute(useCase): RouteDescriptor<XInput, XOutput>`. Los genéricos de `RouteDescriptor<TInput,TOutput>` quedan fijados en la firma de esa función — el compilador obliga a que el `buildInput` de esa ruta y el `useCase` que recibe estén de acuerdo en qué tipo de dato esperan.
- **`routes.ts`** — agregador puro: `createHttpRoutes(useCases: TodoUseCases): RouteDescriptor[]` importa las 9 factories y las junta. Cero lógica de mapeo acá.
- **`apiContract.ts`** — el contrato para un **frontend** (no un servidor): `ApiContractTypes` (mapa solo-de-tipos, `{input, output}` por caso de uso, se borra en runtime), `ApiContract` (objeto runtime = literalmente `ROUTE_METHOD_PATH`, no una copia), y `buildPath(path, params)` para sustituir `:listId` por valores reales. Ningún `fetch` acá — eso lo hace quien consuma el contrato.
- **`httpExample.ts`** — ejemplo básico de consumo: arma cada llamada (`ApiContract` + `buildPath`) y hace un `fetch` real contra un backend que **no existe a propósito** — cada llamada falla con "esperado, no hay backend corriendo". Muestra la forma del consumo sin necesitar un servidor de verdad; el día que exista un binder sirviendo estas rutas, este mismo código funciona sin cambiar una línea. Corre con `pnpm exec tsx core/2-application/use-cases-ports/http/httpExample.ts`.

---

## `5-generic-implementation/` — Frame de consola

(Antes se llamaba `4-nest-implementation`, pero no usa NestJS — cero decorators, cero DI container, cero HTTP real. El nombre actual es honesto sobre eso.)

Después de extraer `TodoListController` (hoy en `3-adapters/backend/`) y su puerto/DTOs (hoy en `2-application/use-cases-ports/backend/`), esta carpeta quedó reducida a lo que realmente es: un frame completo y corrible, nada más.

### `api/presenters/`
Un presenter por caso de uso, implementa el `OutputBoundary` correspondiente. Todos hacen `console.log`. `CreateTodoListPresenter` además guarda `result` como campo público, porque `main.ts` necesita leer el `id` generado para encadenar el resto del flujo.

### `main.ts`
El **composition root**: arma la cadena de dependencias a mano (`repository` → `eventBus` → `unitOfWork` → los 9 interactores → `TodoUseCases` → `TodoListController` de `3-adapters/backend`), se suscribe a los 7 tipos de evento para loguearlos, y corre un flujo de demostración real: crea una lista, agrega 2 items, completa uno, renombra/cambia descripción/cambia prioridad del otro, consulta la lista, lista todas las listas, borra la lista, y vuelve a listar para confirmar que quedó vacía. Cada llamada al controller pasa su presenter explícito (`controller.addItem(listId, req, new AddTodoItemPresenter())`).

Se ejecuta con:
```bash
pnpm exec tsx core/5-generic-implementation/main.ts
```

---

## Tests

`node:test` nativo (cero frameworks de testing como dependencia) + `tsx` como loader de TypeScript. **35 tests**: 24 de los 9 interactores (camino feliz, cada excepción de dominio, publicación de cada evento, algún caso de fallo de infraestructura con rollback) + 3 de `2-application/use-cases-ports/http/routes.test.ts` (simulan un flujo HTTP completo sin ningún servidor, llamando `buildInput`/`useCase.execute` a mano) + 8 de `2-application/use-cases-ports/http/apiContract.test.ts` (coherencia del contrato contra las rutas reales, y `buildPath`).

```bash
pnpm test
```

Los fakes usados en los tests **son las implementaciones reales de infraestructura** (`InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`) — no hace falta mockear nada porque ya son livianas y deterministas.

---

## Archivos sueltos en la raíz

- **`core/0-notas/`** — la documentación del proyecto: `handoff.md` (estado actual + changelog) y `explicaciones/` con `arquitectura.md` (Clean/Hexagonal con analogías), este archivo, `flujo-caso-de-uso.md` (trace de un caso de uso, cliente y servidor), `domio/documentacion del modulo.md` (DDD del módulo), `evaluacion-conceptos.md`, `guidelines.md`, `puertos/use-cases-ports-http.md`.
- **`package.json`** — `"test"` corre los tests de `core/`. `main: "index.js"` sigue apuntando a un archivo que no existe (nunca se compiló a `dist/`). Pendiente, no resuelto.

---

## Gaps conocidos, sin resolver

1. **`main: "index.js"`** en `package.json` no existe (no hay build a `dist/` configurado).
2. **`2-application/use-cases-ports/http` no tiene binder real del lado servidor.** Existen los `RouteDescriptor`, el contrato, y hasta un ejemplo de consumo del lado cliente (`httpExample.ts`) — pero ningún framework HTTP concreto (Express/Fastify/Next.js) sirve estas rutas todavía. Sería el próximo frame, tipo `5-express-implementation/`, que importaría `2-application/use-cases-ports/http` igual que `5-generic-implementation` importa `3-adapters/backend`.
3. **Las queries reconstruyen el aggregate completo para leer.** `GetTodoListInteractor`/`ListTodoListsInteractor` pasan por `TodoListId.from`, `TodoListMapper.toDomain` (que usa `TodoList.restore`/`TodoItem.restore`) y recorren cada `TodoItem` para mapear a DTO — trabajo de más comparado con leer un dato ya aplanado. Para esta escala no importa; si las lecturas crecieran mucho más que las escrituras, ahí es donde tendría sentido un modelo de lectura separado (CQRS).
4. **`buildInput` no valida esquema en runtime.** `stringField`/`bodyAsRecord` (`2-application/use-cases-ports/http/httpBody.ts`) hacen fallback silencioso ante datos faltantes o mal tipados — no rechazan un payload malformado. El tipado de TypeScript (`RouteDescriptor<TInput,TOutput>`) protege que el código esté bien conectado en compile-time, no que el request en runtime tenga la forma correcta.
