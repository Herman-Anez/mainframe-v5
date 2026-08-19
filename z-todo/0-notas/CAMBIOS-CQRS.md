# Qué hicimos para separar el read model (CQRS) — explicado bien despacio

Este documento explica, paso a paso y sin dar nada por sabido, los cambios que hicimos para que el proyecto pase de "carpetas que se llaman command/query" a "de verdad tiene dos modelos separados", que es lo que hace falta para llamarse CQRS.

## 1. El problema, con una analogía

Imaginate un restaurante.

**Antes de este cambio**, cada vez que un mozo (una *query*, ej. "mostrame la lista de compras") quería saber el estado de una mesa, entraba a la cocina, abría la heladera, revisaba cada ingrediente, y armaba el pedido ahí mismo — usando el mismo proceso lento y con todas las reglas estrictas que usa el cocinero para *cocinar* (las mismas reglas de negocio, el mismo objeto `TodoList`). Funciona, pero es ineficiente: para simplemente **leer** un dato no hace falta pasar por todo el proceso pensado para **escribir** con seguridad.

**Después de este cambio**, hay un pizarrón en la pared (el **read model**) con la info ya resumida y lista para leer: "Mesa 4: 2 platos, 1 listo, 1 pendiente". El mozo (query) solo mira el pizarrón — nunca entra a la cocina. Cada vez que el cocinero (un comando, ej. "completar item") termina algo, no deja que el mozo se entere solo: manda un aviso corto ("plato de la mesa 4 listo") a la persona encargada de actualizar el pizarrón. Esa persona es el **proyector**.

Dos cosas separadas, conectadas por avisos (eventos):
- **Cocina** = modelo de escritura = `TodoList` (el aggregate), con todas sus reglas (`Title` valida el nombre, `TodoItem` valida sus campos, etc).
- **Pizarrón** = modelo de lectura = una versión plana y ya calculada, lista para mostrar.
- **Avisos** = domain events (`TodoItemAdded`, `TodoItemCompleted`, etc), que ya existían en el proyecto de antes.
- **Encargado del pizarrón** = el proyector, pieza nueva que agregamos.

## 2. Las piezas nuevas, una por una

### `TodoListReadModel.ts` — la forma del pizarrón

Es solo un tipo de dato, sin lógica. Define cómo se ve una entrada del pizarrón:

```ts
export interface TodoListReadModel {
  id: string;
  name: string;
  completionPercentage: number;   // ya calculado, no hay que recalcularlo al leer
  isFullyCompleted: boolean;      // ya calculado
  items: TodoItemReadModel[];
}
```

Fijate: `completionPercentage` está **guardado ahí**, no se calcula cada vez que alguien pregunta. Esa es la ventaja de un read model — todo el trabajo pesado ya está hecho de antemano, leer es solo "andá y mirá".

### `TodoListReadModelPort.ts` — el contrato del pizarrón

Una interface con 4 métodos:

```ts
export interface TodoListReadModelPort {
  findById(id: string): Promise<TodoListReadModel | null>;  // el mozo usa esto
  findAll(): Promise<TodoListReadModel[]>;                   // el mozo usa esto
  upsert(list: TodoListReadModel): Promise<void>;            // solo el encargado del pizarrón usa esto
  remove(id: string): Promise<void>;                         // solo el encargado del pizarrón usa esto
}
```

`upsert` = "actualizá si existe, creá si no existe" (update + insert). Es cómo el encargado escribe en el pizarrón. `remove` es borrar una entrada entera (cuando se borra una lista completa).

### `InMemoryTodoListReadModelRepository.ts` — el pizarrón físico

La implementación real, un simple `Map` en memoria (como ya tenían las otras piezas "in memory" del proyecto). Es un pizarrón separado del que usa la cocina — dos `Map` distintos, dos objetos distintos, viviendo en memoria al mismo tiempo.

### `TodoListProjector.ts` — el encargado del pizarrón

Esta es la pieza con más lógica. Su trabajo: escuchar los avisos (eventos) y actualizar el pizarrón acorde.

```ts
subscribeTo(eventBus: EventBusPort): void {
  eventBus.subscribe('TodoListCreated', (event) => this.onTodoListCreated(event));
  eventBus.subscribe('TodoItemAdded', (event) => this.onTodoItemAdded(event));
  // ... uno por cada tipo de evento que existe
}
```

Por cada evento tiene un método que sabe **qué parte del pizarrón tocar**:

- Llega `TodoListCreated` → crea una entrada nueva en el pizarrón, vacía (`items: []`, `completionPercentage: 0`).
- Llega `TodoItemAdded` → busca la lista en el pizarrón, le agrega el item nuevo al array, **recalcula** el `completionPercentage`.
- Llega `TodoItemCompleted` → busca el item, le cambia `status` a `'COMPLETED'`, recalcula el porcentaje.
- Llega `TodoListDeleted` → borra la entrada entera del pizarrón.
- (Y así con rename, cambio de descripción, cambio de prioridad.)

El recálculo de porcentaje lo hace llamando a `TodoListDomainService` — la misma lógica de negocio que ya existía, reusada acá (no la copié de nuevo).

## 3. Los dos arreglos que hicieron falta (y por qué)

Cuando armé todo esto y lo probé, encontré 2 problemas reales que había que arreglar para que el pizarrón quedara bien actualizado. Sin estos arreglos, el read model hubiera quedado **mintiendo**.

### Arreglo 1: el aviso de "item agregado" venía incompleto

El evento `TodoItemAdded` solo llevaba `todoListId`, `todoItemId` y `title`. **No llevaba `description` ni `priority`.**

Pensalo así: el cocinero manda un aviso al pizarrón que dice "agregué un plato llamado Milanesa" pero no le dice de qué tamaño es ni con qué guarnición. El encargado del pizarrón, con esa info incompleta, no tiene más remedio que escribir valores por default (`description: ''`, `priority: 'MEDIUM'`) — **aunque el plato real tenga otros datos**.

Ejemplo concreto de cómo se hubiera roto: en `main.ts` agregamos "Comprar leche" con descripción `'2 litros'` y prioridad `'HIGH'`. Sin este arreglo, el pizarrón hubiera mostrado descripción vacía y prioridad `MEDIUM` — **datos falsos**, aunque la cocina (el aggregate real) tuviera los datos correctos guardados.

**La solución**: agregarle esos 2 campos al evento, y hacer que `TodoList.addItem` se los pase al crear el evento.

```ts
// antes
new TodoItemAdded(this.id.value, item.id.value, item.title)

// después
new TodoItemAdded(this.id.value, item.id.value, item.title, item.description, item.priority)
```

### Arreglo 2: los avisos se mandaban "a los gritos" sin esperar respuesta

El sistema de eventos (`EventBusPort`) funcionaba así: cuando el cocinero terminaba algo, gritaba el aviso y **seguía trabajando sin esperar** a que el encargado del pizarrón terminara de escribir. En términos técnicos: `publish()` no era `async`, no se podía hacer `await` sobre él.

Mientras el encargado del pizarrón hacía trabajo instantáneo (sin pausas), esto no se notaba. Pero el proyector que armamos necesita "pausar" en un punto: cuando busca la lista en el pizarrón antes de modificarla (`await this.readModel.findById(...)`). Ese `await` es una pausa real, aunque sea microscópica.

Si el cocinero no espera a que el encargado termine esa pausa, puede pasar esto:
1. Cocinero termina de crear la lista, grita el aviso, sigue de largo.
2. Antes de que el encargado del pizarrón termine de escribir la lista nueva, el mozo (una query) ya está preguntando "¿existe la lista X?".
3. El pizarrón todavía no la tiene escrita → el mozo dice "no existe" → **error, aunque la lista sí exista en la cocina**.

**La solución**: hacer que `publish()` sea `async` y que el que manda el aviso (`persistAndPublish`, y también `DeleteTodoListInteractor`) haga `await eventBus.publish(...)`. Así el cocinero **no sigue de largo** hasta que el encargado del pizarrón terminó de escribir. Recién ahí el comando (`createTodoList`, `addTodoItem`, etc) le devuelve el control a quien lo llamó.

```ts
// EventBusPort.ts — antes
publish(events: readonly DomainEvent[]): void;

// después
publish(events: readonly DomainEvent[]): Promise<void>;
```

```ts
// InMemoryEventBus.ts — antes: dispara todos los handlers sin esperar ninguno
publish(events) {
  events.forEach(event => {
    handlers.forEach(handler => handler(event));
  });
}

// después: espera cada handler, uno por uno, antes de seguir
async publish(events) {
  for (const event of events) {
    for (const handler of handlers) {
      await handler(event);
    }
  }
}
```

## 4. El recorrido completo, con un ejemplo real

Sigamos el camino de "agregar un item a una lista", paso por paso, con los nombres reales de archivo:

```
1. controller.addItem(...)                                    [TodoListController.ts]
2.   → AddTodoItemInteractor.execute(...)                      [AddTodoItemInteractor.ts]
3.       → list.addItem(title, description, priority)          [TodoList.ts]
4.            → crea el TodoItem real (con sus validaciones)
5.            → guarda un TodoItemAdded en el buffer de eventos del aggregate
6.       → persistAndPublish(list, repository, eventBus, unitOfWork)  [persistAndPublish.ts]
7.            → repository.save(list)          ← guarda en la "cocina" (write side)
8.            → await eventBus.publish(list.domainEvents)   ← manda el aviso, Y ESPERA
9.                 → TodoListProjector.onTodoItemAdded(event)   [TodoListProjector.ts]
10.                      → readModel.findById(listId)   ← busca la lista en el "pizarrón"
11.                      → le agrega el item nuevo al array
12.                      → recalcula completionPercentage con TodoListDomainService
13.                      → readModel.upsert(list)   ← guarda en el "pizarrón" (read side)
14.       → output.presentSuccess({ success: true })
```

Recién en el paso 14 el interactor termina — y para ese momento, el paso 13 **ya pasó**. El pizarrón (read model) ya está al día. Por eso, si justo después alguien llama a `GetTodoListInteractor` (que lee del pizarrón, no de la cocina), va a ver el item nuevo sin problema.

## 5. Cómo quedaron separadas las queries

Antes, `GetTodoListInteractor` y `ListTodoListsInteractor` recibían el mismo repositorio que usan los comandos (`TodoListRepositoryPort`, la cocina). Ahora reciben esto:

```ts
constructor(
  private readonly readModel: Pick<TodoListReadModelPort, 'findById'>,
) {}
```

`Pick<TodoListReadModelPort, 'findById'>` significa "un objeto que tenga *solo* el método `findById`, no me importa si tiene los otros 3". Esto es una barrera que pone TypeScript: aunque le pases el objeto completo (`InMemoryTodoListReadModelRepository`, que sí tiene `upsert`/`remove`), el código de adentro de `GetTodoListInteractor` **no puede ver ni usar** `upsert` ni `remove`, porque su propio tipo declarado no los incluye. Es una forma de decir "esta pieza solo puede leer, ni loca la dejo escribir en el pizarrón" — reforzado por el compilador, no solo por buena voluntad.

## 6. Resumen de archivos

**Nuevos:**
- `2-application/read-model/TodoListReadModel.ts` — forma del dato
- `2-application/ports/out/TodoListReadModelPort.ts` — contrato
- `2-application/read-model/TodoListProjector.ts` — el que actualiza el pizarrón
- `2-application/read-model/TodoListProjector.test.ts` — tests del proyector
- `3-infrastructure/persistence/InMemoryTodoListReadModelRepository.ts` — el pizarrón físico

**Modificados:**
- `1-domain/events/TodoItemAdded.ts` — le agregué `description`/`priority`
- `1-domain/entities/TodoList.ts` — pasa esos 2 campos al crear el evento
- `1-domain/services/TodoListDomainService.ts` — ya no depende de `TodoList`, ahora opera sobre cualquier lista de `{status}` (así lo puede usar tanto el aggregate como el proyector)
- `2-application/ports/out/EventBusPort.ts` — `publish` ahora es `Promise<void>`
- `3-infrastructure/messaging/InMemoryEventBus.ts` — `publish` ahora espera cada handler
- `2-application/shared/persistAndPublish.ts` — ahora hace `await eventBus.publish(...)`
- `2-application/use-cases/commands/delete-todo-list/DeleteTodoListInteractor.ts` — mismo `await`
- `2-application/use-cases/query/get-todo-list/GetTodoListInteractor.ts` — lee del read model
- `2-application/use-cases/query/list-todo-lists/ListTodoListsInteractor.ts` — lee del read model
- `4-generic-implementation/main.ts` — arma el pizarrón, conecta el proyector, las queries ahora apuntan al read model
- Tests de `GetTodoListInteractor`/`ListTodoListsInteractor` — reescritos para sembrar el read model directo, en vez del write repository

## 7. Por qué esto ahora sí es CQRS

Antes: dos carpetas (`commands/`, `query/`) pero **un solo modelo** por debajo (`TodoList`, un solo repositorio). Eso es CQS (Command Query Separation) — separación de responsabilidad a nivel de método, nada más.

Ahora: **dos modelos de datos distintos** (`TodoList` para escribir, `TodoListReadModel` para leer), **dos stores distintos** (`InMemoryTodoListRepository` vs `InMemoryTodoListReadModelRepository`), conectados por un mecanismo de sincronización explícito (el proyector escuchando eventos). Eso ya es CQRS de verdad — la arquitectura que separa cómo escribís de cómo leés.
