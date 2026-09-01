# Handoff — z-todo

Estado exacto al cierre de esta sesión (2026-08-28), para retomar sin re-explicar todo.

---

## Estado del código

Restructuring de capas **completo y verificado**. Estructura actual de `core/`:

```
core/
  1-domain/                    (sin cambios en toda la sesión)
  2-application/
    ports/out/                  (TodoListRepositoryPort, EventBusPort, UnitOfWorkPort — sin cambios)
    use-cases-ports/
      backend/                   (TodoListControllerPort + dtos/ — puerto, movido acá 2026-09-01)
      http/                      (RouteDescriptor, routeMetadata, apiContract, routes.ts, httpExample.ts, 9 carpetas *Route.ts — movido acá 2026-09-01)
    use-cases/                   (sin cambios)
  3-adapters/
    backend/                    (TodoListController — solo la implementación; el puerto y los dtos se fueron a use-cases-ports/backend/)
  4-infrastructure/              (InMemoryTodoListRepository, InMemoryEventBus, InMemoryUnitOfWork)
  5-generic-implementation/      (frame de consola — composition root main.ts)
  5-angular/                    (frame de SPA real — composition-root.providers.ts)
core-cqrs/                      (CONGELADA — no recibe cambios de core/, nunca)
```

Nombres viejos (`3-backend-interface`, `3-http-interface`, `3-infrastructure`, `4-generic-implementation`, `4-angular`) ya no existen en `core/`. `core-cqrs/` sigue con su numeración vieja a propósito (es un snapshot congelado, documentado en `ESTRUCTURA-cqrs.md`).

**Actualización 2026-09-01**: se movió `3-adapters/http` completo a `2-application/use-cases-ports/http` (era contrato puro, sin adapter real todavía — ahora vive como puerto, simétrico a `ports/out/`). Y se dividió `3-adapters/backend`: `TodoListControllerPort.ts` + `dtos/` (el contrato) se movieron a `2-application/use-cases-ports/backend/`; `TodoListController.ts` (la implementación real, consumida por `main.ts`) se quedó en `3-adapters/backend/` — mismo patrón que `TodoListRepositoryPort` (en `ports/out/`) + `InMemoryTodoListRepository` (en `4-infrastructure/`). Verificado: `tsc --noEmit` limpio, `pnpm test` 35/35, `main.ts` y `httpExample.ts` corren igual.

**Verificación corrida y en verde**: `tsc --noEmit` limpio, `pnpm test` 35/35, `pnpm test:cqrs` 27/27, `main.ts` corre el flujo demo completo, `httpExample.ts` da los 9 "fetch failed" esperados, `pnpm build:angular` compila (se corrigieron además `pnpm-workspace.yaml` y `angular.json`, que habían quedado apuntando a `core/4-angular` tras el rename).

**Docs actualizadas** (barrido de rutas, no de conceptos): `ESTRUCTURA-cqs.md`, `arquitectura.md`, `doc.md`, `angular-implementation.md`. **No tocadas a propósito** (históricas/congeladas): `CAMBIOS-CQRS.md`, `CONVERSACION.md`, `ESTRUCTURA-cqrs.md` (esta última describe `core-cqrs/`, que no cambió).

## Auditoría post-restructure (ya corrida, resultado limpio)

Se lanzó un audit fork completo después del restructuring. Resultado: **cero violaciones arquitectónicas reales**.

- Regla de dependencia respetada: 1-domain no importa nada externo salvo `crypto` (shimmeado en Angular). 2-application nunca importa 4-infrastructure en código de producción (solo tests, usando los adapters in-memory como fakes).
- Los 3 ports de salida correctamente implementados una sola vez cada uno.
- `TodoListControllerPort` genuinamente desacoplado — cero referencias desde ningún interactor ni caso de uso (dato de la auditoría original, cuando el archivo vivía en `3-adapters/backend/`; sigue siendo cierto tras el move del 2026-09-01 a `2-application/use-cases-ports/backend/`).
- `routeMetadata.ts` es fuente de verdad real, sin duplicados.
- Los 9 `*Route.ts` fuerzan tipos en compile-time de verdad vía `RouteDescriptor<TInput,TOutput>`.
- Angular arma el mismo grafo de objetos que `main.ts` (mismos 9 interactores, mismos 3 singletons), via alias a los mismos archivos fuente (no copia).
- 35/35 tests, los 9 interactores cubiertos.
- Nitpick único, inofensivo: `ListTodoListsInput.ts` existe aunque `listLists` no recibe request real (consistencia de patrón, no bug).

**Gaps ya conocidos y siguen vigentes** (no son bugs, son "no implementado todavía"):
1. `2-application/use-cases-ports/http` no tiene binder HTTP real (Express/Fastify/Next) — existe el contrato completo (`RouteDescriptor`, `apiContract.ts`, hasta un ejemplo de consumo `httpExample.ts`) pero nada sirve las rutas.
2. `httpBody.ts` (`stringField`/`bodyAsRecord`) no valida esquema en runtime, solo hace fallback silencioso.
3. Las queries (`GetTodoListInteractor`/`ListTodoListsInteractor`) reconstruyen el aggregate completo para leer — no hay modelo de lectura aplanado en `core/` (eso es lo que sí tiene `core-cqrs/`).
4. `main: "index.js"` en `package.json` raíz apunta a un archivo que no existe (no hay build a `dist/` configurado). Menor, no bloquea nada.

---

## Conversación en curso — conceptos explicados, sin implementar nada todavía

Después de la auditoría, la conversación giró a **explorar cómo se vería un binder HTTP real**, sin llegar a decidir ni construir nada. Puntos cubiertos:

1. **Qué es un "binder"**: el código que toma el contrato (`RouteDescriptor[]`) y lo conecta a un servidor HTTP real que escucha peticiones. Hoy no existe — `routes.ts` es solo descripción de datos, nadie escucha ningún puerto.

2. **Por qué el gap está en HTTP y no en backend**: `3-adapters/backend` (`TodoListController`) ya tiene un consumidor real y funcionando — `5-generic-implementation/main.ts` lo llama in-process, sin red. Está completo. `2-application/use-cases-ports/http` en cambio no tiene ningún proceso sirviéndolo — ese es el gap real.

3. **Camino propuesto si se construye** (no decidido, no iniciado): dos frames nuevos, mismo patrón que ya existe con `5-generic-implementation`/`5-angular`:
   - `5-express-implementation/` (o similar) — binder real, importa `2-application/use-cases-ports/http/routes.ts`, sirve las 9 rutas con Express.
   - Un frame Next.js aparte, del lado cliente, consumiendo `apiContract.ts` con `fetch` real contra ese Express (mismo patrón que `httpExample.ts` pero contra un servidor que sí existe).
   - `2-application/use-cases-ports/http` en sí mismo no "corre" nada — es el plano compartido entre ambos lados (server y cliente), no la implementación.

4. **Dato clave descubierto en esta conversación, no documentado antes explícitamente**: `RouteDescriptor.useCase` es del tipo `UseCaseLike<TInput,TOutput>` — el interactor **directo**, no pasa por `TodoListController`. Es decir, **`2-application/use-cases-ports/http` y `3-adapters/backend` son dos fachadas paralelas e independientes sobre los mismos 9 casos de uso, no una encima de otra.** Si se construye Express, hay que elegir una de dos, no las dos apiladas:
   - **Opción 1**: Express usa `routes.ts`/`RouteDescriptor` tal cual — el binder es un loop genérico (`for (const route of routes) { app[method](path, handler) }`), reusa el trabajo HTTP-específico ya hecho en cada `*Route.ts` (status codes, method, path ya vienen en el dato). `TodoListController` queda sin usar en este camino.
   - **Opción 2**: Express usa `TodoListController` directo — el binder tiene que inventar el mapeo HTTP a mano (9 registros de ruta explícitos, sin status codes ni paths predefinidos, porque el Controller es agnóstico a transporte a propósito). `2-application/use-cases-ports/http` queda sin usar en este camino.
   - Diferencia resumida: Controller no sabe de HTTP (reusable desde cualquier transporte: CLI, gRPC, tests); RouteDescriptor ya sabe de HTTP (menos código de binder, pero nace atado a HTTP).

**Pregunta abierta sin responder todavía**: ¿opción 1 (routes.ts) u opción 2 (controller) si se implementa el binder Express? El usuario no eligió aún — quedó ahí cuando pidió este handoff.

## Próximo paso sugerido al retomar

Preguntar directo: ¿seguimos con la implementación del binder Express (elegir opción 1 o 2 primero), o el objetivo era solo entender el concepto y quedó resuelto con las explicaciones? Si se decide construir, entrar en Plan Mode antes de tocar código — mismo patrón usado toda la sesión para cambios estructurales.
