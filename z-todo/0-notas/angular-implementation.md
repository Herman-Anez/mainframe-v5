# La implementación Angular — explicada bien despacio

`core/4-angular/` es una **cuarta cara** del mismo cubo: el mismo dominio y la misma aplicación (`1-domain/`, `2-application/`) que ya usan `4-generic-implementation/` (consola) y `4-nest-implementation`-style, ahora conectados a una **SPA de Angular real** en vez de un script de consola. Nadie tocó una línea de `1-domain/` ni `2-application/` para que esto funcione — es la prueba número dos (después de `core-cqrs/`) de que Ports & Adapters cumple lo que promete.

Verificado: `pnpm --filter ./core/4-angular build` compila limpio, produce un bundle real de ~300KB.

---

## Parte 1 — Cómo se conecta el núcleo, paso a paso

### El problema a resolver

`1-domain/` y `2-application/` son carpetas de TypeScript puro, pensadas para correr en Node (los tests corren con `tsx` sobre Node). Angular corre en el **navegador**. El navegador no tiene el módulo `crypto` de Node, no sabe qué es un `InjectionToken` de más (eso es cosa de Angular), y su sistema de módulos/build (`ng build`, con Vite/webpack por debajo) no sabe de entrada que `core/1-domain/` existe — por defecto un proyecto Angular solo mira adentro de su propia carpeta `src/`.

Se resuelven 3 problemas puntuales, sin tocar el dominio ni la aplicación:

### 1. Decirle a TypeScript/Angular dónde están las carpetas del núcleo

`core/4-angular/tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "rootDir": "..",                    // 👈 el proyecto puede importar archivos FUERA de 4-angular/
    "paths": {
      "@core-domain/*": ["../1-domain/*"],
      "@core-application/*": ["../2-application/*"],
      "@core-infrastructure/*": ["../3-infrastructure/*"],
      "crypto": ["./src/shims/crypto.ts"]
    }
  }
}
```

`paths` es un diccionario de **alias**: cuando cualquier archivo dentro de `4-angular/` escribe `import { TodoList } from '@core-domain/entities/TodoList'`, TypeScript lo resuelve como si hubiera escrito la ruta relativa real (`../../1-domain/entities/TodoList`). No es una copia — es el **mismo archivo físico** que usan `core/2-application` y `core/4-generic-implementation/main.ts`. Si mañana editás `TodoList.ts`, el cambio aparece automáticamente acá también (a diferencia de `core-cqrs/`, que sí es una copia congelada — ver `CAMBIOS-CQRS.md`).

`rootDir: ".."` es lo que le permite al compilador salir de `4-angular/` y mirar carpetas hermanas (`../1-domain`, `../2-application`, `../3-infrastructure`) sin quejarse.

### 2. Reemplazar `crypto` de Node por su equivalente de navegador

`1-domain/value-objects/TodoListId.ts` tiene `import { randomUUID } from 'crypto'` — el módulo built-in de Node. El navegador no lo tiene, pero **sí** tiene una función que hace exactamente lo mismo, colgada de `globalThis.crypto`:

```ts
// src/shims/crypto.ts
export const randomUUID = (): string => globalThis.crypto.randomUUID();
```

Y en el `tsconfig.json` de arriba, la línea `"crypto": ["./src/shims/crypto.ts"]` le dice al bundler: "cuando alguien pida `crypto`, en vez de buscar el módulo de Node, usá este archivo". `TodoListId.ts` sigue escrito exactamente igual, ni se enteró del cambio — es un **adapter** más (mismo concepto que `InMemoryTodoListRepository`, solo que acá el "port" es literalmente el nombre de un módulo de Node en vez de una interfaz TypeScript).

### 3. Conectar los Ports (interfaces) a Angular DI

Acá está la pieza más importante. `2-application/ports/out/TodoListRepositoryPort.ts` es una `interface` — **no existe en tiempo de ejecución**, TypeScript la borra al compilar a JavaScript. El sistema de Dependency Injection de Angular necesita **algo que sí exista en runtime** para saber qué inyectar en cada lugar. Ese "algo" es un `InjectionToken`:

```ts
// core/tokens.ts
export const TODO_LIST_REPOSITORY = new InjectionToken<TodoListRepositoryPort>('TODO_LIST_REPOSITORY');
export const CREATE_TODO_LIST_USE_CASE = new InjectionToken<CreateTodoListUseCase>('CREATE_TODO_LIST_USE_CASE');
// ... uno por cada port de salida (3) y cada use case (9)
```

Pensalo como una **percha con nombre**: `TodoListRepositoryPort` es el tipo de ropa que puede colgar ahí (una interfaz, solo existe para TypeScript), `TODO_LIST_REPOSITORY` es la percha física con una etiqueta (`'TODO_LIST_REPOSITORY'`) que sí existe en runtime. Angular DI busca por percha, no por tipo de ropa.

Después, `composition-root.providers.ts` es el **equivalente exacto** de `4-generic-implementation/main.ts`, pero expresado en el lenguaje de Angular (`Provider[]`) en vez de `const x = new Y(...)` líneas sueltas:

```ts
// composition-root.providers.ts
{
  provide: CREATE_TODO_LIST_USE_CASE,
  useFactory: (repo, bus, uow) => new CreateTodoListInteractor(repo, bus, uow),
  deps: [TODO_LIST_REPOSITORY, EVENT_BUS, UNIT_OF_WORK],
}
```

Comparalo con `main.ts`:
```ts
const createTodoList = new CreateTodoListInteractor(repository, eventBus, unitOfWork);
```

Es **literalmente lo mismo** — mismo interactor, mismos 3 adapters in-memory (`InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`, sin cambiar ni un import). Lo único que cambia es quién arma la instancia: en `main.ts` lo hacés vos a mano, en Angular se lo delegás al framework, que la arma la primera vez que algo la pide y la reusa después (por default, cada provider es un singleton).

### 4. El problema del `Presenter` — de callback a `Promise`

En `4-generic-implementation/`, cada caso de uso tiene su propio `Presenter` (`CreateTodoListPresenter`, `AddTodoItemPresenter`, ...) que implementa el `OutputBoundary` con `console.log`. En Angular, un componente quiere hacer `await facade.createList(name)` y seguir — no le sirve un callback que imprime por consola, quiere una `Promise`.

En vez de escribir 9 presenters (uno por caso de uso, como en `4-generic-implementation/`), se escribió **uno genérico**, porque los 9 `OutputBoundary` tienen exactamente la misma forma (`presentSuccess`/`presentError`):

```ts
// core/angular-presenter.ts
export class AngularPresenter<TOutput> implements OutputBoundaryLike<TOutput> {
  readonly result: Promise<TOutput>;
  private resolveFn!: (value: TOutput) => void;
  private rejectFn!: (reason: Error) => void;

  constructor() {
    this.result = new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  presentSuccess(output: TOutput): void { this.resolveFn(output); }
  presentError(error: Error): void { this.rejectFn(error); }
}

export async function runUseCase<TInput, TOutput>(useCase, input): Promise<TOutput> {
  const presenter = new AngularPresenter<TOutput>();
  await useCase.execute(input, presenter);
  return presenter.result;   // si el use case llamó presentError, este await tira la excepción
}
```

Truco: arma una `Promise` a mano, guardándose sus propios `resolve`/`reject` (`new Promise((resolve, reject) => {...})` es el único lugar de JavaScript donde podés "sacar" esas dos funciones para usarlas después). Cuando el interactor llama `presentSuccess(output)`, en realidad está resolviendo esa promesa. `runUseCase` es la función que cualquier código de Angular usa para invocar un caso de uso sin pensar en presenters — le da `await` normal y corriente.

### 5. `TodoFacadeService` — el único lugar que toca casos de uso

Ningún componente de Angular llama a un interactor directo. Todos hablan con `TodoFacadeService`, que:
1. Inyecta los 9 `*_USE_CASE` tokens.
2. Expone el estado como **Signals** (`lists`, `currentList`) — ver Parte 2.
3. Cada método (`createList`, `addItem`, `completeItem`, ...) llama `runUseCase(...)` y, si mutó algo, refresca el estado leyendo de nuevo (`refreshLists`/`refreshCurrentList`) — no hay actualización optimista, siempre se vuelve a preguntar al caso de uso de lectura.

### El recorrido completo, de un click a la pantalla

```
1. Usuario tipea un nombre y hace submit en <app-create-todo-list-form>
     → CreateTodoListFormComponent.submit() emite (create)="onCreate($event)"

2. TodoListsPageComponent.onCreate(name)
     → facade.createList(name)

3. TodoFacadeService.createList(name)
     → runUseCase(this.createTodoListUseCase, { name })
          → new AngularPresenter()
          → this.createTodoListUseCase.execute(input, presenter)
               → CreateTodoListInteractor.execute(...)     ← mismo interactor que usa main.ts
                    → TodoList.create(name)                ← mismo dominio, cero cambios
                    → repository.save(list)                ← InMemoryTodoListRepository, mismo adapter
                    → output.presentSuccess(response)       ← resuelve la Promise
     → await refreshLists()
          → runUseCase(this.listTodoListsUseCase, {})
          → this.listsState.set(output.lists)               ← actualiza el Signal

4. Angular detecta que el Signal cambió → vuelve a renderizar la tabla del template
```

Del paso 3 para adentro es **exactamente** lo mismo que ya conocés de `4-generic-implementation/`. Todo lo nuevo de este documento es el paso 1-2-3 (cómo Angular arranca esa cadena) y el paso 4 (cómo Angular la muestra).

---

## Parte 2 — Todos los conceptos de Angular aplicados, explicados

### Standalone Components — sin `NgModule`

Versiones viejas de Angular obligaban a agrupar componentes en clases `@NgModule` (una especie de "caja" que declaraba qué componentes/imports pertenecían juntos). Angular moderno (17+) permite que cada componente declare sus propias dependencias directo:

```ts
@Component({
  selector: 'app-todo-lists-page',
  standalone: true,                              // 👈 no necesita vivir dentro de un NgModule
  imports: [RouterLink, CreateTodoListFormComponent],  // 👈 sus dependencias, declaradas acá mismo
  templateUrl: './todo-lists-page.component.html',
})
```

Analogía: antes tenías que anotar cada mueble en un inventario central de la casa ("living: sofá, mesa, TV"). Ahora cada mueble sabe decir solo "yo necesito estar cerca de un enchufe" — no hace falta el inventario central.

### Dependency Injection — `@Injectable`, `InjectionToken`, `inject()`

Ya lo viste en la Parte 1. Angular tiene su **propio** sistema de inyección de dependencias, separado del que ya usa este proyecto a mano (constructor injection manual en `main.ts`). Tres piezas:

- `@Injectable({ providedIn: 'root' })` — le dice a Angular "esta clase se puede inyectar, y quiero una sola instancia compartida en toda la app" (`TodoFacadeService`).
- `InjectionToken<T>` — la "percha con nombre" para inyectar interfaces (no clases), como los ports.
- `inject(TodoFacadeService)` — la forma moderna de pedir algo inyectado (reemplaza escribirlo como parámetro del constructor). Se usa fuera del constructor, en la declaración del campo: `private readonly facade = inject(TodoFacadeService);`.

### Providers — cómo le decís a Angular qué instancia dar

Un `Provider` es una receta: "cuando alguien pida esta percha, dale esto". Tres formas usadas acá:
- `{ provide: TOKEN, useFactory: (deps) => new Cosa(deps), deps: [...] }` — la más flexible, corre una función para construir el valor (usada para los 3 adapters y los 9 interactores).
- Los providers se registran globalmente en `app.config.ts`, dentro de `ApplicationConfig.providers` — el único lugar de arranque de toda la app.

### Signals — el estado reactivo

Angular moderno (16+) tiene un tipo de variable especial que **avisa sola** cuando cambia:

```ts
private readonly listsState = signal<GetTodoListOutput[]>([]);
readonly lists = this.listsState.asReadonly();
```

`signal([])` crea una cajita con un valor adentro. Para leer el valor la llamás como función: `lists()`. Para cambiarlo, `listsState.set(nuevoValor)`. La diferencia con una variable común: cualquier parte del template que use `lists()` se vuelve a pintar **automáticamente** cuando alguien hace `.set(...)`, sin que tengas que decirle "che, actualizate". `asReadonly()` devuelve una versión que solo se puede leer, no escribir — así el componente puede leer `facade.lists()` pero no puede hacer `facade.lists.set(...)` por afuera del propio servicio (encapsulamiento, mismo espíritu que el `readonly items` de `TodoList.ts`).

### Routing — `provideRouter`, `Routes`, `RouterLink`, `RouterOutlet`, `ActivatedRoute`

```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lists' },
  { path: 'lists', component: TodoListsPageComponent },
  { path: 'lists/:listId', component: TodoListDetailPageComponent },   // 👈 :listId es un parámetro
];
```

- `provideRouter(routes)` (en `app.config.ts`) — activa el router con esa tabla de rutas.
- `<router-outlet />` (en `app.component.html`) — el hueco donde el router pone el componente de la ruta activa. Como el marco de una foto: el marco no cambia, la foto adentro sí.
- `[routerLink]="['/lists', list.id]"` — genera un link de navegación sin recargar la página.
- `ActivatedRoute` (en `TodoListDetailPageComponent`) — cómo un componente lee el parámetro de la URL actual: `this.route.snapshot.paramMap.get('listId')` saca el `:listId` de la URL `/lists/abc-123`.

### Nueva sintaxis de control de flujo en templates — `@if` / `@for`

```html
@if (lists().length === 0) {
  <p>No lists yet.</p>
} @else {
  <table>...</table>
}

@for (list of lists(); track list.id) {
  <tr>...</tr>
}
```

Reemplaza la sintaxis vieja basada en directivas (`*ngIf`, `*ngFor`) por una integrada al propio lenguaje de template, más parecida a código real. `track list.id` le dice a Angular **cómo identificar** cada fila entre un render y el siguiente — así, si solo cambió un item, Angular sabe que no hace falta re-crear las filas de al lado, solo actualizar la que cambió.

### Binding — cómo el template habla con la clase del componente

Tres flechas de comunicación distintas, todas presentes en este proyecto:

- **Interpolación** `{{ item.title }}` — mete un valor de TypeScript en el HTML.
- **Property binding** `[value]="p"` — pasa un valor de TypeScript hacia un atributo/input del elemento.
- **Event binding** `(click)="startEditTitle()"` — ejecuta código de TypeScript cuando pasa un evento del DOM.
- **Two-way binding** `[(ngModel)]="titleDraft"` — combina las dos anteriores: el input muestra `titleDraft` Y actualiza `titleDraft` cuando el usuario tipea. Requiere importar `FormsModule` (se ve en `create-todo-list-form.component.ts` y `todo-item-row.component.ts`).

### `@Input()` / `@Output()` — cómo hablan un componente padre y uno hijo

```ts
// hijo: todo-item-row.component.ts
@Input({ required: true }) item!: TodoItemOutput;   // el padre le PASA el dato
@Output() complete = new EventEmitter<void>();       // el hijo AVISA hacia arriba
```

Analogía: `@Input` es lo que el padre le entrega al hijo cuando lo llama (un argumento). `@Output` es un walkie-talkie que el hijo tiene para avisarle algo al padre sin llamarlo directo — el hijo nunca sabe qué hace el padre con el aviso, solo `emit(...)`. Es el mismo principio que el `OutputBoundary` del núcleo (Parte 1), aplicado a componentes en vez de casos de uso: comunicación a través de un contrato, no una llamada directa.

### `@HostBinding` — el componente decorando su propio elemento

```ts
@Component({ selector: 'tr[app-todo-item-row]', ... })
export class TodoItemRowComponent {
  @HostBinding('class.completed')
  get isCompleted(): boolean { return this.item.status === 'COMPLETED'; }
}
```

El selector `tr[app-todo-item-row]` significa: este componente **no crea un elemento propio**, se aplica sobre un `<tr>` ya existente (útil porque una fila de tabla no puede tener un elemento custom en el medio sin romper el HTML de la tabla). `@HostBinding('class.completed')` le agrega la clase CSS `completed` a ese `<tr>` cuando `isCompleted` es `true` — así se puede tachar visualmente un item completado con puro CSS.

### Zone.js y detección de cambios

```ts
provideZoneChangeDetection({ eventCoalescing: true })
```

Angular necesita enterarse de "algo pasó, tengo que volver a mirar si hay que re-pintar la pantalla". `zone.js` es la librería que intercepta automáticamente eventos, timers y promesas para avisarle a Angular "che, algo terminó, fijate si cambió algo". `eventCoalescing: true` es una optimización: si varios eventos del DOM pasan en el mismo instante, agrupa la re-renderización en una sola pasada en vez de una por evento.

### Bootstrap standalone — `bootstrapApplication`

```ts
// main.ts
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

El punto de entrada real del programa (equivalente al `run().catch(...)` de `4-generic-implementation/main.ts`, pero para una app de navegador en vez de un script de consola). Arranca Angular usando `AppComponent` como raíz y `appConfig` (que incluye `provideTodoComposition()`, ver Parte 1) como configuración global.

### Angular CLI y `angular.json`

`ng serve` (dev, con recarga en caliente), `ng build` (producción, minifica y optimiza), `ng test` (Karma + Jasmine, no usados en este proyecto para el núcleo — los tests de `1-domain`/`2-application` (24 en `core/`, 27 en `core-cqrs/`) siguen corriendo con `node:test` vía `pnpm test`/`pnpm test:cqrs`, fuera de Angular). `angular.json` es el archivo de configuración del CLI: qué build system usar (esbuild/Vite por debajo), dónde está el `index.html`, presupuestos de tamaño de bundle, etc — no hace falta tocarlo para este proyecto.

---

## Cómo correrlo

```bash
pnpm start:angular   # dev server, http://localhost:4200
pnpm build:angular   # build de producción a core/4-angular/dist/
```

(Scripts agregados a `package.json` raíz, que delegan a `core/4-angular` vía `pnpm --filter`.)

---

## Resumen — qué es nuevo acá vs. qué es el mismo núcleo de siempre

| Nuevo en `4-angular/` | Reusado sin cambios de `1-domain`/`2-application`/`3-infrastructure` |
|---|---|
| `tokens.ts`, `composition-root.providers.ts` | Los 9 interactores, sin tocar una línea |
| `angular-presenter.ts` (`AngularPresenter`, `runUseCase`) | Los 9 `OutputBoundary`/`Input`/`Output` |
| `todo-facade.service.ts` | Los 3 ports (`TodoListRepositoryPort`, `EventBusPort`, `UnitOfWorkPort`) |
| `shims/crypto.ts` | Los 3 adapters in-memory (`InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`) |
| Todos los componentes (`*.component.ts`/`.html`) | Todo `1-domain/` — `TodoList`, `TodoItem`, VOs, eventos, excepciones |
| Routing, signals, bindings | `TodoListDomainService` |
