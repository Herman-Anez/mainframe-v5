# De un caso de uso a su implementación — cliente y servidor

Sigue **un solo caso de uso, `AddTodoItem`**, desde el dominio hasta las 2 formas en que hoy (o mañana) se lo invoca: consola real, y HTTP diseñado-pero-no-conectado. El objetivo es responder "¿dónde vive cada pieza y quién llama a quién?" sin tener que releer todo `arquitectura.md`.

Hay **una sola implementación del caso de uso** (`AddTodoItemInteractor`) y **dos fachadas distintas** que lo invocan. Ninguna pasa por otra — son caminos paralelos sobre el mismo núcleo.

(Hubo una tercera ruta, un cliente Angular real, pero se eliminó — quedó fuera de este documento.)

---

## El núcleo: caso de uso + dominio (siempre el mismo, en las 3 rutas)

```
2-application/use-cases/commands/add-todo-item/
  AddTodoItemUseCase.ts        ← el contrato: "esto sabe agregar un item"
  AddTodoItemInput.ts          ← { listId, title, description?, priority? }
  AddTodoItemOutput.ts         ← { success: true }
  AddTodoItemOutputBoundary.ts ← { presentSuccess(output), presentError(error) }
  AddTodoItemInteractor.ts     ← la implementación real
```

`AddTodoItemInteractor.execute(input, output)`:
1. Carga el aggregate `TodoList` desde `TodoListRepositoryPort` (`2-application/ports/out/`).
2. Le pide al aggregate que ejecute el comportamiento: `list.addItem(title, description, priority)` — acá vive la regla de negocio real (`1-domain/entities/TodoList.ts`: máximo 10 items).
3. Persiste (`repository.save`), publica los domain events acumulados (`EventBusPort`), y llama `output.presentSuccess(...)` o `output.presentError(...)`.

Esta parte **no cambia** entre consola o HTTP. Lo que cambia es quién arma el `Input`, quién instancia el `Interactor`, y quién recibe el `Output`.

---

## Ruta 1 — Servidor real, consola (`5-generic-implementation/`)

La única ruta que corre hoy sin red, in-process.

```
main.ts (composition root)
  → new AddTodoItemInteractor(repository, eventBus, unitOfWork)   [2-application/use-cases/.../AddTodoItemInteractor]
  → new TodoListController(useCases)                               [3-adapters/backend/TodoListController.ts]
  → controller.addItem(listId, { title, description, priority }, new AddTodoItemPresenter())
       │
       └─ TodoListController.addItem(...)                          [implements TodoListControllerPort]
            → this.useCases.addTodoItem.execute(input, output)     ← acá entra al núcleo de arriba
       │
       └─ AddTodoItemPresenter.presentSuccess(...)                 [5-generic-implementation/api/presenters/]
            → console.log(...)
```

- **`TodoListControllerPort`** (`2-application/use-cases-ports/backend/TodoListControllerPort.ts`) — el puerto: 9 firmas, una por caso de uso, agrupadas en una sola fachada.
- **`TodoListController`** (`3-adapters/backend/TodoListController.ts`) — la única implementación real de ese puerto. Recibe el presenter como parámetro, no lo instancia — por eso main.ts puede pasarle `AddTodoItemPresenter` (console.log) y en teoría cualquier otro frame le pasaría el suyo.

---

## Ruta 2 — HTTP, diseñado pero sin conectar (`2-application/use-cases-ports/http/`)

Esta es la única ruta que **hoy no corre de punta a punta** — describe la forma, no la ejecuta.

### Lado servidor (contrato, sin binder)

```
routes.ts → createHttpRoutes(useCases)
  → createAddTodoItemRoute(useCases.addTodoItem)        [add-todo-item/AddTodoItemRoute.ts]
       return {
         method: 'POST', path: '/lists/:listId/items',   [routeMetadata.ts]
         buildInput: (req) => ({ listId: req.params.listId, ...bodyAsRecord(req.body) fields... }),
         useCase: useCases.addTodoItem,                  ← el interactor DIRECTO, no pasa por TodoListController
         successStatus: 201,
         errorStatus: defaultErrorStatus,                [httpErrorStatus.ts]
       }
```

Esto es un `RouteDescriptor<AddTodoItemInput, AddTodoItemOutput>` — datos puros. **Nadie los lee todavía.** Falta el binder: un archivo (no existe, sería algo como `5-express-implementation/`) que haga:

```ts
for (const route of createHttpRoutes(useCases)) {
  app[route.method.toLowerCase()](route.path, async (req, res) => {
    const input = route.buildInput({ params: req.params, query: req.query, body: req.body });
    await route.useCase.execute(input, {
      presentSuccess: (output) => res.status(route.successStatus).json(output),
      presentError: (error) => res.status(route.errorStatus(error)).json({ error: error.message }),
    });
  });
}
```

Ese binder es el gap real — sin él, nada escucha ningún puerto de red.

### Lado cliente (contrato, sin servidor)

```
httpExample.ts
  → fetch(baseUrl + buildPath('/lists/:listId/items', { listId }), {
      method: 'POST', body: JSON.stringify({ title, description, priority })
    })
       [apiContract.ts — ApiContract.addTodoItem = { method: 'POST', path: '/lists/:listId/items' }]
```

Hoy esto **siempre falla** ("fetch failed") porque no hay servidor en `baseUrl`. El día que exista el binder de arriba, este mismo código funciona sin cambiar una línea — por eso vive ya escrito, aunque no tenga con quién hablar.

---

## Resumen — mismo caso de uso, 2 caminos

| Ruta | Quién arma el Input | Quién ejecuta | Quién presenta el resultado | ¿Corre hoy? |
|---|---|---|---|---|
| Consola | `TodoListController.addItem` (armado a mano en `main.ts`) | `AddTodoItemInteractor` | `AddTodoItemPresenter` → `console.log` | Sí |
| HTTP | `AddTodoItemRoute.buildInput` (de `req.params`/`req.body`) | `AddTodoItemInteractor` (mismo, si hubiera binder) | binder → `res.json(...)` | No — falta el binder Express/Fastify |

Las dos son **fachadas independientes** sobre el mismo `AddTodoItemInteractor` — ninguna importa a otra. Elegir HTTP no implica pasar por `TodoListController`.
