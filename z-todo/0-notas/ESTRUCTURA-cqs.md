# Estructura del proyecto — z-todo (versión CQS)

Ejemplo de **DDD + Clean/Hexagonal Architecture** implementado en TypeScript puro (sin framework), organizando un dominio de "listas de tareas" en capas numeradas por orden de dependencia. Vive en `core/`.

Este proyecto tiene **dos versiones en paralelo**, para comparar:
- **`core/`** (este documento) — CQS: comandos y queries separados por carpeta/interface, pero ambos leen del mismo modelo (`TodoList`, el aggregate de escritura). Sin read model propio.
- **`core-cqrs/`** — CQRS real: modelo de lectura separado (`TodoListReadModel`), sincronizado por un proyector que escucha domain events. Documentado en `ESTRUCTURA-cqrs.md` y `CAMBIOS-CQRS.md`.

La diferencia entre ambas está acotada a 2 casos de uso (`get-todo-list`, `list-todo-lists`) y su infraestructura — todo lo demás (dominio, comandos, tests, `UnitOfWork`) es idéntico en las dos carpetas. `core-cqrs/` quedó **congelada** en el momento en que se armó el read model — no recibe los cambios posteriores descritos acá (interfaz de backend desacoplada, interfaz HTTP) salvo que se porten a mano.

`core/` tiene además **dos frames de entrega distintos** conectados al mismo dominio/aplicación: `4-generic-implementation/` (consola) y `4-angular/` (SPA real, ver `angular-implementation.md`).

## Regla de dependencia

```
1-domain                  ← no depende de nada
2-application             ← depende solo de 1-domain
3-infrastructure          ← implementa los ports de SALIDA de 2-application (repo, event bus, UoW)
3-backend-interface       ← agnóstico a transporte: agrupa los 9 casos de uso, expone un Controller
3-http-interface          ← agnóstico a framework HTTP: mapea los 9 casos de uso a rutas + contrato
4-generic-implementation  ← un frame: composition root + presenters de consola
4-angular                 ← otro frame: SPA real, wiring propio vía Angular DI
```

Las flechas de dependencia siempre apuntan hacia adentro (hacia el dominio). El dominio no sabe que existen la aplicación, la infraestructura ni la UI. Este es el principio central de Clean Architecture (Robert C. Martin): las reglas de negocio no dependen de detalles técnicos.

`3-infrastructure` y `3-backend-interface`/`3-http-interface` son el mismo tier, dos direcciones distintas: `3-infrastructure` implementa lo que la aplicación **pide** hacia afuera (ports de salida — *driven*); `3-backend-interface`/`3-http-interface` son consumidos por algo de afuera que **invoca** la aplicación (ports de entrada — *driving*). Ninguno de los dos es un frame completo — no tienen composition root, no corren solos. Los frames reales (`4-generic-implementation`, `4-angular`) los importan y los completan. Detalle a fondo, con analogías, en `arquitectura.md`.

---

## `1-domain/` — Dominio

El núcleo. Reglas de negocio puras, sin async, sin I/O, sin imports externos (salvo `crypto.randomUUID` para generar ids).

### `entities/`
- **`TodoList.ts`** — el **aggregate root**. Único punto de entrada para mutar una lista y sus items. Mantiene un buffer interno de `DomainEvent[]` que se llena en cada operación relevante (`addDomainEvent`) y se vacía externamente con `clearEvents()`.
  - `create(name)` — factory que valida el nombre vía `Title` y emite `TodoListCreated`.
  - `fromPersistence(id, name, items)` — reconstrucción desde storage, sin emitir eventos.
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

En esta versión (CQS) los eventos se publican y quedan disponibles para quien quiera suscribirse (`main.ts` solo los loguea), pero **nada los consume para mantener una proyección** — a diferencia de `core-cqrs/`, donde un `TodoListProjector` los escucha para actualizar un read model.

### `exceptions/`
- **`DomainException.ts`** — clase base, extiende `Error`, fija `this.name` al nombre de la subclase.
- **`TodoListNotFoundException.ts`** / **`TodoItemNotFoundException.ts`** — excepciones tipadas para los 2 casos de "no encontrado". Permiten a un presenter real (`instanceof`) diferenciar 404 de otros errores — `3-http-interface/httpErrorStatus.ts` ya lo hace así.

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

- **`use-cases/TodoUseCases.ts`** — único archivo dentro de `use-cases/` que conoce a sus 9 hermanos: agrupa los 9 `*UseCase` en una sola interfaz (`{createTodoList, addTodoItem, ...}`). Fuente de verdad compartida entre `3-backend-interface/TodoListController.ts` y `3-http-interface/routes.ts` — antes cada uno tenía su propia copia de esta misma lista. Vive acá (y no en `3-*`) porque describe la superficie pública de la aplicación misma, no cómo se la invoca desde afuera.

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

Esto es **CQS** (Command Query Separation): separación de responsabilidad a nivel de método/carpeta, pero un solo modelo por debajo. No es CQRS — para eso hace falta un modelo de lectura genuinamente distinto, que es lo que tiene `core-cqrs/`.

### `shared/` — código compartido entre interactores (no es un caso de uso en sí)
- **`persistAndPublish.ts`** — extrae el boilerplate repetido en los 6 comandos que mutan un aggregate: `unitOfWork.begin()` → `repository.save(list)` → `unitOfWork.commit()` (o `rollback()` + re-throw si falla) → `await eventBus.publish(list.domainEvents)` → `list.clearEvents()`. Cada interactor lo llama en una línea después de mutar el aggregate.
- **`testing/capturePresenter.ts`** — fábrica de un `OutputBoundary` falso para tests. `capture<TOutput>()` devuelve `{ presenter, state }`: `presenter` se le pasa al interactor (cumple la interface por duck typing), `state` es donde queda guardado el resultado para hacer `assert` después. Nunca se importa desde código de producción.

---

## `3-infrastructure/` — Infraestructura (adapters de salida)

Implementaciones concretas de los ports de salida. Todas en memoria (`Map`/`Array`) porque es un ejemplo — en un sistema real acá irían Postgres, Redis, RabbitMQ, etc.

- **`persistence/InMemoryTodoListRepository.ts`** — implementa `TodoListRepositoryPort` con un `Map<string, TodoList>`. Único store — lo comparten comandos y queries.
- **`messaging/InMemoryEventBus.ts`** — implementa `EventBusPort` con un `Map<eventName, handler[]>`. `publish` es `async` y espera (`await`) cada handler antes de pasar al siguiente.
- **`unit-of-work/InMemoryUnitOfWork.ts`** — implementa `UnitOfWorkPort` con métodos no-op (`begin`/`commit`/`rollback` no hacen nada real, porque no hay una BD transaccional detrás).

---

## `3-backend-interface/` — Interfaz de backend agnóstica (adapter de entrada, sin transporte)

No es un frame — nadie lo corre solo, no tiene composition root. Es la fachada que agrupa los 9 casos de uso y los expone como métodos, para que cualquier frame (consola, un binder HTTP, un test) la use sin acoplarse a nada concreto.

- **`TodoListController.ts`** — un método por caso de uso. Cada método recibe **el presenter como parámetro** (`async addItem(listId, req, output)`), no lo instancia internamente — quien lo llama decide qué `OutputBoundary` usar. Antes instanciaba sus propios presenters de consola adentro; se desacopló para poder reusarlo desde cualquier frame.
- **`dtos/`** — `CreateTodoListRequest.ts` (`{name}`) y `AddTodoItemRequest.ts` (`{title, description?, priority?}`, sin `listId` — ese llega aparte, como parámetro de ruta). Los dos están conectados: `TodoListController.create`/`addItem` arman el `Input` de aplicación completo a partir del DTO + los params sueltos, aplicando los mismos defaults que el dominio (`description: ''`, `priority: 'MEDIUM'`). El resto de los 7 métodos del controller siguen tomando el `Input` de aplicación directo, sin DTO propio.

---

## `3-http-interface/` — Interfaz HTTP agnóstica a framework (adapter de entrada + contrato)

Tampoco es un frame — sin binder, sin servidor, sin `main.ts`. Describe **qué** endpoint existe y **cómo** se arma su Input, dejando el "cómo se sirve en Express/Fastify/Next.js/lo que sea" totalmente afuera (a propósito).

- **`RouteDescriptor.ts`** — los tipos compartidos: `HttpMethod`, `HttpRequestData` (`{params, query, body}`), `OutputBoundaryLike<TOutput>`, `UseCaseLike<TInput,TOutput>`, y `RouteDescriptor<TInput,TOutput>` (`{method, path, buildInput, useCase, successStatus, errorStatus}`). Es la única "interfaz" real de esta carpeta — cada ruta concreta es una implementación de esta forma, no necesita su propia sub-interfaz.
- **`routeMetadata.ts`** — `ROUTE_METHOD_PATH`, único lugar con los 9 pares `{method, path}`. Consumido tanto por las rutas reales como por `apiContract.ts` — nunca duplicado.
- **`httpErrorStatus.ts`** — `defaultErrorStatus(error)`: `TodoListNotFoundException`/`TodoItemNotFoundException` → 404, el resto → 400.
- **`httpBody.ts`** — `bodyAsRecord`/`stringField`, helpers de parseo defensivo (fallback silencioso, no valida esquema) usados por los `buildInput` que leen el body.
- **Una carpeta por caso de uso** (`create-todo-list/`, `add-todo-item/`, etc — mismo nombre kebab-case que en `2-application/use-cases/`) — cada una con un archivo `<Nombre>Route.ts` que exporta `createXRoute(useCase): RouteDescriptor<XInput, XOutput>`. Los genéricos de `RouteDescriptor<TInput,TOutput>` quedan fijados en la firma de esa función — el compilador obliga a que el `buildInput` de esa ruta y el `useCase` que recibe estén de acuerdo en qué tipo de dato esperan.
- **`routes.ts`** — agregador puro: `createHttpRoutes(useCases: TodoUseCases): RouteDescriptor[]` importa las 9 factories y las junta. Cero lógica de mapeo acá.
- **`apiContract.ts`** — el contrato para un **frontend** (no un servidor): `ApiContractTypes` (mapa solo-de-tipos, `{input, output}` por caso de uso, se borra en runtime), `ApiContract` (objeto runtime = literalmente `ROUTE_METHOD_PATH`, no una copia), y `buildPath(path, params)` para sustituir `:listId` por valores reales. Ningún `fetch` acá — eso lo hace quien consuma el contrato.
- **`httpExample.ts`** — ejemplo básico de consumo: arma cada llamada (`ApiContract` + `buildPath`) y hace un `fetch` real contra un backend que **no existe a propósito** — cada llamada falla con "esperado, no hay backend corriendo". Muestra la forma del consumo sin necesitar un servidor de verdad; el día que exista un binder sirviendo estas rutas, este mismo código funciona sin cambiar una línea. Corre con `pnpm exec tsx core/3-http-interface/httpExample.ts`.

---

## `4-generic-implementation/` — Frame de consola

(Antes se llamaba `4-nest-implementation`, pero no usa NestJS — cero decorators, cero DI container, cero HTTP real. El nombre actual es honesto sobre eso.)

Después de extraer `TodoListController`/DTOs a `3-backend-interface/`, esta carpeta quedó reducida a lo que realmente es: un frame completo y corrible, nada más.

### `api/presenters/`
Un presenter por caso de uso, implementa el `OutputBoundary` correspondiente. Todos hacen `console.log`. `CreateTodoListPresenter` además guarda `result` como campo público, porque `main.ts` necesita leer el `id` generado para encadenar el resto del flujo.

### `main.ts`
El **composition root**: arma la cadena de dependencias a mano (`repository` → `eventBus` → `unitOfWork` → los 9 interactores → `TodoUseCases` → `TodoListController` de `3-backend-interface`), se suscribe a los 7 tipos de evento para loguearlos, y corre un flujo de demostración real: crea una lista, agrega 2 items, completa uno, renombra/cambia descripción/cambia prioridad del otro, consulta la lista, lista todas las listas, borra la lista, y vuelve a listar para confirmar que quedó vacía. Cada llamada al controller pasa su presenter explícito (`controller.addItem(listId, req, new AddTodoItemPresenter())`).

Se ejecuta con:
```bash
pnpm exec tsx core/4-generic-implementation/main.ts
```

---

## `4-angular/` — Frame de SPA real

Documentado a fondo en `angular-implementation.md`. Conecta `1-domain`/`2-application`/`3-infrastructure` directo (vía alias de `tsconfig.json`, no una copia) usando Angular DI en vez de `new` a mano — pero **no** pasa por `3-backend-interface` ni `3-http-interface`; tiene su propio `TodoFacadeService` + `AngularPresenter` genérico, corriendo todo en memoria del lado del browser.

```bash
pnpm start:angular   # dev server
pnpm build:angular   # build de producción
```

---

## Tests

`node:test` nativo (cero frameworks de testing como dependencia) + `tsx` como loader de TypeScript. **35 tests**: 24 de los 9 interactores (camino feliz, cada excepción de dominio, publicación de cada evento, algún caso de fallo de infraestructura con rollback) + 3 de `3-http-interface/routes.test.ts` (simulan un flujo HTTP completo sin ningún servidor, llamando `buildInput`/`useCase.execute` a mano) + 8 de `3-http-interface/apiContract.test.ts` (coherencia del contrato contra las rutas reales, y `buildPath`).

```bash
pnpm test
```

Los fakes usados en los tests **son las implementaciones reales de infraestructura** (`InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`) — no hace falta mockear nada porque ya son livianas y deterministas.

---

## Archivos sueltos en la raíz

- **`0-notas/`** — toda la documentación de la sesión: este archivo, `ESTRUCTURA-cqrs.md` (gemelo para `core-cqrs/`), `arquitectura.md` (Clean/Hexagonal explicado con analogías), `angular-implementation.md` (cómo se conecta `4-angular/`), `CAMBIOS-CQRS.md`, `CONVERSACION.md`, `doc.md` (DDD del módulo), `notas.md`.
- **`package.json`** — `"test"` corre los tests de `core/` (CQS), `"test:cqrs"` los de `core-cqrs/`, `"start:angular"`/`"build:angular"` delegan a `core/4-angular` vía `pnpm --filter`. `main: "index.js"` sigue apuntando a un archivo que no existe (nunca se compiló a `dist/`). Pendiente, no resuelto.

---

## Gaps conocidos, sin resolver

1. **`main: "index.js"`** en `package.json` no existe (no hay build a `dist/` configurado).
2. **`3-http-interface` no tiene binder real del lado servidor.** Existen los `RouteDescriptor`, el contrato, y hasta un ejemplo de consumo del lado cliente (`httpExample.ts`) — pero ningún framework HTTP concreto (Express/Fastify/Next.js) sirve estas rutas todavía. Sería el próximo frame, tipo `4-express-implementation/`, que importaría `3-http-interface` igual que `4-generic-implementation` importa `3-backend-interface`.
3. **Las queries reconstruyen el aggregate completo para leer.** `GetTodoListInteractor`/`ListTodoListsInteractor` pasan por `TodoListId.from`, `TodoList.fromPersistence` (implícito en el repositorio) y recorren cada `TodoItem` para mapear a DTO — trabajo de más comparado con leer un dato ya aplanado. Para esta escala no importa; si las lecturas crecieran mucho más que las escrituras, ahí es donde tendría sentido migrar a `core-cqrs/`.
4. **`buildInput` no valida esquema en runtime.** `stringField`/`bodyAsRecord` (`3-http-interface/httpBody.ts`) hacen fallback silencioso ante datos faltantes o mal tipados — no rechazan un payload malformado. El tipado de TypeScript (`RouteDescriptor<TInput,TOutput>`) protege que el código esté bien conectado en compile-time, no que el request en runtime tenga la forma correcta.
