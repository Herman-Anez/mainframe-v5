# `2-application/use-cases-ports/http/` — partes y cómo conectarlo

Hoy esta carpeta es **puro contrato, cero ejecución**. Describe los 9 endpoints HTTP como datos, pero nada los sirve — no hay `app.listen`, no hay ningún proceso escuchando un puerto de red. Este doc explica cada pieza y qué hay que escribir (fuera de esta carpeta) para que deje de ser solo forma.

---

## Las piezas, una por una

### `RouteDescriptor.ts` — los tipos compartidos

```ts
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface HttpRequestData {
  params: Record<string, string>;   // /lists/:listId → { listId: '...' }
  query: Record<string, string>;
  body: unknown;
}

export interface RouteDescriptor<TInput = unknown, TOutput = unknown> {
  method: HttpMethod;
  path: string;
  // buildInput PUEDE lanzar RequestValidationError (ver httpValidation.ts)
  buildInput: (request: HttpRequestData) => TInput;
  useCase: UseCase<TInput, TOutput>;          // el genérico de 2-application/shared/
  successStatus: number;
  errorStatus: (error: Error) => number;      // domain/validación/lo-que-sea → status
}
```

`HttpRequestData` es la única forma que le importa a esta carpeta — no es un `Request` de Express ni de nada. Cualquier framework puede producir este shape con un mapeo trivial (`req.params`, `req.query`, `req.body`). Eso es a propósito: la carpeta entera no importa ni una línea de ningún framework.

`useCase` es del tipo `UseCase<TInput, TOutput>` (definido una sola vez en `2-application/shared/UseCase.ts`, mismo genérico que extienden los 9 `XxxUseCase.ts`) — antes esta carpeta re-declaraba un `UseCaseLike`/`OutputBoundaryLike` propio, ya no.

**`buildInput` puede lanzar**: si falta un campo obligatorio del body (`name`, `title`, `newTitle`, `newPriority`) tira `RequestValidationError`. El binder tiene que envolver `buildInput` **y** `useCase.execute` en el mismo `try` y rutear cualquier error por `errorStatus` (ver snippet del binder abajo).

### `routeMetadata.ts` — la tabla `{método, path}`

Única fuente de verdad para "qué método + qué path" tiene cada uno de los 9 casos de uso:

```ts
export const ROUTE_METHOD_PATH = {
  createTodoList: { method: 'POST', path: '/lists' },
  addTodoItem:    { method: 'POST', path: '/lists/:listId/items' },
  // ...9 en total
} as const;
```

La consumen tanto `routes.ts` (servidor) como `apiContract.ts` (cliente) — nunca se duplica.

### `httpErrorStatus.ts` — error → código HTTP

```ts
export function defaultErrorStatus(error: Error): number {
  if (error instanceof RequestValidationError) return 400;   // request mal formado
  if (error instanceof DomainException) {
    switch (error.code) {
      case 'NOT_FOUND':  return 404;
      case 'CONFLICT':   return 409;   // invariante violada por estado (lista llena, item ya completo)
      case 'VALIDATION': return 422;   // dato de negocio inválido (título corto, prioridad inexistente)
    }
  }
  return 500;   // bug no previsto — NO es culpa del cliente
}
```

Todos los invariantes del dominio ahora tiran una subclase de `DomainException` con un `code` (`'NOT_FOUND' | 'CONFLICT' | 'VALIDATION'`); el mapeo es un `switch` sobre ese `code`, no una cadena de `instanceof`. Lo que **no** es `DomainException` (un `TypeError`, un fallo de infra) cae en **500**, no en 400 — antes cualquier error no-404 se reportaba como culpa del cliente.

### `httpBody.ts` + `httpValidation.ts` — leer el body

```ts
// httpBody.ts — fallback silencioso, SOLO para campos opcionales
export function stringField(record, key, fallback = ''): string {
  const value = record[key];
  return typeof value === 'string' ? value : fallback;
}

// httpValidation.ts — corta el request si falta un obligatorio
export class RequestValidationError extends Error { readonly fields: string[]; /* ... */ }
export function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new RequestValidationError([key]);
  }
  return value;
}
```

`requireString` es el seam de validación que faltaba: un `title` faltante o un `priority: 5` (número) cortan en `buildInput` con `RequestValidationError` → 400, en vez del fallback silencioso. `stringField` queda para lo genuinamente opcional (`description`, y `priority` que tiene default `'MEDIUM'`). Sigue sin ser un validador de esquema completo (no chequea longitudes ni enums — eso lo hace el dominio, devolviendo 422); es el piso mínimo para no tragarse un body malformado.

### Las 9 carpetas (`create-todo-list/`, `add-todo-item/`, etc) — un `RouteDescriptor` por caso de uso

Tres formas distintas de `buildInput`, según qué necesita el caso de uso:

```ts
// Solo params, nada de body — CompleteTodoItemRoute.ts
buildInput: (req) => ({ listId: req.params.listId, itemId: req.params.itemId })

// Params + body — AddTodoItemRoute.ts
buildInput: (req) => {
  const body = bodyAsRecord(req.body);
  return {
    listId: req.params.listId,
    title: requireString(body, 'title'),            // obligatorio → 400 si falta
    description: stringField(body, 'description'),    // opcional
    priority: stringField(body, 'priority', 'MEDIUM'),// opcional con default
  };
}

// Nada — ListTodoListsRoute.ts (el caso de uso no toma input real)
buildInput: () => ({})
```

Cada `createXRoute(useCase)` fija los genéricos de `RouteDescriptor<TInput,TOutput>` en su firma — el compilador obliga a que el `buildInput` de esa ruta y el `useCase` que recibe estén de acuerdo en qué tipo de dato esperan (compile-time). En runtime, `requireString` cubre "el campo obligatorio llegó".

**Outputs de comando** (post-restructure): `addTodoItem` devuelve `{ itemId }`; `complete`/`rename`/`changeDescription`/`changePriority` devuelven `{ item: TodoItemView }` (el item ya mutado, así el cliente no re-GETea); `deleteTodoList` no devuelve payload y su `successStatus` es **204**.

### `routes.ts` — junta las 9

```ts
export function createHttpRoutes(useCases: TodoUseCases): RouteDescriptor[] {
  return [
    createCreateTodoListRoute(useCases.createTodoList),
    createAddTodoItemRoute(useCases.addTodoItem),
    // ...9 en total
  ];
}
```

Esta función es el punto de entrada real para conectar un binder — ver la sección de abajo.

### `apiContract.ts` — el contrato para un cliente (no un servidor)

```ts
export const ApiContract: Record<RouteKey, { method: HttpMethod; path: string }> = ROUTE_METHOD_PATH;
export function buildPath(path: string, params: Record<string, string> = {}): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, name) => {
    if (params[name] === undefined) throw new Error(`falta el parámetro "${name}"`);
    return encodeURIComponent(params[name]);
  });
}
```

Sirve para armar URLs sin hardcodear (`buildPath('/lists/:listId/items', { listId }) → '/lists/abc/items'`). No instancia nada de `2-application` en runtime — `ApiContractTypes` es un mapa solo-de-tipos que se borra al compilar.

### `httpExample.ts` — demo de consumo, sin servidor

Arma `fetch`s reales contra `http://localhost:3000` usando `ApiContract`+`buildPath`. Hoy siempre falla ("fetch failed") porque no hay nada en ese puerto. El día que exista el binder, este archivo funciona sin cambiar una línea — sirve como smoke test manual del lado cliente.

### `*.test.ts`

`routes.test.ts` y `apiContract.test.ts` — llaman `buildInput`/`useCase.execute` a mano, simulando un `HttpRequestData`, sin red real. Prueban que el contrato es coherente, no que un servidor funcione (porque no hay servidor).

---

## Cómo conectarlo — el binder que falta

Nada de esto existe todavía. Sería un frame nuevo, mismo patrón que `5-generic-implementation/`, con su propio `package.json`/`main.ts`, por ejemplo `5-express-implementation/`.

### 1. Instalar Express en ese frame nuevo

```bash
mkdir -p core/5-express-implementation
cd core/5-express-implementation
pnpm init
pnpm add express
pnpm add -D @types/express
```

### 2. Composition root — igual que `main.ts`, pero terminando en Express

```ts
// core/5-express-implementation/main.ts
import express from 'express';
import { InMemoryTodoListRepository } from '../4-infrastructure/persistence/InMemoryTodoListRepository';
import { InMemoryEventBus } from '../4-infrastructure/messaging/InMemoryEventBus';
import { InMemoryUnitOfWork } from '../4-infrastructure/unit-of-work/InMemoryUnitOfWork';
import { CreateTodoListInteractor } from '../2-application/use-cases/commands/create-todo-list/CreateTodoListInteractor';
// ...los otros 8 interactores, igual que en 5-generic-implementation/main.ts
import { TodoUseCases } from '../2-application/use-cases/TodoUseCases';
import { createHttpRoutes } from '../2-application/use-cases-ports/http/routes';
import { HttpRequestData, RouteDescriptor } from '../2-application/use-cases-ports/http/RouteDescriptor';

const repository = new InMemoryTodoListRepository();
const eventBus = new InMemoryEventBus();
const unitOfWork = new InMemoryUnitOfWork();

const useCases: TodoUseCases = {
  createTodoList: new CreateTodoListInteractor(repository, eventBus, unitOfWork),
  // ...los otros 8, idéntico a 5-generic-implementation/main.ts
};

const app = express();
app.use(express.json());

for (const route of createHttpRoutes(useCases)) {
  bindRoute(app, route);
}

function bindRoute(app: express.Express, route: RouteDescriptor): void {
  const method = route.method.toLowerCase() as 'get' | 'post' | 'patch' | 'delete' | 'put';
  app[method](route.path, async (req, res) => {
    const requestData: HttpRequestData = {
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      body: req.body,
    };
    try {
      // buildInput Y execute en el mismo try: buildInput puede lanzar
      // RequestValidationError (body sin un campo obligatorio) → 400.
      const input = route.buildInput(requestData);
      await route.useCase.execute(input, {
        presentSuccess: (output) =>
          route.successStatus === 204
            ? res.status(204).end()                       // delete: sin body
            : res.status(route.successStatus).json(output),
        presentError: (error: Error) =>
          res.status(route.errorStatus(error)).json({ error: error.message }),
      });
    } catch (error) {
      res.status(route.errorStatus(error as Error)).json({ error: (error as Error).message });
    }
  });
}

app.listen(3000, () => console.log('Escuchando en http://localhost:3000'));
```

Esto es literalmente **todo el binder** — un loop genérico (`bindRoute`), porque `RouteDescriptor` ya trae todo lo HTTP-específico resuelto (método, path, status codes, mapeo de error). No hay que escribir 9 handlers a mano. El `try` externo cubre el throw sincrónico de `buildInput`; el `presentError` cubre el error del caso de uso — ambos terminan en `route.errorStatus(...)`.

### 3. Probar

```bash
pnpm exec tsx core/5-express-implementation/main.ts
# en otra terminal:
pnpm exec tsx core/2-application/use-cases-ports/http/httpExample.ts
```

`httpExample.ts` va a dejar de fallar — los 9 "fetch failed" pasan a ser respuestas JSON reales.

### Lo que este binder NO resuelve

- **Validación de esquema fina**: `requireString` cubre "el campo obligatorio está y es string". Longitudes, formatos y enums los valida el dominio (→ 422). No hay un Zod/JSON-Schema en el borde; si lo querés, va en `buildInput`.
- `express.json()` default no valida `Content-Type` estrictamente, ni tiene límites de tamaño configurados — para algo más que un demo, conviene revisar eso.
- Sin auth, sin rate limit, sin CORS (para un cliente browser en otro origen hay que agregar `cors` — ver sección del cliente web).

### La alternativa que NO tomás si hacés esto (Opción 2, no elegida acá)

En vez de `routes.ts`, el binder podría usar `TodoListController` (`3-adapters/backend/`) directo — 9 registros de ruta explícitos a mano, porque el Controller no trae status codes ni paths. Elegir uno no excluye reescribir el otro después, pero para una misma ruta HTTP real, se usa uno de los dos, no ambos apilados. Ver `handoff.md` para el detalle completo de esa decisión pendiente.

---

## Conectar un cliente web (browser / SPA)

El servidor de arriba expone JSON en `:3000`. Del otro lado hay una SPA (React, Angular, Vue, lo que sea) que consume esos 9 endpoints. La carpeta ya trae la mitad cliente del contrato: `apiContract.ts`. Falta escribir el **cliente tipado** — un wrapper delgado sobre `fetch` — y, del lado servidor, habilitar CORS.

### Por qué `apiContract.ts` se puede importar en el browser

Es la pieza clave y no es obvio. `apiContract.ts` en **runtime** solo depende de `routeMetadata.ts`, que es un objeto de datos puro (`{ createTodoList: { method: 'POST', path: '/lists' }, ... }`). Cero imports de interactores, cero `node:crypto`, cero infra. Todo lo demás que importa —`CreateTodoListInput`, `GetTodoListOutput`, etc— entra solo en `ApiContractTypes`, que es un **mapa solo-de-tipos**: TypeScript lo borra entero al compilar a JS. El bundler del frontend se lleva ~20 líneas de constantes y nada más.

> **Gap conocido — `verbatimModuleSyntax`**: hoy `apiContract.ts` importa esos tipos con `import { CreateTodoListInput }`, no `import type { ... }`. Con `tsc` default se eliden igual (son `interface`, no emiten runtime). Pero si el build del SPA activa `verbatimModuleSyntax: true` o `isolatedModules` estricto, esos imports intentan resolver un binding de runtime que no existe y el build rompe. Fix trivial: convertirlos a `import type` en `apiContract.ts`.

### El cliente tipado — un wrapper sobre `ApiContract` + `ApiContractTypes`

```ts
// core/6-web-client/apiClient.ts   (o dentro del SPA, si comparten tsconfig/paths)
import { ApiContract, buildPath } from '../2-application/use-cases-ports/http/apiContract';
import type { ApiContractTypes } from '../2-application/use-cases-ports/http/apiContract';

type RouteKey = keyof ApiContractTypes;

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient(baseUrl: string) {
  async function call<K extends RouteKey>(
    key: K,
    args: { params?: Record<string, string>; body?: ApiContractTypes[K]['input'] } = {},
  ): Promise<ApiContractTypes[K]['output']> {
    const { method, path } = ApiContract[key];
    const url = baseUrl + buildPath(path, args.params ?? {});
    const sendsBody = method !== 'GET' && method !== 'DELETE';

    const res = await fetch(url, {
      method,
      headers: sendsBody ? { 'Content-Type': 'application/json' } : undefined,
      body: sendsBody ? JSON.stringify(args.body ?? {}) : undefined,
    });

    const payload = res.status === 204 ? null : await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        payload && typeof payload === 'object' && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : `HTTP ${res.status}`;
      throw new ApiError(res.status, message); // 404, 400, 500... el server ya mapeó
    }
    return payload as ApiContractTypes[K]['output'];
  }

  // Fachada legible: cada método arma params/body y delega en `call`.
  return {
    createTodoList: (name: string) =>
      call('createTodoList', { body: { name } }),

    listTodoLists: () =>
      call('listTodoLists'),

    getTodoList: (listId: string) =>
      call('getTodoList', { params: { listId } }),

    deleteTodoList: (listId: string) =>
      call('deleteTodoList', { params: { listId } }),

    addTodoItem: (listId: string, data: { title: string; description?: string; priority?: string }) =>
      call('addTodoItem', {
        params: { listId },
        body: { listId, title: data.title, description: data.description ?? '', priority: data.priority ?? 'MEDIUM' },
      }),

    completeTodoItem: (listId: string, itemId: string) =>
      call('completeTodoItem', { params: { listId, itemId }, body: { listId, itemId } }),

    renameTodoItem: (listId: string, itemId: string, newTitle: string) =>
      call('renameTodoItem', { params: { listId, itemId }, body: { listId, itemId, newTitle } }),

    changeTodoItemDescription: (listId: string, itemId: string, newDescription: string) =>
      call('changeTodoItemDescription', { params: { listId, itemId }, body: { listId, itemId, newDescription } }),

    changeTodoItemPriority: (listId: string, itemId: string, newPriority: string) =>
      call('changeTodoItemPriority', { params: { listId, itemId }, body: { listId, itemId, newPriority } }),
  };
}

export type TodoApiClient = ReturnType<typeof createApiClient>;
```

`buildPath` mete `listId`/`itemId` en la URL (`/lists/abc/items/xyz/title`). El `buildInput` del servidor lee esos ids desde `req.params`, **no** desde el body — por eso van en `params`. Que el body también los repita es inofensivo: `stringField` del servidor solo saca `title`/`description`/etc, ignora lo que sobra.

### Usarlo

```ts
const api = createApiClient('http://localhost:3000');

const { id: listId } = await api.createTodoList('Compras del súper');
const { itemId } = await api.addTodoItem(listId, { title: 'Comprar leche', priority: 'HIGH' });

// addTodoItem devuelve { itemId } — ya no hace falta re-GET para saber qué se creó.
const { item } = await api.completeTodoItem(listId, itemId);  // → item ya completado
// deleteTodoList responde 204 sin body → el cliente resuelve con undefined.
await api.deleteTodoList(listId);
```

### React — hook

```tsx
// useTodoApi.ts
import { useMemo } from 'react';
import { createApiClient } from './apiClient';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function useTodoApi() {
  return useMemo(() => createApiClient(BASE_URL), []);
}
```

```tsx
// TodoListView.tsx
function TodoListView({ listId }: { listId: string }) {
  const api = useTodoApi();
  const [list, setList] = useState<Awaited<ReturnType<typeof api.getTodoList>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setList(await api.getTodoList(listId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error de red');
    }
  }, [api, listId]);

  useEffect(() => { reload(); }, [reload]);

  async function addItem(title: string) {
    await api.addTodoItem(listId, { title });
    await reload(); // re-GET: el POST no devuelve el item nuevo
  }

  // ...render list.items, list.completionPercentage, etc
}
```

### Angular — service

`ApiContract`/`buildPath` son TS plano sin dependencias de framework, así que se importan tal cual dentro de un `@Injectable`. Reutilizá el mismo `createApiClient` (usa `fetch`, no `HttpClient`) o replicá el patrón con `HttpClient` si querés interceptors/DI de Angular:

```ts
@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly api = createApiClient(environment.apiUrl);

  createList(name: string) { return this.api.createTodoList(name); }
  getList(listId: string)  { return this.api.getTodoList(listId); }
  addItem(listId: string, title: string) { return this.api.addTodoItem(listId, { title }); }
  // ...
}
```

> Los métodos devuelven `Promise`. Si el resto del código Angular espera `Observable`, envolvé con `from(...)` de RxJS en el borde.

### CORS — hay que tocarlo en el binder

Una SPA servida desde `http://localhost:5173` (Vite) pegándole a la API en `:3000` es **otro origen** → el browser bloquea la respuesta salvo que el servidor mande headers CORS. En el `main.ts` del binder Express:

```bash
pnpm add cors && pnpm add -D @types/cors
```

```ts
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173' })); // antes de las rutas
app.use(express.json());
```

Los métodos `PATCH`/`DELETE` que usa este contrato disparan **preflight** `OPTIONS` — el middleware `cors` ya lo responde solo. Si armás CORS a mano, acordate de contestar el `OPTIONS`.

### Manejo de errores en el cliente — `status` → UX

El servidor ya devolvió un status; el cliente solo reacciona:

| status | de dónde viene | qué hacer en la UI |
|--------|----------------|--------------------|
| `400`  | `RequestValidationError` en `buildInput` — falta un campo obligatorio o no es string | bug del cliente: mandaste un body mal armado. Loguear, revisar el form |
| `404`  | `DomainException` code `NOT_FOUND` (`TodoList`/`TodoItem` no existe) | "esa lista/ítem ya no existe" → sacarla del estado, redirigir |
| `409`  | code `CONFLICT` — invariante violada por estado (lista con 10 ítems, ítem ya completado) | mensaje contextual ("la lista está llena", "ese ítem ya estaba completo"); no reintentar igual |
| `422`  | code `VALIDATION` — dato de negocio inválido (`Title` corto/largo, `Priority` fuera del enum) | mostrar `error.message` al lado del campo; el usuario corrige y reintenta |
| `500`  | cualquier cosa que no sea `DomainException` (bug, fallo de infra) | toast genérico "algo salió mal", loguear |

```ts
try {
  await api.addTodoItem(listId, { title });
} catch (e) {
  if (!(e instanceof ApiError)) return showToast('Sin conexión');
  if (e.status === 404) removeListFromState(listId);
  else if (e.status === 409) showToast(e.message);       // conflicto de estado
  else if (e.status === 422) showFieldError(e.message);   // dato inválido, corregible
  else showToast('Algo salió mal');                       // 400 / 500
}
```

### Gaps que golpean directo al cliente

- **Validación de esquema fina sigue del lado del dominio**: `requireString` corta si `title` falta o no es string (→ 400), pero longitud mínima / enum de `priority` los valida el dominio (→ 422). **Validá igual en el cliente antes de mandar** (largo, `priority ∈ {LOW,MEDIUM,HIGH}`) para feedback inmediato en el form, sin round-trip.
- **`priority` no-string se traga en silencio**: en la ruta, `priority` es opcional con default (`stringField(body, 'priority', 'MEDIUM')`), así que `priority: 5` (número) → el server lo ignora y crea el ítem como `MEDIUM`. Un `priority` string pero inválido (`'URGENTE'`) sí devuelve 422. El cliente tiene que garantizar el enum.
- **`completionPercentage` es float sin redondear** (`33.33333...`) → `Math.round(list.completionPercentage)` en el render.
- **Errores 409/422 no traen código de máquina**, solo `message`. Para ramificar por caso puntual ("lista llena" vs "ítem ya completo") hay que parsear el texto o agregar un campo `code` al body de error en el binder.
- **Sin auth, sin rate limit, sin paginación** en `GET /lists` (devuelve todas las listas con todos sus ítems). Fine para demo; a revisar antes de exponerlo.

### Estructura sugerida

```
core/
  2-application/use-cases-ports/http/   ← contrato (ya existe)
  5-express-implementation/             ← binder servidor (a escribir)
    main.ts
  6-web-client/                         ← cliente tipado (a escribir)
    apiClient.ts                        ← createApiClient + ApiError
    package.json
```

El SPA real (Vite/Angular CLI) puede vivir en `6-web-client/` o en un repo aparte; lo único que necesita importar es `apiContract.ts` + `apiClient.ts`. Si es repo aparte, publicá esos dos como paquete o copialos vía build — no arrastran nada de `1-domain`/`4-infrastructure`.
