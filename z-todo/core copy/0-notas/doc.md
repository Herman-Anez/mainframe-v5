# Módulo de Todo — aplicando DDD

Documentación del dominio (`1-domain/`) en términos de **Domain-Driven Design** (Evans/Vernon): bounded context, lenguaje ubicuo, aggregate, entidades, value objects, domain events, domain services y excepciones de dominio.

Este documento describe el dominio tal como vive en `core/1-domain/` — es **idéntico** en `core-cqrs/1-domain/` (el read model de CQRS es una capa de aplicación/infraestructura por encima, no toca el dominio). Ver `ESTRUCTURA-cqs.md`/`ESTRUCTURA-cqrs.md` para cómo se orquesta desde afuera.

---

## Bounded Context

**"Gestión de listas de tareas"** — un único contexto delimitado, sin integración con otros bounded contexts (no hay usuarios, no hay notificaciones, no hay facturación). Todo el lenguaje ubicuo vive dentro de `TodoList`/`TodoItem`.

## Lenguaje ubicuo

| Término | Significado en el dominio |
|---|---|
| **Lista** (`TodoList`) | Colección de hasta 10 tareas, identificada, con nombre |
| **Item** / **Tarea** (`TodoItem`) | Una tarea dentro de una lista — tiene título, descripción, estado y prioridad |
| **Completar** | Transición de estado `TODO` → `COMPLETED`, irreversible en este modelo (no hay "descompletar") |
| **Prioridad** | `LOW` / `MEDIUM` / `HIGH` — clasificación cerrada, no un texto libre |

---

## Aggregate

Un solo aggregate en todo el módulo:

### `TodoList` — Aggregate Root

`1-domain/entities/TodoList.ts`

Es el **único punto de entrada** para leer o mutar una lista y sus items — nadie fuera del aggregate llama métodos de `TodoItem` directamente. Esto es la regla central de DDD para aggregates: todas las invariantes se protegen pasando por la raíz.

**Invariantes que protege:**
- Máximo 10 items por lista (`addItem` lanza si `_items.length >= 10`).
- No se puede completar un item ya completado (delegado a `TodoItem.complete()`).
- No se puede operar sobre un item que no existe (`findItemOrThrow` lanza `TodoItemNotFoundException`).
- El nombre de la lista siempre es un `Title` válido (constructor privado, solo se construye vía `Title.create`).

**Ciclo de vida:**
- `TodoList.create(name)` — factory estático, único punto de creación válida. Genera un `TodoListId` nuevo y emite `TodoListCreated`.
- `TodoList.fromPersistence(id, name, items)` — reconstrucción desde storage, sin emitir eventos (la historia ya pasó).

**Comportamientos** (todos los métodos públicos que mutan estado, todos devuelven `void` o el dato mínimo necesario — nunca exponen el array interno mutable):
`addItem`, `completeItem`, `renameItem`, `changeItemDescription`, `changeItemPriority`.

**Buffer de domain events:** `TodoList` acumula sus propios eventos en `_domainEvents` (privado) y los expone de solo lectura vía `get domainEvents()`. Quien la persiste es responsable de publicarlos y llamar `clearEvents()` después — el aggregate mismo no sabe que existe un event bus.

---

## Entidades (no-root)

### `TodoItem` — Entidad

`1-domain/entities/TodoItem.ts`

Tiene identidad propia (`TodoItemId`) pero **no es accesible desde afuera del aggregate** — vive únicamente dentro de `TodoList._items`. Encapsula sus 4 value objects y expone comportamientos que valida internamente: `complete()`, `rename()`, `changeDescription()`, `changePriority()`, `isCompleted()`.

---

## Value Objects

`1-domain/value-objects/`. Todos inmutables (constructor privado + `readonly value`), con validación en el momento de construcción — un VO inválido **no puede existir** en memoria.

| VO | Regla de validación | Factory |
|---|---|---|
| `TodoListId` | UUID no vacío | `create()` genera nuevo · `from(value)` reconstruye |
| `TodoItemId` | UUID no vacío | `create()` genera nuevo · `from(value)` reconstruye |
| `Title` | Entre 3 y 100 caracteres, trimmed | `create(value)` |
| `Description` | Hasta 500 caracteres, default `''` | `create(value?)` |
| `Status` | `'TODO' \| 'COMPLETED'` | `todo()` · `completed()` |
| `Priority` | `'LOW' \| 'MEDIUM' \| 'HIGH'` | `low()` · `medium()` · `high()` · `from(string)` |

`Title` es compartido: lo usa tanto `TodoItem` (título de la tarea) como `TodoList` (nombre de la lista) — mismo VO, mismo lugar único donde vive la regla "3 a 100 caracteres".

---

## Domain Events

`1-domain/events/`. Cada uno implementa `DomainEvent { eventName: string; occurredOn: Date }` y carga los datos mínimos necesarios para que un consumidor externo entienda qué pasó sin tener que ir a buscar más:

| Evento | Se emite en |
|---|---|
| `TodoListCreated` | `TodoList.create()` |
| `TodoItemAdded` | `TodoList.addItem()` — lleva `title`, `description`, `priority` (el item completo, no solo el id) |
| `TodoItemCompleted` | `TodoList.completeItem()` |
| `TodoItemRenamed` | `TodoList.renameItem()` |
| `TodoItemDescriptionChanged` | `TodoList.changeItemDescription()` |
| `TodoItemPriorityChanged` | `TodoList.changeItemPriority()` |
| `TodoListDeleted` | *Excepción*: no nace del aggregate — borrar no es una mutación de `TodoList`, es removerla del repositorio. El evento se construye desde la capa de aplicación después de un `delete` exitoso. |

Los eventos son el mecanismo por el cual el dominio comunica "esto pasó" sin acoplarse a quién esté escuchando — en `core-cqrs/` alimentan un proyector que mantiene un read model; en `core/` y `core-cqrs/` por igual, `main.ts` los loguea.

---

## Domain Services

`1-domain/services/TodoListDomainService.ts`

Lógica de negocio que **no pertenece naturalmente a una sola entidad** — calcular el % de completitud de una lista involucra a todos sus items, no es responsabilidad de ninguno en particular.

```ts
static calculateCompletionPercentage(items: readonly { status: string }[]): number
static isFullyCompleted(items: readonly { status: string }[]): boolean
```

Deliberadamente opera sobre `{ status: string }[]` genérico, no sobre `TodoList` — así lo puede invocar tanto la capa de aplicación al reconstruir el aggregate (`core/`) como un proyector que solo tiene items planos, sin entidades (`core-cqrs/`).

---

## Excepciones de dominio

`1-domain/exceptions/`. `DomainException` como base (extiende `Error`, fija `this.name`), y dos subclases tipadas para los casos de "no encontrado": `TodoListNotFoundException`, `TodoItemNotFoundException`. Permiten a quien las atrape distinguir un error de negocio esperado de un error inesperado (`instanceof`).

---

## Repositorio — el puerto de persistencia (visto desde el dominio)

DDD trata al repositorio como parte del **lenguaje del dominio** aunque su implementación viva en infraestructura — es la abstracción "dame/guardame un aggregate completo". En este proyecto el contrato es `TodoListRepositoryPort` (en `2-application/ports/out/`, no en `1-domain/`, siguiendo Clean Architecture): `save`, `findById`, `findAll`, `delete`. Trabaja siempre con el aggregate `TodoList` entero — nunca con partes sueltas de él.

---

## Cómo se orquesta desde afuera del dominio

El dominio no conoce casos de uso, controllers ni presenters — esos son responsabilidad de `2-application/`, `3-adapters/backend/`/`3-adapters/http/` (adapters de entrada, agnósticos a transporte) y los frames (`5-generic-implementation/`, `5-angular/`). En resumen: un **interactor** (caso de uso) carga el aggregate vía el repositorio, le pide que ejecute un comportamiento (`list.addItem(...)`), lo persiste, y publica los eventos que quedaron en su buffer. Detalle completo, con toda la capa de aplicación, en `ESTRUCTURA-cqs.md` (o `ESTRUCTURA-cqrs.md` si te interesa la variante con read model).

---

## Requisitos funcionales

No hay actores diferenciados ni autenticación en el módulo — cualquier invocación de un caso de uso se asume autorizada. Los requisitos están agrupados por la regla de negocio que expresan, con el VO/entidad que la hace cumplir.

| ID | Requisito | Dónde se hace cumplir |
|---|---|---|
| RF-01 | El nombre de una lista debe tener entre 3 y 100 caracteres | `Title.create` |
| RF-02 | El título de un item debe tener entre 3 y 100 caracteres | `Title.create` |
| RF-03 | La descripción de un item, si se especifica, no puede superar los 500 caracteres | `Description.create` |
| RF-04 | La descripción de un item es opcional (default `''`) | `Description.create` |
| RF-05 | La prioridad de un item debe ser `LOW`, `MEDIUM` o `HIGH` — cualquier otro valor se rechaza | `Priority.from` |
| RF-06 | Toda lista nueva empieza sin items | `TodoList.create` |
| RF-07 | Una lista no puede tener más de 10 items | `TodoList.addItem` |
| RF-08 | Todo item nuevo empieza en estado `TODO` | `TodoItem.create` |
| RF-09 | Un item solo puede pasar de `TODO` a `COMPLETED`, nunca al revés | `TodoItem.complete` |
| RF-10 | No se puede completar un item que ya está completado | `TodoItem.complete` |
| RF-11 | No se puede operar sobre una lista que no existe | `TodoListNotFoundException`, en cada interactor |
| RF-12 | No se puede operar sobre un item que no existe dentro de una lista existente | `TodoItemNotFoundException`, en `TodoList.findItemOrThrow` |
| RF-13 | Cada cambio de negocio relevante debe quedar registrado como domain event | Ver tabla de eventos arriba |
| RF-14 | Una escritura fallida no debe dejar cambios parciales persistidos ni eventos publicados | `UnitOfWorkPort` + `persistAndPublish` (rollback antes de relanzar) |
| RF-15 | Debe poder consultarse el % de completitud de una lista y si está 100% completa | `TodoListDomainService` |

---

## Casos de uso

Actor único: **Cliente** (quien invoca el caso de uso — hoy `main.ts`/`TodoListController`, en un sistema real sería una API HTTP, un CLI, etc). Sin AuthN/AuthZ en el alcance del módulo.

### UC-01 — Crear lista de tareas
- **Precondición**: ninguna.
- **Flujo principal**: el cliente pide crear una lista con un nombre → se valida el nombre (RF-01) → se crea la lista vacía (RF-06) → se persiste → se emite `TodoListCreated`.
- **Postcondición**: existe una lista nueva, con id generado, sin items.
- **Excepción**: nombre inválido (< 3 o > 100 caracteres) → error de validación, nada se persiste.

### UC-02 — Agregar item a una lista
- **Precondición**: la lista existe.
- **Flujo principal**: el cliente pide agregar un item (título, descripción opcional, prioridad opcional) → se valida la lista existente (RF-11) → se valida título/descripción/prioridad (RF-02, RF-03, RF-05) → se valida que la lista no supere 10 items (RF-07) → se agrega el item en estado `TODO` (RF-08) → se persiste → se emite `TodoItemAdded`.
- **Postcondición**: la lista tiene un item más.
- **Excepciones**: lista no encontrada, datos inválidos, lista ya con 10 items.

### UC-03 — Completar item
- **Precondición**: la lista y el item existen, el item está en `TODO`.
- **Flujo principal**: el cliente pide completar un item → se valida lista (RF-11) e item (RF-12) → se valida que no esté ya completado (RF-10) → cambia a `COMPLETED` (RF-09) → se persiste → se emite `TodoItemCompleted`.
- **Postcondición**: el item queda en `COMPLETED`, ya no puede volver a completarse.
- **Excepciones**: lista/item no encontrado, item ya completado.

### UC-04 — Renombrar item
- **Precondición**: la lista y el item existen.
- **Flujo principal**: el cliente pide un nuevo título → se valida lista/item → se valida el título (RF-02) → se actualiza → se persiste → se emite `TodoItemRenamed`.
- **Postcondición**: el item tiene el nuevo título.
- **Excepciones**: lista/item no encontrado, título inválido.

### UC-05 — Cambiar descripción de item
- Análogo a UC-04, sobre `description` (RF-03), emite `TodoItemDescriptionChanged`.

### UC-06 — Cambiar prioridad de item
- Análogo a UC-04, sobre `priority` (RF-05), emite `TodoItemPriorityChanged`.

### UC-07 — Borrar lista
- **Precondición**: la lista existe.
- **Flujo principal**: el cliente pide borrar una lista → se valida que exista (RF-11) → se elimina del repositorio (junto con sus items) → se emite `TodoListDeleted`.
- **Postcondición**: la lista y todos sus items dejan de existir.
- **Excepción**: lista no encontrada.
- **Nota**: es el único caso de uso donde el evento no nace del aggregate (ver tabla de eventos).

### UC-08 — Consultar una lista
- **Precondición**: la lista existe.
- **Flujo principal**: el cliente pide una lista por id → se valida que exista (RF-11) → se devuelve la lista con sus items y su % de completitud (RF-15).
- **Postcondición**: ninguna (no muta estado).
- **Excepción**: lista no encontrada.

### UC-09 — Listar todas las listas
- **Precondición**: ninguna (puede devolver un array vacío).
- **Flujo principal**: el cliente pide todas las listas → se devuelven todas, cada una con su % de completitud (RF-15).
- **Postcondición**: ninguna (no muta estado).
- **Excepción**: ninguna.
