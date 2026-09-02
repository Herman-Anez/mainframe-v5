# Handoff — z-todo

Estado exacto al cierre de esta sesión (2026-09-02), para retomar sin re-explicar todo.
Historial previo (restructuring de capas, borrado de Angular, exploración del binder HTTP) más abajo, sin tocar.

---

## Estado del código

Restructuring de capas **completo y verificado**. Estructura actual de `core/`:

```
core/
  1-domain/
    entities/                   (TodoList, TodoItem — + métodos restore() para rehidratar, 2026-09-02)
    value-objects/              (+ Status.from(), 2026-09-02)
    exceptions/                 (DomainException abstracta con `code`; + TodoListFullException,
                                 TodoItemAlreadyCompletedException, ValidationException — 2026-09-02)
  2-application/
    ports/out/                  (TodoListRepositoryPort — ahora habla en TodoListRecord/string, 2026-09-02;
                                 EventBusPort, UnitOfWorkPort — sin cambios)
    shared/                     (OutputBoundary<T>, UseCase<I,O>, TodoItemView + toTodoItemView,
                                 TodoListRecord, TodoListMapper, persistAndPublish — genéricos y mapper, 2026-09-02)
    use-cases-ports/
      backend/                   (TodoListControllerPort + dtos/ — puerto, movido acá 2026-09-01)
      http/                      (RouteDescriptor, routeMetadata, apiContract, routes.ts, httpExample.ts,
                                 httpErrorStatus, httpValidation, 9 carpetas *Route.ts)
    use-cases/                   (9 interactores — 4 archivos c/u: Input, Output, UseCase, Interactor;
                                 los *OutputBoundary.ts por caso de uso se borraron, 2026-09-02)
  3-adapters/
    backend/                    (TodoListController — solo la implementación)
  4-infrastructure/
    persistence/                (InMemoryTodoListRepository — CERO imports de 1-domain, 2026-09-02)
    messaging/                  (InMemoryEventBus)
    unit-of-work/               (InMemoryUnitOfWork)
  5-generic-implementation/      (frame de consola — composition root main.ts)
```

Nombres viejos (`3-backend-interface`, `3-http-interface`, `3-infrastructure`, `4-generic-implementation`, `4-angular`) ya no existen en `core/`. Hubo una variante CQRS paralela (`core-cqrs/`, read model separado, numeración vieja) — se eliminó del repo en la limpieza de 2026-09-02; el dominio y los comandos eran idénticos a `core/`.

**Actualización 2026-09-01**: se movió `3-adapters/http` completo a `2-application/use-cases-ports/http` (era contrato puro, sin adapter real todavía — ahora vive como puerto, simétrico a `ports/out/`). Y se dividió `3-adapters/backend`: `TodoListControllerPort.ts` + `dtos/` (el contrato) se movieron a `2-application/use-cases-ports/backend/`; `TodoListController.ts` (la implementación real, consumida por `main.ts`) se quedó en `3-adapters/backend/` — mismo patrón que `TodoListRepositoryPort` (en `ports/out/`) + `InMemoryTodoListRepository` (en `4-infrastructure/`). Verificado: `tsc --noEmit` limpio, `pnpm test` 35/35, `main.ts` y `httpExample.ts` corren igual.

**Actualización 2026-09-01 (2)**: se eliminó `5-angular/` completo (36 archivos) — ya no hay frame Angular. Se limpiaron `pnpm-workspace.yaml` (sacado el `packages: [core/5-angular]`), `package.json` (sacados `start:angular`/`build:angular`), y `angular-implementation.md` (borrado — era solo sobre ese frame). Todas las docs restantes actualizadas para no mencionarlo. Único frame de entrega que queda: `5-generic-implementation/` (consola). Verificado: `tsc --noEmit` limpio, `pnpm test` 35/35, `main.ts` corre igual.

---

## Actualización 2026-09-02 — pase estructural (contrato + app layer + persistencia)

Tres cambios encadenados, todos verificados en verde (`tsc --noEmit` limpio en `core/`, **52/52** tests, `pnpm test:cqrs` 27/27, `main.ts` corre el flujo completo, `httpExample.ts` sigue dando los 9 "fetch failed").

### 1. Genéricos compartidos — menos boilerplate

- Nuevos `2-application/shared/OutputBoundary.ts` (`OutputBoundary<T>`) y `UseCase.ts` (`UseCase<I,O>`).
- **Borrados los 9 `XxxOutputBoundary.ts`** (eran idénticos). Cada `XxxUseCase.ts` ahora es `interface XxxUseCase extends UseCase<XxxInput, XxxOutput> {}`. Cada caso de uso pasó de 5 archivos a **4** (Input, Output, UseCase, Interactor).
- `RouteDescriptor.ts` dejó de re-declarar `OutputBoundaryLike`/`UseCaseLike` — importa los genéricos de `shared/`.
- `2-application/shared/TodoItemView.ts` (+ `toTodoItemView()`) — proyección plana de `TodoItem`, movida desde `get-todo-list/GetTodoListOutput.ts`; mata el `.map(...)` duplicado en `GetTodoList` y `ListTodoLists`.
- `capturePresenter` ganó `state.settled` (`'success' | 'error'`) para tests con `TOutput = void`.

### 2. Taxonomía de errores de dominio + mapeo HTTP real

- `DomainException` ahora es `abstract` con `readonly code: 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION'`.
- Nuevas: `TodoListFullException` (CONFLICT), `TodoItemAlreadyCompletedException` (CONFLICT), `ValidationException` (VALIDATION — una sola para todos los VO). Se cambiaron ~7 `throw new Error(...)` en entidades y value objects por estas (mensajes idénticos, para no romper tests que hacían `assert.match`).
- `httpErrorStatus.defaultErrorStatus` ahora es un `switch` sobre `code`: `RequestValidationError`→400, `NOT_FOUND`→404, `CONFLICT`→409, `VALIDATION`→422, **cualquier otra cosa→500** (antes: todo lo no-404 caía en 400, incluido un bug real).
- Nuevo `2-application/use-cases-ports/http/httpValidation.ts`: `RequestValidationError` + `requireString()` — seam de validación de body en el borde. Las rutas `create`/`add`/`rename`/`changePriority` usan `requireString` para campos obligatorios; `stringField` (fallback silencioso de `httpBody.ts`) queda solo para opcionales (`description`, `priority` con default).
- `RouteDescriptor` documenta que `buildInput` puede lanzar → el binder tiene que envolver `buildInput` + `useCase.execute` en el mismo `try` y rutear por `errorStatus`.

### 3. Outputs de comando con datos reales

- `AddTodoItemOutput` → `{ itemId }` (antes `{ success: true }`). `Complete/Rename/ChangeDescription/ChangePriority Output` → `{ item: TodoItemView }` (el item ya mutado — el cliente no re-GETea). `DeleteTodoList` → `OutputBoundary<void>`, route `successStatus: 204`, `DeleteTodoListOutput.ts` borrado.
- Los 4 mutadores de `TodoList` (`completeItem`/`renameItem`/`changeItemDescription`/`changeItemPriority`) ahora devuelven el `TodoItem` mutado.

### 4. Persistencia sin acceso al núcleo — Record + Mapper

- `1-domain`: `Status.from(value)` (reconstruye desde string, valida), `TodoItem.restore({...})` y `TodoList.restore({...})` — rehidratan una entidad ya existente (id previo, cualquier estado, sin eventos). Reemplazan al viejo `TodoList.fromPersistence` (roto, sin uso: no podía rehidratar el estado de los items).
- `2-application/shared/TodoListRecord.ts` — DTO plano (`{ id, name, items: [{ id, title, description, status, priority }] }`, solo strings).
- `2-application/shared/TodoListMapper.ts` — `toRecord(TodoList): TodoListRecord` / `toDomain(TodoListRecord): TodoList`.
- **`TodoListRepositoryPort` ahora habla en records**: `save(record: TodoListRecord)`, `findById(id: string): Promise<TodoListRecord | null>`, `findAll(): Promise<TodoListRecord[]>`, `delete(id: string)`. Sin imports de `TodoList`/`TodoListId`.
- `InMemoryTodoListRepository` — `Map<string, TodoListRecord>` + `structuredClone` en save/read. **Cero imports de `1-domain`** — solo importa el puerto y `TodoListRecord`, ambos de `2-application`. Prueba: `grep -rn "1-domain" core/4-infrastructure/persistence/*.ts` no encuentra ningún `import`.
- `persistAndPublish` hace `repository.save(TodoListMapper.toRecord(list))`.
- Cada interactor que lee: `TodoListId.from(input.listId)` (sigue validando id vacío → 422) → `repository.findById(id.value)` → `TodoListMapper.toDomain(record)`. `DeleteTodoList` no reconstruye el agregado — usa `record.id` / `record.name` para el evento `TodoListDeleted`.
- Trade-off aceptado: el repositorio dejó de ser una "colección de agregados" (repo DDD clásico) y es un almacén de records; el data-mapper vive en la capa de aplicación. A cambio, un adapter Postgres/archivo tampoco tocaría el dominio — reusaría `TodoListMapper` cambiando el `Map` por `INSERT`/`SELECT`.

### 5. `2-application/use-cases-ports/http/use-cases-ports-http.md`

Doc del contrato HTTP + cómo conectar un binder Express y un cliente web tipado (`createApiClient` sobre `ApiContract` + `ApiContractTypes`). Actualizado con el nuevo mapeo de status, `httpValidation`, `addTodoItem` devolviendo `itemId`, `delete` con 204.

### Decisiones tomadas en esta sesión

- **Fachada backend (`TodoListController` + `use-cases-ports/backend/`)**: se **mantiene junto con `routes.ts`/`RouteDescriptor`** — las dos fachadas paralelas conviven (la pregunta abierta de la sección "Opción 1 vs Opción 2" más abajo quedó resuelta como "ambas").
- **Patrón I/O**: se **mantiene** output-boundary (interactor devuelve `void`, llama `presentSuccess`/`presentError`); solo se colapsaron los 9 boundaries en el genérico.
- **Queries (Get/List)**: reconstruyen el agregado con `TodoListMapper.toDomain(record)` (mismo patrón que los comandos); el mapeo lo hace el interactor.

### Gaps que quedaron fuera de alcance (documentados, no bugs)

- No hay `fromPersistence` a nivel de repositorio real (Postgres/archivo) — solo el in-memory. El seam (`TodoListMapper` + `restore()`) ya está listo para uno.
- Id generator inyectable / clock para eventos (`new Date()` en constructores) — siguen hardcodeados.
- `ListTodoListsInput.ts` sigue siendo interface vacía (nitpick histórico).

---

**Verificación previa (2026-09-01) corrida y en verde**: `tsc --noEmit` limpio, `pnpm test` 35/35, `main.ts` corre el flujo demo completo, `httpExample.ts` da los 9 "fetch failed" esperados.

**Docs actualizadas**: `handoff.md` (esta sección), `explicaciones/arquitectura.md` (sección "Actualización 2026-09-02" + correcciones inline), `explicaciones/puertos/use-cases-ports-http.md`. `explicaciones/ESTRUCTURA-cqs.md` y `explicaciones/domio/documentacion del modulo.md` describen el modelo DDD conceptual y siguen válidas salvo los detalles de excepciones y del repositorio.

## Auditoría post-restructure (ya corrida, resultado limpio)

Se lanzó un audit fork completo después del restructuring. Resultado: **cero violaciones arquitectónicas reales**.

- Regla de dependencia respetada: 1-domain no importa nada externo salvo `crypto` (shimmeado en Angular). 2-application nunca importa 4-infrastructure en código de producción (solo tests, usando los adapters in-memory como fakes).
- Los 3 ports de salida correctamente implementados una sola vez cada uno.
- `TodoListControllerPort` genuinamente desacoplado — cero referencias desde ningún interactor ni caso de uso (dato de la auditoría original, cuando el archivo vivía en `3-adapters/backend/`; sigue siendo cierto tras el move del 2026-09-01 a `2-application/use-cases-ports/backend/`).
- `routeMetadata.ts` es fuente de verdad real, sin duplicados.
- Los 9 `*Route.ts` fuerzan tipos en compile-time de verdad vía `RouteDescriptor<TInput,TOutput>`.
- Angular arma el mismo grafo de objetos que `main.ts` (mismos 9 interactores, mismos 3 singletons), via alias a los mismos archivos fuente (no copia). *(Angular se borró el 2026-09-01 — este punto es histórico.)*
- 35/35 tests, los 9 interactores cubiertos. *(2026-09-02: son 52/52 tras el pase estructural.)*
- Nitpick único, inofensivo: `ListTodoListsInput.ts` existe aunque `listLists` no recibe request real (consistencia de patrón, no bug).

**Gaps ya conocidos** (no son bugs, son "no implementado todavía") — estado al 2026-09-02:
1. `2-application/use-cases-ports/http` no tiene binder HTTP real (Express/Fastify/Next) — existe el contrato completo (`RouteDescriptor`, `apiContract.ts`, ejemplo `httpExample.ts`) pero nada sirve las rutas. **Sigue vigente.**
2. ~~`httpBody.ts` no valida esquema~~ — **parcialmente cerrado 2026-09-02**: `httpValidation.requireString` corta los campos obligatorios faltantes (→ 400). Longitudes/enums los sigue validando el dominio (→ 422). No hay Zod/JSON-Schema en el borde.
3. Las queries (`GetTodoListInteractor`/`ListTodoListsInteractor`) reconstruyen el aggregate completo para leer (ahora vía `TodoListMapper.toDomain`) — no hay modelo de lectura aplanado en `core/`. **Sigue vigente.**
4. `main: "index.js"` en `package.json` raíz apunta a un archivo que no existe (no hay build a `dist/` configurado). Menor, no bloquea nada.

---

## Conversación en curso — conceptos explicados, sin implementar nada todavía

Después de la auditoría, la conversación giró a **explorar cómo se vería un binder HTTP real**, sin llegar a decidir ni construir nada. Puntos cubiertos:

1. **Qué es un "binder"**: el código que toma el contrato (`RouteDescriptor[]`) y lo conecta a un servidor HTTP real que escucha peticiones. Hoy no existe — `routes.ts` es solo descripción de datos, nadie escucha ningún puerto.

2. **Por qué el gap está en HTTP y no en backend**: `3-adapters/backend` (`TodoListController`) ya tiene un consumidor real y funcionando — `5-generic-implementation/main.ts` lo llama in-process, sin red. Está completo. `2-application/use-cases-ports/http` en cambio no tiene ningún proceso sirviéndolo — ese es el gap real.

3. **Camino propuesto si se construye** (no decidido, no iniciado): frames nuevos, mismo patrón que ya existe con `5-generic-implementation`:
   - `5-express-implementation/` (o similar) — binder real, importa `2-application/use-cases-ports/http/routes.ts`, sirve las 9 rutas con Express.
   - Un frame Next.js aparte, del lado cliente, consumiendo `apiContract.ts` con `fetch` real contra ese Express (mismo patrón que `httpExample.ts` pero contra un servidor que sí existe).
   - `2-application/use-cases-ports/http` en sí mismo no "corre" nada — es el plano compartido entre ambos lados (server y cliente), no la implementación.

4. **Dato clave**: `RouteDescriptor.useCase` es del tipo `UseCase<TInput,TOutput>` (el genérico de `2-application/shared/`, antes `UseCaseLike`) — el interactor **directo**, no pasa por `TodoListController`. Es decir, **`2-application/use-cases-ports/http` y `3-adapters/backend` son dos fachadas paralelas e independientes sobre los mismos 9 casos de uso, no una encima de otra.** Si se construye Express, hay que elegir una de dos, no las dos apiladas:
   - **Opción 1**: Express usa `routes.ts`/`RouteDescriptor` tal cual — el binder es un loop genérico (`for (const route of routes) { app[method](path, handler) }`), reusa el trabajo HTTP-específico ya hecho en cada `*Route.ts` (status codes, method, path ya vienen en el dato). `TodoListController` queda sin usar en este camino.
   - **Opción 2**: Express usa `TodoListController` directo — el binder tiene que inventar el mapeo HTTP a mano (9 registros de ruta explícitos, sin status codes ni paths predefinidos, porque el Controller es agnóstico a transporte a propósito). `2-application/use-cases-ports/http` queda sin usar en este camino.
   - Diferencia resumida: Controller no sabe de HTTP (reusable desde cualquier transporte: CLI, gRPC, tests); RouteDescriptor ya sabe de HTTP (menos código de binder, pero nace atado a HTTP).

**Resuelto (2026-09-02)**: se decidió **mantener ambas fachadas** en el repo. Para un binder HTTP + cliente web tipado, el camino recomendado es la **Opción 1** (`routes.ts`), documentado en `use-cases-ports-http.md`. El binder en sí **todavía no se construyó** — sigue siendo el gap #1.

## Próximo paso sugerido al retomar

Construir el binder Express (Opción 1) y el cliente web tipado, siguiendo `use-cases-ports-http.md`. Entrar en Plan Mode antes de tocar código — mismo patrón usado en las sesiones estructurales.
