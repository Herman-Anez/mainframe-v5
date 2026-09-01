# Estructura del proyecto — z-todo (versión CQRS)

Ejemplo de **DDD + Clean/Hexagonal Architecture + CQRS** implementado en TypeScript puro (sin framework), organizando un dominio de "listas de tareas" en 4 capas concéntricas numeradas por orden de dependencia. Vive en `core-cqrs/`.

El CQRS es real, no solo naming: hay un modelo de **escritura** (`TodoList`, el aggregate, con todas sus reglas de negocio) y un modelo de **lectura** separado (`TodoListReadModel`, plano y ya calculado), viviendo en stores distintos, sincronizados por un proyector que escucha los domain events. Detalle completo en `CAMBIOS-CQRS.md`.

Este proyecto tiene **dos versiones en paralelo**, para comparar:
- **`core-cqrs/`** (este documento) — la descrita acá.
- **`core/`** — CQS: mismos comandos, pero las 2 queries leen directo del `TodoListRepositoryPort` (el aggregate de escritura), sin read model propio. Documentado en `ESTRUCTURA-cqs.md`.

`core-cqrs/` quedó congelada como snapshot — es una copia exacta del estado del proyecto en el momento en que se implementó el read model, antes del split. Los cambios posteriores (si los hay) solo se aplican a `core/`.

## Regla de dependencia

```
1-domain          ← no depende de nada
2-application     ← depende solo de 1-domain
3-infrastructure  ← implementa los ports de 2-application
4-generic-implementation ← conecta todo (composition root)
```

Las flechas de dependencia siempre apuntan hacia adentro (hacia el dominio). El dominio no sabe que existen la aplicación, la infraestructura ni la UI. Este es el principio central de Clean Architecture (Robert C. Martin): las reglas de negocio no dependen de detalles técnicos.

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
| `TodoItemAdded` | `TodoList.addItem` (lleva `title`, `description` y `priority` — necesarios para que el read model pueda reconstruir el item completo sin ir a buscarlo a otro lado) |
| `TodoItemCompleted` | `TodoList.completeItem` |
| `TodoItemRenamed` | `TodoList.renameItem` |
| `TodoItemDescriptionChanged` | `TodoList.changeItemDescription` |
| `TodoItemPriorityChanged` | `TodoList.changeItemPriority` |

> **Nota**: `TodoListDeleted` es el único evento que no nace del buffer interno del aggregate. Borrar una lista no es "mutarla", es removerla del repositorio — el aggregate no participa de esa operación, así que el interactor construye el evento a mano después de un `delete` exitoso.

### `exceptions/`
- **`DomainException.ts`** — clase base, extiende `Error`, fija `this.name` al nombre de la subclase.
- **`TodoListNotFoundException.ts`** / **`TodoItemNotFoundException.ts`** — excepciones tipadas para los 2 casos de "no encontrado". Permiten a un presenter real (`instanceof`) diferenciar 404 de otros errores, aunque hoy los presenters no lo hacen.

### `services/`
- **`TodoListDomainService.ts`** — lógica que no pertenece a una sola entidad: `calculateCompletionPercentage(items)` y `isFullyCompleted(items)`. Deliberadamente desacoplado de `TodoList` — opera sobre cualquier `{ status: string }[]`, no sobre el aggregate. Esto permite que lo use tanto el dominio como `TodoListProjector` (2-application), que solo tiene items planos del read model, no entidades `TodoItem`.

---

## `2-application/` — Aplicación

Orquesta el dominio. Define **qué** puede hacer el sistema (casos de uso) y **qué necesita del exterior** (ports), sin saber cómo se implementa nada de eso.

### `ports/out/` — Interfaces de salida (lo que la aplicación necesita, implementado en infraestructura)
- **`TodoListRepositoryPort.ts`** — `save`, `findById`, `findAll`, `delete`. Lado de **escritura** — trabaja con el aggregate `TodoList` completo.
- **`TodoListReadModelPort.ts`** — `findById`, `findAll` (para las queries) + `upsert`, `remove` (solo para el proyector). Lado de **lectura** — trabaja con `TodoListReadModel`, una forma plana y ya calculada, no con el aggregate.
- **`EventBusPort.ts`** — `publish(events): Promise<void>`, `subscribe(eventName, handler)`. `publish` es `async` a propósito: quien publica espera a que todos los handlers (incluido el proyector) terminen antes de seguir, para que no haya una ventana donde el read model esté desactualizado.
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

**Queries** (`use-cases/query/`) — no usan `UnitOfWorkPort`, `EventBusPort` ni `TodoListRepositoryPort`. Leen directo de `TodoListReadModelPort`, tipado como `Pick<TodoListReadModelPort, 'findById'>` / `'findAll'>` — el tipo del constructor bloquea en compile-time que una query pueda llamar `upsert`/`remove`:

| Caso de uso | Qué hace |
|---|---|
| `get-todo-list` | Trae una lista por id del read model — `completionPercentage`/`isFullyCompleted` ya vienen calculados, no se recalculan acá |
| `list-todo-lists` | Trae todas las listas del read model, mismo shape que `get-todo-list` por cada una |

### `read-model/` — el lado de lectura de CQRS
- **`TodoListReadModel.ts`** — tipos `TodoListReadModel`/`TodoItemReadModel`. Forma plana y desnormalizada, pensada para leer barato — sin VOs, sin métodos, con `completionPercentage`/`isFullyCompleted` guardados como campos (no derivados en el momento de leer).
- **`TodoListProjector.ts`** — el único escritor del read model. Se suscribe a los 7 domain events (`subscribeTo(eventBus)`) y mantiene `TodoListReadModel` al día: crea la entrada en `TodoListCreated`, la borra en `TodoListDeleted`, agrega/actualiza items en el resto. Recalcula `completionPercentage`/`isFullyCompleted` con `TodoListDomainService` cada vez que un item cambia.

### `shared/` — código compartido entre interactores (no es un caso de uso en sí)
- **`persistAndPublish.ts`** — extrae el boilerplate repetido en los 6 comandos que mutan un aggregate: `unitOfWork.begin()` → `repository.save(list)` → `unitOfWork.commit()` (o `rollback()` + re-throw si falla) → `await eventBus.publish(list.domainEvents)` (esto es lo que dispara al proyector y actualiza el read model) → `list.clearEvents()`. Cada interactor lo llama en una línea después de mutar el aggregate.
- **`testing/capturePresenter.ts`** — fábrica de un `OutputBoundary` falso para tests. `capture<TOutput>()` devuelve `{ presenter, state }`: `presenter` se le pasa al interactor (cumple la interface por duck typing), `state` es donde queda guardado el resultado para hacer `assert` después. Nunca se importa desde código de producción.

---

## `3-infrastructure/` — Infraestructura

Implementaciones concretas de los ports. Todas en memoria (`Map`/`Array`) porque es un ejemplo — en un sistema real acá irían Postgres, Redis, RabbitMQ, etc.

- **`persistence/InMemoryTodoListRepository.ts`** — implementa `TodoListRepositoryPort` con un `Map<string, TodoList>`. El store de **escritura**.
- **`persistence/InMemoryTodoListReadModelRepository.ts`** — implementa `TodoListReadModelPort` con otro `Map<string, TodoListReadModel>`, completamente separado del anterior. El store de **lectura**.
- **`messaging/InMemoryEventBus.ts`** — implementa `EventBusPort` con un `Map<eventName, handler[]>`. `publish` es `async` y espera (`await`) cada handler antes de pasar al siguiente — sin esto, el proyector (que hace `await` internamente) podría no haber terminado de actualizar el read model cuando el comando ya devolvió el control.
- **`unit-of-work/InMemoryUnitOfWork.ts`** — implementa `UnitOfWorkPort` con métodos no-op (`begin`/`commit`/`rollback` no hacen nada real, porque no hay una BD transaccional detrás).

---

## `4-generic-implementation/` — Adaptadores de entrada + composition root

(Antes se llamaba `4-nest-implementation`, pero no usa NestJS — cero decorators, cero DI container, cero HTTP real. Es wiring manual plano; el nombre actual es honesto sobre eso.)

### `api/controllers/TodoListController.ts`
Un método por caso de uso (9 en total). Cada método instancia el presenter correspondiente y llama `useCase.execute(input, presenter)`. No hay HTTP de verdad acá — sería el punto donde colgar rutas si esto fuera una API real.

### `api/presenters/`
Un presenter por caso de uso, implementa el `OutputBoundary` correspondiente. Todos hacen `console.log` — son el output boundary real usado en el flujo de `main.ts`. `CreateTodoListPresenter` además guarda `result` como campo público, porque `main.ts` necesita leer el `id` generado para encadenar el resto del flujo (el `controller.create()` no lo devuelve).

### `api/dtos/`
`CreateTodoListRequest.ts` y `AddTodoItemRequest.ts` — DTOs pensados para desacoplar "lo que llega por HTTP" de "lo que necesita la aplicación". Solo `CreateTodoListRequest` se usa de verdad (en `controller.create`); `AddTodoItemRequest` quedó sin conectar — el resto de los métodos del controller reciben el `Input` de aplicación directo. Asimetría conocida, no arreglada.

### `main.ts`
El **composition root**: arma toda la cadena de dependencias a mano — lado de escritura (`repository` → `eventBus` → `unitOfWork`), lado de lectura (`readModelRepository` → `TodoListProjector`, suscripto al mismo `eventBus` con `projector.subscribeTo(eventBus)`) — más los 7 `eventBus.subscribe(...)` que solo loguean para que se vea el flujo. Las queries (`getTodoList`, `listTodoLists`) se instancian con `readModelRepository`, no con `repository`. Corre un flujo de demostración real: crea una lista, agrega 2 items, completa uno, renombra/cambia descripción/cambia prioridad del otro, consulta la lista, lista todas las listas, borra la lista, y vuelve a listar para confirmar que quedó vacía — todo leído del read model, nunca del aggregate de escritura.

Se ejecuta con:
```bash
pnpm exec tsx core-cqrs/4-generic-implementation/main.ts
```

---

## Tests

`node:test` nativo (cero frameworks de testing como dependencia) + `tsx` como loader de TypeScript. 27 tests: los 9 interactores (camino feliz, cada excepción de dominio, publicación de cada evento, algún caso de fallo de infraestructura con rollback) más `TodoListProjector.test.ts`, que alimenta eventos reales del aggregate y verifica que el read model queda proyectado bien — incluyendo el caso "evento de un item para una lista que no está en el read model" (no debe explotar, solo ignorar).

```bash
pnpm test:cqrs
```

Los fakes usados en los tests **son las implementaciones reales de infraestructura** (`InMemoryTodoListRepository`, `InMemoryTodoListReadModelRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`) — no hace falta mockear nada porque ya son livianas y deterministas. Los tests de `GetTodoListInteractor`/`ListTodoListsInteractor` siembran el read model directo con `readModel.upsert(...)` — no dependen del proyector ni del aggregate de escritura, ese camino ya lo cubre `TodoListProjector.test.ts` por separado.

---

## Archivos sueltos en la raíz

- **`0-notas/`** — toda la documentación de la sesión: `ESTRUCTURA-cqs.md` (gemelo para `core/`), este archivo, `CAMBIOS-CQRS.md`, `CONVERSACION.md`, `doc.md`, `notas.md`.
- **`package.json`** — `"test:cqrs"` corre los tests de `core-cqrs/`, `"test"` corre los de `core/` (CQS). `main: "index.js"` sigue apuntando a un archivo que no existe (nunca se compiló a `dist/`). Pendiente, no resuelto.

---

## Gaps conocidos, sin resolver

1. **DTOs de transporte asimétricos** — solo `create-todo-list` pasa por un `Request` DTO propio; el resto de los métodos del controller usan el `Input` de aplicación directo.
2. **`main: "index.js"`** en `package.json` no existe (no hay build a `dist/` configurado).
3. Sin capa HTTP real — `4-generic-implementation` es wiring en memoria, no un servidor.
4. **Todo en memoria — la consistencia entre write/read model es "gratis" acá y no lo sería con una BD real.** `InMemoryEventBus.publish` espera (`await`) cada handler antes de devolver el control, así que el read model siempre está al día cuando un comando termina. Con un event bus real (Kafka, RabbitMQ, SQS) o incluso con Postgres sin cuidado extra, hay una ventana real de *eventual consistency* — un `GET` justo después de un `POST` puede devolver datos viejos. Ver `CAMBIOS-CQRS.md` para el detalle de las opciones (misma transacción, outbox, etc) si esto se migra a una base real.
5. **Congelada respecto a `core/`** — si `core/` sigue evolucionando (nuevos casos de uso, fixes), esta carpeta no los recibe a menos que se porten a mano. No hay ningún mecanismo que las mantenga sincronizadas.
