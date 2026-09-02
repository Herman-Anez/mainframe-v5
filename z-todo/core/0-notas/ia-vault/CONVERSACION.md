# Bitácora de sesión — z-todo (DDD / Clean Architecture / CQRS)

Registro de la conversación completa de esta sesión: evaluación inicial, fixes, features agregadas y la implementación de CQRS con read model separado. Organizado por tema, en orden cronológico.

---

## 1. Evaluación inicial del ejemplo DDD/Clean/Hexagonal

Pedido: analizar y evaluar `main.ts`, que probaba un ejemplo de DDD + Clean/Hexagonal Architecture.

**Lo bien hecho:**
- Layering correcto: `1-domain` → `2-application` → `3-infrastructure` → `4-nest-implementation` (luego renombrado), dependencias apuntando siempre hacia adentro.
- Ports & Adapters real: `TodoListRepositoryPort`/`EventBusPort` en aplicación, implementados en infra.
- Value Objects con factory + validación (`Title`, `Description`, `Priority`).
- Aggregate root disciplinado (`TodoList` como único punto de mutación).
- Input/Output Boundary pattern consistente en los 4 use cases originales.

**Problemas encontrados:**
1. `main.ts` armaba todo el wiring pero **nunca ejecutaba nada** — no probaba nada realmente.
2. La carpeta se llamaba `4-nest-implementation` pero no usaba NestJS (cero decorators, cero DI, cero HTTP real).
3. `UnitOfWorkPort` definido pero sin implementación ni uso — puerto muerto.
4. Boilerplate `save → publish → clearEvents` repetido en los 3 interactores de comando.
5. `presentError(error as Error)` perdía el tipo específico de excepción — no se podía distinguir 404 de 500.
6. DTO de transporte inconsistente: solo `create` mapeaba a un `Request` DTO propio, el resto usaba el `Input` de aplicación directo.
7. `TodoListDomainService` sin un solo caller — huérfano.
8. Cero tests, a pesar de que los ports eran triviales de mockear.
9. `package.json`: `main: "index.js"` apuntando a un archivo inexistente.

---

## 2. Arreglar `main.ts` para correr un flujo real

Se identificó que el `Presenter` de `create` (`CreateTodoListPresenter`) solo hacía `console.log`, sin guardar el resultado — y el `controller.create()` internamente creaba su propio presenter, sin exponerlo. Imposible encadenar `addItem` después sin el `listId` real.

**Solución aplicada**: `main.ts` reescrito con una función `run()` async que:
1. Llama al interactor `createTodoList` directo (no el controller) con un presenter capturador para leer el `id` generado.
2. Encadena `addItem` × 2, `completeItem`, `getList`.

Se verificó con `pnpm exec tsc --noEmit` (limpio) y ejecutando el flujo con `tsx`, confirmando eventos logueados y resultado final correcto.

### 2.1 — "¿Por qué creaste un `CapturingCreatePresenter` cuando existe `CreateTodoListPresenter`?"

Buena observación del usuario. Se explicó: el presenter existente no guardaba el resultado, y el controller no lo exponía. Se resolvió agregando un campo público `result` a la clase **existente** `CreateTodoListPresenter` (en vez de duplicar una clase nueva en `main.ts`), y usándola directo (bypaseando el controller para ese caso puntual). Menos duplicación, reusa la pieza real de producción.

---

## 3. Casos de uso faltantes

Pedido: "implementá los otros casos de uso". El dominio (`TodoList.ts`) ya soportaba `renameItem`, `changeItemDescription`, `changeItemPriority`, y el repositorio ya soportaba `findAll`/`delete` — pero no había casos de uso que los expusieran.

**5 use cases nuevos**, mismo patrón (Input/Output/OutputBoundary/UseCase/Interactor):
- `rename-todo-item`
- `change-todo-item-description`
- `change-todo-item-priority`
- `delete-todo-list`
- `list-todo-lists` (query, reusando el shape de `GetTodoListOutput`)

Wireados en `TodoListController` (5 métodos nuevos) y `main.ts` (interactores + flujo demo extendido).

**Detalle notado**: `renameItem`/`changeItemDescription`/`changeItemPriority` en el dominio no emitían domain events (a diferencia de `addItem`/`completeItem`), así que esos 3 interactores nuevos publicaban un array vacío — consistente con el dominio existente, no un bug introducido.

---

## 4. Domain events faltantes

### 4.1 — Los 3 que faltaban en items

Pregunta del usuario: "explicame por qué los nuevos casos de uso no emiten eventos". Respuesta: el aggregate (`TodoList.ts`) nunca llamaba `addDomainEvent` en esos 3 métodos — gap preexistente en el dominio, no en los interactores.

**Fix**: se crearon `TodoItemRenamed`, `TodoItemDescriptionChanged`, `TodoItemPriorityChanged` (mismo shape que `TodoItemAdded`), y `TodoList.ts` los dispara ahora en `renameItem`/`changeItemDescription`/`changeItemPriority`. `main.ts` se suscribió a los 3 nuevos nombres.

### 4.2 — `TodoListDeleted` (simetría con `TodoListCreated`)

Detectado en una re-evaluación posterior: `TodoList.create()` dispara `TodoListCreated`, pero borrar una lista no disparaba nada.

**Fix**: nuevo evento `TodoListDeleted`. Como borrar **no es una mutación del aggregate** (se remueve del repositorio, el aggregate no participa), el evento se construye a mano dentro de `DeleteTodoListInteractor` después de un `delete` exitoso — no nace del buffer interno de `TodoList` como los demás.

---

## 5. Re-evaluación completa (post cambios)

Se volvió a analizar todo el árbol de archivos. Resuelto: `main.ts` corre flujo real, folder renombrado a `4-generic-implementation` (honesto sobre no ser Nest). Seguían abiertos: `UnitOfWorkPort` muerto, `TodoListDomainService` huérfano, `TodoItemNotFoundException` sin usar, boilerplate repetido (ahora en 6 interactores en vez de 3), tests en cero.

---

## 6. `UnitOfWorkPort` implementado

Pedido: "implementemos UnitOfWorkPort". Se creó `InMemoryUnitOfWork` (no-op, como el resto de la infra in-memory) y se envolvió cada operación de escritura en los 7 interactores de comando con `begin()` → operación → `commit()` (o `rollback()` + re-throw si falla) — mismo patrón que ya estaba esbozado en `notas.md`/`todo-module.ts` (scratch original).

---

## 7. `TodoItemNotFoundException` en uso

Pedido: "implementá TodoItemNotFoundException". `TodoList.findItemOrThrow` lanzaba `Error` genérico; se cambió a lanzar `TodoItemNotFoundException(itemId, this.id.value)`. Verificado con un script ad-hoc: el mensaje sale correcto (`"TodoItem with id X not found in list Y"`), y el tipo (`error.constructor.name`) ahora es identificable.

---

## 8. Boilerplate extraído — `persistAndPublish`

Pregunta: "explicame lo del boilerplate". Se explicó el bloque de 9 líneas repetido (`begin/save/commit/rollback/publish/clearEvents`) en 6 interactores, y el riesgo de mantenerlo duplicado.

Pedido: "dale, implementá la opción A" (función standalone, no clase base con herencia). Se creó `2-application/shared/persistAndPublish.ts`; los 6 interactores pasaron de ~9 líneas a 1 llamada. `DeleteTodoListInteractor` quedó afuera a propósito (usa `delete`, no `save`, y el evento no nace del buffer del aggregate).

---

## 9. Tests

### 9.1 — Setup y primeros 5 interactores

Pedido: "agregá tests para los interactores principales". Se eligió `node:test` nativo + `tsx` como loader (sin Jest/Vitest, cero deps de test nuevas salvo `tsx`). Requirió `pnpm approve-builds esbuild` (dependencia nativa de `tsx`).

Se creó `2-application/shared/testing/capturePresenter.ts` — helper `capture<TOutput>()` que devuelve `{ presenter, state }`, evitando reescribir un `OutputBoundary` falso en cada test.

12 tests iniciales sobre 5 interactores (create, add, complete, get, delete). Durante el desarrollo se encontró que `CreateTodoListInteractor` en realidad **no valida el nombre** (bug real, ver sección 10) — el test tuvo que reescribirse para probar un fallo de persistencia con rollback en vez de una validación de dominio que no existía.

### 9.2 — Test faltante tras el fix de `Title`

Pedido: "agrega el test faltante" — se agregó el caso de nombre corto rechazado, ahora que sí existe ese camino de error (ver sección 10).

### 9.3 — Cobertura completa

Pedido: "agrega los test para los casos de uso faltantes". Se agregaron tests para `RenameTodoItemInteractor`, `ChangeTodoItemDescriptionInteractor`, `ChangeTodoItemPriorityInteractor`, `ListTodoListsInteractor` → 24 tests, 9/9 interactores cubiertos.

(Más adelante, con el read model, subieron a 27 — ver sección 13.)

---

## 10. `TodoList` no validaba su nombre

Durante el trabajo de tests se descubrió: `TodoList.create(name)` guardaba `_name` como `string` plano, sin pasar por la VO `Title` (que sí usa `TodoItem`). `'ab'` (2 caracteres) creaba una lista sin problema.

Pedido: "arreglá TodoList para que valide el nombre con Title". Se cambió `_name` de `string` a `Title`, tanto en `create()` como en `fromPersistence()`. El getter `name` sigue devolviendo `string` — cero cambios para quien consume `TodoList` desde afuera. Verificado: `'ab'` ahora lanza `"Title must have at least 3 characters"`.

---

## 11. Bug real: presenters con `console.log()` vacío

Al comparar `capturePresenter.ts` (testing) contra `AddTodoItemOutputBoundary`/`AddTodoItemPresenter` (producción), se encontró que `AddTodoItemPresenter.presentSuccess` y `CompleteTodoItemPresenter.presentSuccess` hacían `console.log()` **sin argumento** — no imprimían el `output` recibido. Bug preexistente, no introducido en esta sesión.

Pedido: "arreglá el console.log() vacío en los 2 presenters". Cambiado a `console.log(output)` en ambos. Verificado con un script directo instanciando cada presenter.

---

## 12. Preguntas de comprensión — `capturePresenter` vs `AddTodoItemOutputBoundary`

Varias preguntas de clarificación del usuario, respondidas con analogías y ejemplos de código:

- **"No entiendo, explicame como si fuera idiota"** (sobre `capturePresenter.ts`): analogía de "espía" — un objeto que se hace pasar por el presenter real pero anota el resultado en una libreta (`state`) en vez de mostrarlo en pantalla.
- **"Es muy diferente a la implementación de `AddTodoItemOutputBoundary`"**: se aclaró que la interface es la misma (2 métodos), lo que difiere es la implementación — clase con `implements` explícito e instanciada (producción) vs función fábrica que devuelve objetos por duck typing (testing).
- **"¿Por qué `AddTodoItemOutputBoundary` no tiene `state`?"**: porque `state` no es parte del contrato — vive afuera del objeto `presenter`, en una variable separada que el test lee después. El interactor nunca la ve.

---

## 13. `ESTRUCTURA.md` — documentación de la arquitectura

Pedido: "creame un .md explicando la estructura del proyecto y todos sus elementos". Se creó `ESTRUCTURA.md` cubriendo las 4 capas, cada archivo con su rol, el patrón de 5 archivos por caso de uso, tabla de los 9 use cases, tabla de eventos con quién los emite, setup de tests, y gaps conocidos sin resolver.

---

## 14. "¿El proyecto aplica bien CQRS?"

Análisis honesto: **no** — el proyecto tenía separación de **nombres** (carpetas `commands/`/`query/`) pero **un solo modelo** por debajo (mismo `TodoListRepositoryPort`, mismo aggregate `TodoList` reconstruido en cada query). Eso es CQS (Command Query Separation), no CQRS. Se explicó qué le faltaría: modelos de lectura/escritura separados, y se señaló que los domain events ya publicados (sin consumidor real más que logging) eran justo la pieza que en CQRS real conecta write-side con read-side.

---

## 15. Implementación del read model separado (CQRS real)

Pedido: "implementemos el read model separado".

### 15.1 — Piezas nuevas

- **`2-application/read-model/TodoListReadModel.ts`** — tipos `TodoListReadModel`/`TodoItemReadModel`, forma plana y desnormalizada con `completionPercentage`/`isFullyCompleted` como campos ya calculados.
- **`2-application/ports/out/TodoListReadModelPort.ts`** — `findById`/`findAll` (lectura) + `upsert`/`remove` (solo el proyector).
- **`2-application/read-model/TodoListProjector.ts`** — se suscribe a los 7 domain events (`subscribeTo(eventBus)`) y mantiene el read model actualizado. Reusa `TodoListDomainService` para recalcular porcentajes.
- **`3-infrastructure/persistence/InMemoryTodoListReadModelRepository.ts`** — store en memoria del lado de lectura, separado del de escritura.

### 15.2 — Dos fixes necesarios para que funcionara de verdad

1. **`TodoItemAdded` no llevaba `description`/`priority`** — el proyector hubiera mostrado siempre valores default aunque el item real tuviera otros. Se agregaron esos 2 campos al evento y a `TodoList.addItem`.
2. **`EventBusPort.publish` era síncrono/fire-and-forget** — un proyector `async` (con `await` internos) no terminaría antes de que la siguiente query corriera. Se cambió `publish` a `Promise<void>`, y `InMemoryEventBus` ahora hace `await` de cada handler en orden antes de continuar. `persistAndPublish.ts` y `DeleteTodoListInteractor.ts` actualizados para hacer `await eventBus.publish(...)`.

### 15.3 — `TodoListDomainService` desacoplado

Se cambió su firma de `(list: TodoList)` a `(items: { status: string }[])` — así lo puede usar tanto el dominio como el proyector (que solo tiene items planos del read model, no entidades `TodoItem`).

### 15.4 — Queries migradas

`GetTodoListInteractor` y `ListTodoListsInteractor` dejaron de depender de `TodoListRepositoryPort` — ahora reciben `Pick<TodoListReadModelPort, 'findById'>` / `'findAll'>`, tipo que bloquea en compile-time que una query pueda escribir en el read model.

### 15.5 — Tests

Se reescribieron `GetTodoListInteractor.test.ts`/`ListTodoListsInteractor.test.ts` para sembrar el read model directo (`readModel.upsert(...)`), y se agregó `TodoListProjector.test.ts` — alimenta eventos reales del aggregate y verifica la proyección end-to-end, incluyendo el caso "evento de un item para una lista que no está proyectada" (no debe explotar). Total: **27 tests**.

### 15.6 — `main.ts`

Wireado el read model + proyector: `readModelRepository`, `new TodoListProjector(readModelRepository)`, `projector.subscribeTo(eventBus)`. Las queries pasan a instanciarse con `readModelRepository` en vez de `repository`. Verificado con `tsx` corriendo el flujo completo — mismo output que antes, pero ahora servido por el read model.

---

## 16. `CAMBIOS-CQRS.md` — explicación "como si fuera idiota"

Pedido: "crea un markdown explicando detalladamente y como si yo fuera idiota los cambios que hicimos para implementar esto". Se creó `CAMBIOS-CQRS.md` con la analogía cocina (write side) / pizarrón (read side) / mozo (query) / encargado del pizarrón (proyector), recorriendo cada pieza nueva, los 2 bugs encontrados con ejemplos concretos de cómo se hubieran manifestado, el camino completo de un `addItem` paso a paso con archivo:línea, y el porqué de la restricción `Pick<>` en las queries.

---

## 17. Preguntas de seguimiento sobre CQRS y Postgres

- **"¿Esto me obliga a tener dos tablas al momento de hacer una implementación real?"** — No, es un espectro: desde cero duplicación (query SQL directa optimizada contra la misma tabla) hasta vista de BD, tabla separada actualizada en la misma transacción, tabla separada + outbox pattern, o store completamente distinto (Elasticsearch, Redis). La necesidad real depende de cuán distintos sean los patrones de lectura/escritura.

- **"Si quiero integrarle Postgres, ¿cómo tendría que hacer?"** — Gracias a ports & adapters, Postgres sería solo 2 adapters nuevos (`PostgresTodoListRepository`, `PostgresTodoListReadModelRepository`) implementando los ports existentes — dominio y aplicación no cambian. El punto crítico: cómo mantener el read model sincronizado sin el "await gratis" que da el event bus in-memory. Se ofrecieron 2 caminos (misma transacción vs. transactional outbox) vía `AskUserQuestion`; el usuario pidió aclaración conceptual antes de elegir.

- **"¿Se tendrían que crear dos tablas entonces?"** — Sí, en ambos enfoques (misma transacción: 2 tablas; outbox: 3, sumando `outbox_events`). La única forma de evitarlo es no tener read model separado (SQL directo contra la tabla de escritura).

- **"¿`GetTodoListInteractor` ya tiene `completionPercentage` cuando lo calcula?"** — No lo calcula, solo lee `list.completionPercentage` ya presente en el objeto que devuelve `findById`. Quien lo calcula es `TodoListProjector.save()`, una sola vez, en el momento de escribir el read model — no en cada lectura.

- **"¿En la tabla de escritura no está ese atributo?"** — Confirmado con grep: no, `TodoList` (aggregate) nunca tuvo `completionPercentage` como campo. Es dato derivado, reconstruible desde los `status` de los items; solo el read model lo persiste como campo, porque su razón de ser es tener todo pre-calculado.

- **"Me estás sugiriendo 'implementá misma transacción', ¿qué significa?"** — Explicado con SQL (`BEGIN`/`COMMIT` atómico) y cómo cambiaría el flujo de `persistAndPublish.ts`: el `readModelRepository.upsert(...)` pasaría a llamarse dentro del mismo `try`/transacción que `repository.save(...)`, antes del `commit()`, en vez de disparar después vía evento. Trade-off: pierde el desacople total (si falla escribir el read model, falla todo el comando).

---

## 18. `ESTRUCTURA.md` actualizado

Pedido: "actualiza ESTRUCTURA.md". Se agregó nota de CQRS real en la intro, se actualizó la tabla de eventos (`TodoItemAdded` con los campos nuevos), `TodoListDomainService` desacoplado, sección nueva `read-model/`, `TodoListReadModelPort` en la lista de ports, `EventBusPort` marcado async con el porqué, las 2 queries explicando que leen precalculado con `Pick<>` bloqueando escritura, `InMemoryTodoListReadModelRepository` en infraestructura, `main.ts` con el wiring del proyector, conteo de tests a 27, referencia a `CAMBIOS-CQRS.md`, y un gap nuevo sobre eventual consistency (hoy "gratis" por ser todo síncrono en memoria).

---

## 19. Deep dive final: cómo funcionan los eventos, paso a paso

Serie de preguntas de comprensión sobre el mecanismo de eventos, respondidas con código real y trazas completas:

- **"No entiendo los eventos"** (comparando `projector.subscribeTo(eventBus)` con los `eventBus.subscribe(...)` sueltos en `main.ts`): se explicó que `EventBus.subscribe` **apila** handlers en un array por `eventName`, no reemplaza — ambos coexisten. Para `'TodoListCreated'`, el array queda `[projector.onTodoListCreated, console.log]`, y `publish` corre los dos en orden. Uno actualiza el read model (funcional), el otro solo loguea (debug, prescindible).

- **"¿Dónde se declaran los eventos?"** — En `1-domain/events/`, cada uno con su `eventName` hardcodeado como string literal en la clase. Se aclaró la diferencia entre **declarar** (la clase, una vez), **instanciar** (`new TodoItemAdded(...)`, dentro de `TodoList.ts`, cada vez que pasa ese cambio) y **publicar** (`eventBus.publish(...)`, en el interactor).

- **"¿Dónde se consumen las funciones registradas al evento?"** — En `InMemoryEventBus.publish()`, específicamente la línea `await handler(event)` dentro del doble `for`. Se mostró la cadena completa desde `controller.addItem()` hasta ese punto.

- **"¿Y quién dispara `TodoItemCompleted` del lado del proyector?"** — Traza completa: `CompleteTodoItemInteractor.execute()` → `list.completeItem(itemId)` → `TodoList.ts` crea el evento con `addDomainEvent` → `persistAndPublish` → `eventBus.publish(...)` → `InMemoryEventBus` busca los handlers de `'TodoItemCompleted'` → ejecuta el handler registrado por `TodoListProjector.subscribeTo` → que llama `onTodoItemCompleted`, el cual busca el item en el read model y le cambia `status` a `'COMPLETED'`. Se aclaró que no hay ningún llamado directo a `projector.onTodoItemCompleted(...)` en ningún lado — solo ocurre a través de la cadena de eventos.

---

## Resumen de archivos — estado final

**Dominio (`1-domain/`) — nuevo/modificado:**
- `events/TodoItemRenamed.ts`, `TodoItemDescriptionChanged.ts`, `TodoItemPriorityChanged.ts`, `TodoListDeleted.ts` (nuevos)
- `events/TodoItemAdded.ts` (agregados `description`/`priority`)
- `entities/TodoList.ts` (dispara los eventos nuevos, `_name` como `Title`, `findItemOrThrow` lanza `TodoItemNotFoundException`)
- `services/TodoListDomainService.ts` (desacoplado de `TodoList`)

**Aplicación (`2-application/`) — nuevo:**
- `read-model/TodoListReadModel.ts`, `TodoListProjector.ts`, `TodoListProjector.test.ts`
- `ports/out/TodoListReadModelPort.ts`
- `shared/persistAndPublish.ts`, `shared/testing/capturePresenter.ts`
- `use-cases/commands/rename-todo-item/`, `change-todo-item-description/`, `change-todo-item-priority/`, `delete-todo-list/` (completos, 5 archivos + test cada uno)
- `use-cases/query/list-todo-lists/` (completo + test)
- `*.test.ts` en los 9 interactores

**Aplicación — modificado:**
- `ports/out/EventBusPort.ts` (`publish` async)
- `use-cases/query/get-todo-list/GetTodoListOutput.ts` (+ `completionPercentage`/`isFullyCompleted`)
- `use-cases/query/get-todo-list/GetTodoListInteractor.ts`, `use-cases/query/list-todo-lists/ListTodoListsInteractor.ts` (migrados al read model)
- Los 6 interactores de comando originales (usan `persistAndPublish` + `UnitOfWorkPort`)

**Infraestructura (`3-infrastructure/`) — nuevo:**
- `persistence/InMemoryTodoListReadModelRepository.ts`
- `unit-of-work/InMemoryUnitOfWork.ts`

**Infraestructura — modificado:**
- `messaging/InMemoryEventBus.ts` (async, awaitea handlers en orden)

**`4-generic-implementation/` — modificado:**
- `main.ts` (wiring completo: write side, read side, proyector, flujo demo extendido)
- `api/controllers/TodoListController.ts` (9 métodos)
- `api/presenters/AddTodoItemPresenter.ts`, `CompleteTodoItemPresenter.ts` (fix `console.log()` vacío)
- `api/presenters/RenameTodoItemPresenter.ts`, `ChangeTodoItemDescriptionPresenter.ts`, `ChangeTodoItemPriorityPresenter.ts`, `DeleteTodoListPresenter.ts`, `ListTodoListsPresenter.ts` (nuevos)
- Carpeta renombrada de `4-nest-implementation` → `4-generic-implementation`

**Raíz — nuevo:**
- `ESTRUCTURA.md`, `CAMBIOS-CQRS.md`, `CONVERSACION.md` (este archivo)
- `package.json` (`test` script real), `pnpm-workspace.yaml` (efecto colateral de instalar `tsx`)

**Estado final verificado**: `pnpm exec tsc --noEmit` limpio, `pnpm test` → 27/27, `main.ts` corre el flujo completo end-to-end contra el read model.
