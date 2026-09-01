# Clean Architecture + Hexagonal Architecture — explicado bien despacio

Este documento explica **cada pieza** de las dos arquitecturas que este proyecto combina, con analogías, sin dar nada por sabido. Son dos nombres para una idea muy parecida, inventados por gente distinta en momentos distintos:

- **Clean Architecture** (Robert C. Martin, "Uncle Bob", ~2012) — la explica como **círculos concéntricos**.
- **Hexagonal Architecture** / **Ports & Adapters** (Alistair Cockburn, ~2005, más viejo) — la explica como un **hexágono con enchufes en cada lado**.

Las dos dicen lo mismo con dibujos distintos: **la lógica de negocio no puede depender de los detalles técnicos**. Este proyecto usa el vocabulario de ambas mezclado, porque en la práctica terminan siendo la misma estructura de carpetas.

---

## Lista de todos los elementos y conceptos

Índice rápido — cada uno se explica en detalle, con código real, más abajo en el documento. Pensalo como un diccionario: si te cruzás un término y no te acordás qué es, volvé acá.

- **Regla de dependencia** — nada de adentro puede importar/conocer algo de afuera. Las flechas de dependencia solo apuntan hacia el centro.
- **Entity** (Clean Architecture) — una regla de negocio tan importante que existiría aunque no hubiera ni base de datos ni pantalla. Acá: `TodoList`, `TodoItem`, value objects, domain events — todo `1-domain/`.
- **Use Case** — una acción concreta que el sistema sabe hacer ("crear lista", "completar item"). Orquesta al dominio, no tiene reglas de negocio propias.
- **Interactor** — el nombre que Clean Architecture le da a la *implementación* de un use case. `CreateTodoListInteractor` es el interactor de `CreateTodoListUseCase`.
- **Input Boundary** — la interfaz que promete "yo sé ejecutar este use case" (acá, los archivos `*UseCase.ts`). Es también un port de entrada.
- **Output Boundary** — la interfaz que el interactor usa para avisar el resultado, sin saber quién la implementa (`presentSuccess`/`presentError`). Acá, los archivos `*OutputBoundary.ts`.
- **DTO** (Data Transfer Object) — un objeto plano, sin comportamiento, que solo transporta datos entre capas. Acá: `*Input.ts`, `*Output.ts`. Nunca es una Entity ni un aggregate completo.
- **Port** — una interfaz que define una forma, sin implementación, como el hueco de un enchufe de pared. No sabe (ni le importa) qué se conecta del otro lado.
- **Port de salida** (*driven port*) — la aplicación pide algo al exterior a través de él. Acá: `TodoListRepositoryPort`, `EventBusPort`, `UnitOfWorkPort`.
- **Port de entrada** (*driving port*) — el exterior le pide algo a la aplicación a través de él. Acá: los `*UseCase.ts`.
- **Adapter** — la implementación real que se enchufa en un port, como el aparato que conectás al enchufe.
- **Adapter de salida** — implementa un port de salida. Acá: `InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork` (en `4-infrastructure/`).
- **Adapter de entrada** — usa un port de entrada para invocar la aplicación desde afuera. Acá: `TodoListController`.
- **Interface Adapters** (capa de Clean Architecture) — donde viven los traductores entre el mundo exterior y el formato que le sirve a la aplicación: controllers, presenters, gateways.
- **Controller** — recibe una petición del mundo exterior y llama al use case correspondiente con el input armado. Acá: `TodoListController implements TodoListControllerPort` (`3-adapters/backend/`) — interfaz separada de su implementación, mismo patrón que el repositorio pero del lado de entrada.
- **Presenter** — recibe el resultado de un use case (vía el Output Boundary) y decide cómo mostrarlo — consola, HTTP, UI. Acá: cada `*Presenter.ts` (`5-generic-implementation/`).
- **Gateway / Repository** — el nombre que se le da al adapter que sabe hablar con almacenamiento persistente. Acá: `InMemoryTodoListRepository` (y su port, `TodoListRepositoryPort`).
- **Frameworks & Drivers** (capa más externa) — bases de datos reales, frameworks web, UI — todo lo 100% intercambiable. Acá: `5-generic-implementation/` (consola), `5-angular/` (SPA real).
- **Composition Root** — el único lugar del código donde se decide qué adapter concreto usar y se arma toda la cadena de dependencias a mano. Acá: `main.ts`.
- **Dependency Inversion Principle (DIP)** — el truco que invierte la flecha de dependencia: en vez de que la aplicación importe infraestructura, la aplicación define una interfaz y es infraestructura quien la importa e implementa. Es lo que hace posible que existan los ports.
- **Humble Object** (bonus, no mencionado antes) — patrón detrás de por qué el `Presenter` es tan tonto (solo `console.log`, sin lógica): separás a propósito el código difícil de testear (formatear para una pantalla real) del código fácil de testear (todo lo demás), para no tener que testear lo difícil.

---

## La idea central, con una analogía

Imaginate un castillo con murallas concéntricas. En el medio, el tesoro (las reglas de negocio — "si una lista tiene 10 items, no dejes agregar más"). Alrededor, una muralla. Alrededor de esa, otra. Afuera de todo, el pueblo (el mundo exterior — bases de datos, consolas, navegadores).

**La regla de oro**: nada de adentro puede saber que existe algo de afuera. El tesoro no sabe que existen murallas. Las murallas no saben que existe el pueblo. Pero el pueblo sí sabe que existen las murallas, y las murallas sí saben que existe el tesoro — el conocimiento fluye **de afuera hacia adentro**, nunca al revés.

En este proyecto, las murallas son carpetas numeradas:

```
1-domain              ← el tesoro. No conoce nada de afuera.
2-application          ← conoce el tesoro, nada más.
3-adapters/backend    ← conoce la aplicación, expone un Controller genérico (adapter de entrada).
3-adapters/http       ← conoce la aplicación, mapea casos de uso a rutas HTTP (otro adapter de entrada).
4-infrastructure       ← conoce la aplicación y el dominio, implementa lo que la app PIDE (ports de salida).
5-generic-implementation ← un pueblo: consola. Conoce todo, arma todo.
5-angular              ← otro pueblo: una SPA real. Conoce todo, arma todo a su manera.
```

`4-infrastructure`, `3-adapters/backend` y `3-adapters/http` son parte del mismo tier de adapters — ninguno es un "pueblo" completo, son kits reusables. Los pueblos (`5-*`) son los que efectivamente corren solos.

Esto no es una opinión ni un estilo — lo puedo **probar** con un comando:

```bash
grep -rln "4-infrastructure" core/1-domain core/2-application --include="*.ts"
# (sin resultados — ni domain ni application importan nada de infraestructura)
```

Cero resultados. Ni un solo archivo de `1-domain/` o `2-application/` (fuera de los tests, que son harness de prueba, no código de producción) importa algo de `4-infrastructure/`. Lo mismo vale para `3-adapters/backend/` y `3-adapters/http/` — ninguno de los dos importa `4-infrastructure` ni ningún `5-*` (salvo, de nuevo, tests usando los adapters in-memory como fakes). Las únicas carpetas que sí importan infraestructura y arman todo son `5-generic-implementation/main.ts` y `5-angular/` — los pueblos, armando el castillo cada uno a su manera.

---

## Pieza 1: Entities (Clean Architecture) = el tesoro

En el vocabulario de Uncle Bob, "Entities" son las reglas de negocio más importantes y más estables — las que existirían **aunque no hubiera ni base de datos, ni internet, ni pantalla**. En este proyecto: `1-domain/`.

```ts
// TodoList.ts
addItem(title: string, description = '', priority = 'MEDIUM'): TodoItem {
  if (this._items.length >= 10) {
    throw new Error('TodoList cannot have more than 10 items');
  }
  ...
}
```

Esta regla ("máximo 10 items") no tiene nada que ver con Postgres, con HTTP, ni con consola. Es pura lógica de negocio. Por eso vive en el círculo más interno — no depende de absolutamente nada técnico.

**Quiénes son**, concretamente: `TodoList` (aggregate), `TodoItem` (entidad), los value objects (`Title`, `Priority`, etc), los domain events, las excepciones de dominio, `TodoListDomainService`. Ver `doc.md` para el detalle DDD de cada uno.

---

## Pieza 2: Use Cases (Clean Architecture) = las reglas de la aplicación

Un "Use Case" es una acción concreta que el sistema puede hacer: "crear una lista", "completar un item". No es una regla de negocio universal (eso ya vive en el dominio) — es **orquestación**: agarrar el dato de entrada, pedirle al dominio que haga su trabajo, guardar el resultado, avisar que terminó.

En este proyecto: `2-application/use-cases/`. Cada caso de uso son 5 archivos siempre con la misma forma:

```
CreateTodoListInput.ts            → qué datos entran (un DTO, un objeto plano)
CreateTodoListOutput.ts           → qué datos salen si sale bien
CreateTodoListOutputBoundary.ts   → el "enchufe" para avisar el resultado (ver Pieza 4)
CreateTodoListUseCase.ts          → el contrato: "esto es capaz de hacer create"
CreateTodoListInteractor.ts       → la implementación real
```

Esto es un patrón específico de Clean Architecture llamado **Input/Output Boundary** — "boundary" en inglés es "frontera". La idea: definir con precisión qué cruza la frontera del caso de uso, para adentro (`Input`) y para afuera (`Output`), como objetos planos sin comportamiento — nunca pasás el objeto `TodoList` completo hacia afuera del use case, pasás un DTO plano armado a mano.

---

## Pieza 3: por qué el interactor nunca hace `return`

Mirá este método:

```ts
async execute(input: CreateTodoListInput, output: CreateTodoListOutputBoundary): Promise<void> {
  try {
    const list = TodoList.create(input.name);
    ...
    output.presentSuccess(response);   // 👈 no hace "return response"
  } catch (error) {
    output.presentError(error as Error);
  }
}
```

Esto puede parecer rebuscado. La razón es la regla de oro de nuevo: si el interactor hiciera `return response` y quien lo llama fuera, por ejemplo, un controller HTTP, el interactor **no sabría** ni le importaría que existe HTTP. Pero al recibir `output` (una interface, el `OutputBoundary`) y llamarle `presentSuccess(...)`, el interactor delega la decisión de "¿cómo le aviso al mundo exterior?" a quien se lo haya pasado — que puede ser un presenter que hace `console.log`, o uno que arma una respuesta HTTP 201, o uno que actualiza una UI. **El interactor nunca necesita saber cuál es.**

Es la misma idea que un empleado de correo: no decide cómo vas a usar el paquete que te entrega, solo te lo entrega. Vos (el `Presenter`) decidís si lo abrís, lo regalás o lo tirás.

---

## Pieza 4: Ports (Hexagonal) = enchufes de pared

Acá es donde entra el nombre "hexagonal": Cockburn dibujó la aplicación como un hexágono, y en cada lado del hexágono puso un **enchufe** (port). Un enchufe de pared de tu casa tiene una forma fija (en Argentina, dos patas redondas). No le importa si conectás una heladera, un cargador de celular o una guitarra eléctrica — mientras el aparato tenga el enchufe correcto, funciona.

En este proyecto, los enchufes son interfaces en `2-application/ports/out/`:

```ts
// TodoListRepositoryPort.ts
export interface TodoListRepositoryPort {
  save(todoList: TodoList): Promise<void>;
  findById(id: TodoListId): Promise<TodoList | null>;
  findAll(): Promise<TodoList[]>;
  delete(id: TodoListId): Promise<void>;
}
```

Esto **no es código que hace nada** — es una forma. Dice "cualquier cosa que sepa `save`/`findById`/`findAll`/`delete` con estas firmas, sirve". El caso de uso (`CreateTodoListInteractor`) recibe este enchufe en su constructor y lo usa sin saber qué hay conectado del otro lado — ¿un `Map` en memoria? ¿Postgres? ¿un archivo de texto? No le importa.

Los 3 enchufes de este proyecto: `TodoListRepositoryPort` (guardar/leer listas), `EventBusPort` (publicar/escuchar eventos), `UnitOfWorkPort` (transacciones).

### Ports de entrada vs. ports de salida

Hay dos direcciones de enchufe:

- **Ports de salida** (los de arriba) — la aplicación **pide algo** al mundo exterior. "Dame la lista con este id". Cockburn los llama *driven ports* (algo de afuera los "maneja"/implementa).
- **Ports de entrada** — el mundo exterior **le pide algo** a la aplicación. En este proyecto son las interfaces `XxxUseCase` (`CreateTodoListUseCase`, etc): "esto es capaz de crear una lista". Cockburn los llama *driving ports* (algo de afuera los "conduce"/invoca).

---

## Pieza 5: Adapters (Hexagonal) = los aparatos que enchufás

Un adapter es la implementación real que se **enchufa** en un port. Siguiendo la analogía: el enchufe de pared es el port, la heladera es el adapter.

```ts
// InMemoryTodoListRepository.ts
export class InMemoryTodoListRepository implements TodoListRepositoryPort {
  private readonly store = new Map<string, TodoList>();
  async save(todoList: TodoList): Promise<void> {
    this.store.set(todoList.id.value, todoList);
  }
  ...
}
```

`implements TodoListRepositoryPort` es literalmente "esta heladera tiene el enchufe correcto". Vive en `4-infrastructure/` — la carpeta de detalles técnicos.

**La prueba de que esto funciona de verdad**, no en teoría: este proyecto tiene **dos adapters distintos** para el lado de lectura, en dos carpetas (`core/` vs `core-cqrs/`), y el dominio + los casos de uso de escritura son **exactamente los mismos archivos, sin un carácter de diferencia**. Cambiar de "leer directo del aggregate" a "leer de un read model separado" fue enchufar un adapter distinto (`InMemoryTodoListReadModelRepository` en vez de reusar `InMemoryTodoListRepository`) sin tocar el dominio. Si mañana quisieras Postgres en vez de memoria, sería el mismo ejercicio: un adapter nuevo, `implements TodoListRepositoryPort`, cero cambios en `1-domain/` o en los interactores.

### Adapters de entrada vs. adapters de salida

- **Adapters de salida** — implementan un port de salida. `InMemoryTodoListRepository`, `InMemoryEventBus`, `InMemoryUnitOfWork`. Viven en `4-infrastructure/`.
- **Adapters de entrada** — usan un port de entrada para invocar la aplicación desde afuera. `TodoListController` es uno: **llama** a `useCase.execute(...)` en cada método. Vive en `3-adapters/backend/` — mismo tier de adapters que `3-adapters/http` y `4-infrastructure`, ninguno es un frame completo: los tres son kits reusables que un frame (`5-generic-implementation`, `5-angular`) importa y completa.

Fijate que `TodoListController` **también** tiene su propio port separado — `TodoListControllerPort.ts`, con las 9 firmas, sin lógica — y `class TodoListController implements TodoListControllerPort`. Mismo patrón exacto que `InMemoryTodoListRepository implements TodoListRepositoryPort`, aplicado ahora del lado de entrada. La diferencia con los ports de aplicación (`AddTodoItemUseCase`, etc): `TodoListControllerPort` no es algo que `2-application` conozca ni necesite — es un contrato interno de este adapter, para que cualquier otra implementación (un fake de test, una versión que loguee cada llamada) pueda sustituir a `TodoListController` sin que quien lo usa se entere. Ver más abajo, Pieza 8, la distinción entre "port de aplicación" y "contrato interno de un adapter".

Otro adapter de entrada, distinto: `3-adapters/http/` — en vez de una clase con un método por caso de uso, describe cada endpoint como **datos** (`RouteDescriptor`: método, path, cómo armar el input) en vez de código imperativo. Mismo rol (adapter de entrada), forma distinta — ver Pieza 6 más abajo.

---

## Pieza 6: Interface Adapters (Clean Architecture) = el círculo que traduce

Uncle Bob le pone nombre a la capa donde viven los controllers, presenters y gateways: **Interface Adapters**. Su trabajo es **traducir** entre el formato que le conviene al mundo exterior y el formato que le conviene al dominio/aplicación — en las dos direcciones.

En este proyecto:

- **`TodoListController.ts`** (`3-adapters/backend/`) — traduce "alguien llamó a `controller.addItem(listId, req, output)`" en "ejecutá el caso de uso `AddTodoItemUseCase` con este input". Recibe el `output` (presenter) como parámetro — no lo instancia, así no se casa con console.log ni con nada concreto.
- **Los `Presenter`** (`CreateTodoListPresenter`, etc, en `5-generic-implementation/api/presenters/`) — traducen "el caso de uso terminó con éxito/error" en "mostralo por consola" (podría ser "armá un JSON de respuesta HTTP", en otro contexto).
- **`RouteDescriptor`** (`3-adapters/http/`) — mismo trabajo que el Controller, pero declarativo: cada `createXRoute(useCase)` describe qué HTTP endpoint corresponde a qué caso de uso, sin ejecutar nada por sí solo.

Ninguno tiene lógica de negocio — solo **formatean**. Por eso son una capa aparte, ni el tesoro (dominio) ni el pueblo (frameworks reales).

---

## Pieza 7: Frameworks & Drivers = el pueblo, afuera de todo

La capa más externa en Clean Architecture: bases de datos reales, frameworks web (Express, NestJS), UI, dispositivos. Todo lo que es 100% intercambiable y no tiene ninguna decisión de negocio.

En este proyecto: `5-generic-implementation/main.ts` — el **composition root**. Es el único lugar del código que:
1. Decide qué adapter concreto usar (`new InMemoryTodoListRepository()` — podría ser `new PostgresTodoListRepository()`).
2. Arma la cadena completa a mano (conecta cada port con su adapter).
3. Arranca el programa.

La carpeta se llama `5-generic-implementation` (y no `4-nest-implementation`, como se llamaba antes) justamente porque **no** compromete con ningún framework real — es el lugar donde iría Express/NestJS/Fastify si quisieras HTTP de verdad, pero hoy es solo wiring manual + un script que corre en consola.

---

## Pieza 8: el truco que hace posible todo esto — Dependency Inversion Principle

Esta es la pieza más importante y la que más cuesta entender. Sin ella, nada de lo anterior sería posible.

**El problema, sin este truco**: normalmente, si `2-application/` necesita guardar una lista en una base de datos, tendría que importar directo el código de Postgres. Eso significa que `2-application` **depende de** `4-infrastructure`. Las flechas de dependencia apuntarían hacia afuera — justo lo que NO queremos (el círculo interno dependiendo del externo).

**El truco (Dependency Inversion Principle, la "D" de SOLID)**: en vez de que `2-application` importe el código real de Postgres, `2-application` **define una interfaz** (`TodoListRepositoryPort`) que dice "necesito algo que sepa hacer esto". Es `4-infrastructure` quien importa esa interfaz y la implementa (`implements TodoListRepositoryPort`).

Date cuenta qué pasó: **se invirtió la dirección de la flecha**. Antes sería `application → infrastructure`. Ahora es `infrastructure → application` (porque `InMemoryTodoListRepository` importa `TodoListRepositoryPort`, que vive en `application`). El código de la aplicación nunca importa nada de infraestructura — es infraestructura la que importa las interfaces de la aplicación.

```ts
// 4-infrastructure/persistence/InMemoryTodoListRepository.ts
import { TodoListRepositoryPort } from '../../2-application/ports/out/TodoListRepositoryPort';
//                                        👆 infraestructura importa aplicación, nunca al revés
```

Esto es lo que permite que el dominio y la aplicación **no sepan que Postgres existe**, aunque en tiempo de ejecución los datos sí terminen viajando hacia Postgres. Quién define el contrato y quién lo implementa son roles invertidos respecto a lo "natural".

### No toda interfaz separada de su implementación es un "port de aplicación"

Ojo con una confusión común: ver `interface X` + `class Y implements X` en dos archivos separados **no significa automáticamente** que sea el patrón de DIP de arriba. Hay dos casos distintos, y este proyecto tiene ejemplos de los dos:

- **Port de aplicación** — `2-application` declara la interfaz porque *necesita* algo (`TodoListRepositoryPort`) o *promete* algo (`AddTodoItemUseCase`) a nivel de negocio, sin saber qué tecnología la va a cumplir. Vive en `2-application`, un adapter en `3-*` la implementa.
- **Contrato interno de un adapter** — `TodoListControllerPort` (`3-adapters/backend/`) es una interfaz igual de válida, con el mismo beneficio (sustituible sin que el consumidor se entere), pero **`2-application` no la conoce ni le importa que exista**. Es un contrato que el adapter se pone a sí mismo para su propia organización interna — no cruza la frontera hacia el dominio/aplicación.

La pregunta que distingue uno de otro: *¿le importaría a `2-application` si esta interfaz desapareciera?* Con `TodoListRepositoryPort`, sí — un interactor la recibe por constructor y la llama. Con `TodoListControllerPort`, no — ningún archivo de `2-application` la menciona ni la necesita. Mismo patrón sintáctico (`interface` + `implements`), rol arquitectónico distinto.

---

## Recorrido completo: una petición cruzando todos los círculos

Sigamos `controller.addItem(...)` capa por capa, nombrando en cada paso qué pieza de arquitectura es:

```
1. TodoListController.addItem(listId, req, presenter)
     ← Interface Adapter (adapter de entrada, en 3-adapters/backend, traduce la llamada)

2. AddTodoItemUseCase.execute(input, presenter)
     ← Port de entrada (la interfaz que promete "sé hacer esto")

3. AddTodoItemInteractor.execute(...)
     ← Use Case (la orquestación real)

4. list.addItem(title, description, priority)
     ← Entity (la regla de negocio: "máximo 10 items", vive en el dominio puro)

5. this.repository.save(list)
     ← llamada a través de un Port de salida (TodoListRepositoryPort)

6. InMemoryTodoListRepository.save(list)
     ← Adapter de salida (implementación real, en infraestructura)

7. output.presentSuccess({ success: true })
     ← llamada a través del Output Boundary

8. AddTodoItemPresenter.presentSuccess(...)
     ← Interface Adapter (adapter de salida, en 5-generic-implementation, traduce a console.log)
```

En cada flecha (`→`), el código de un lado **no conoce el tipo concreto** del otro lado — solo conoce una interfaz. Eso es, en una frase, toda la arquitectura.

---

## Tabla resumen — Clean Architecture ↔ Hexagonal ↔ este proyecto

| Concepto (Clean Architecture) | Concepto (Hexagonal) | Dónde vive acá |
|---|---|---|
| Entities | El núcleo del hexágono | `1-domain/` — `TodoList`, `TodoItem`, VOs, eventos |
| Use Cases | — (Cockburn no separa esto tan fino) | `2-application/use-cases/` — los 9 interactores |
| Input/Output Boundary | Ports de entrada/salida | `*Input.ts`, `*OutputBoundary.ts`, `ports/out/*.ts` |
| — | Ports de salida | `TodoListRepositoryPort`, `EventBusPort`, `UnitOfWorkPort` |
| — | Ports de entrada | `CreateTodoListUseCase`, y los otros 8 `*UseCase.ts` |
| Interface Adapters | Adapters de entrada | `TodoListController implements TodoListControllerPort` (`3-adapters/backend/`), `RouteDescriptor`+rutas (`3-adapters/http/`) |
| Interface Adapters | Adapters de salida | `*Presenter` (`5-generic-implementation/`), `InMemoryTodoListRepository`/`InMemoryEventBus`/`InMemoryUnitOfWork` (`4-infrastructure/`) |
| Frameworks & Drivers | El mundo exterior, fuera del hexágono | `5-generic-implementation/main.ts` (consola), `5-angular/` (SPA real) |
| Dependency Inversion Principle | (el mecanismo que hace posible los ports) | Interfaces en `2-application/ports/`, implementadas en `4-infrastructure/` |

---

## Por qué importa, en una frase

Todo este andamiaje existe para una sola cosa: poder cambiar **cómo** hace algo el sistema (memoria → Postgres, consola → HTTP, un event bus síncrono → Kafka) sin tener que tocar **qué** hace el sistema (las reglas de negocio en `1-domain/` y la orquestación en `2-application/`). La prueba de que funciona no es teórica — es que este proyecto tiene dos implementaciones completas del lado de lectura (`core/` y `core-cqrs/`) compartiendo el mismo dominio, sin una sola línea duplicada ni tocada de más.
