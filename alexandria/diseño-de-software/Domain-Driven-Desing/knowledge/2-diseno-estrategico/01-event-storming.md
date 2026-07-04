# Event storming

**Event Storming** es un taller colaborativo, interactivo y visual diseñado para explorar, modelar y alinear el conocimiento sobre un dominio de negocio complejo. Creado por Alberto Brandolini, se ha convertido en la técnica de facto para arrancar iniciativas de Domain-Driven Design, ya que permite descubrir de forma rápida el lenguaje ubicuo, los Bounded Contexts, los agregados y los flujos de proceso sin caer en discusiones técnicas prematuras.

## Filosofía y principios
- **Todos los participantes importan:** reúne a expertos del dominio, desarrolladores, QA, stakeholders y cualquier rol relevante. No hay espectadores.
- **Sin culpas, sin jerarquías:** se usa un lienzo sin fin (pared o herramienta digital), post-its y un facilitador. Se fomenta la exploración abierta.
- **Centrado en eventos del dominio (hechos que ocurren):** se empieza con eventos en pasado (`PedidoConfirmado`, `PagoRechazado`) porque son innegociables, visibles para el negocio y acotan la discusión.
- **Proceso incremental:** desde una visión de “vista de helicóptero” hasta el diseño detallado del software, en tres fases que pueden realizarse en una sesión larga o en varias iteraciones.

## Materiales y preparación
- **Espacio:** pared larga (o mural digital tipo Miro, Mural) con un rollo de papel continuo.
- **Notas adhesivas:** colores estandarizados, aunque el consenso habitual es:
  - Naranja: *Eventos de dominio* (los más abundantes).
  - Azul: *Comandos* (acciones que provocan eventos).
  - Amarillo: *Agregados* (entidades que garantizan la invariante).
  - Verde: *Read Models / Vistas* (información que necesita un actor).
  - Lila: *Políticas / Reglas de negocio* (reacciones automáticas).
  - Rosa: *Sistemas externos* (pasarelas, ERPs, etc.).
  - Rojo: *Preguntas / Conflictos* (issues que requieren aclaración).
  - Blanco pequeño: *Usuarios / Actores*.
- **Rotuladores negros** (legibles a distancia) y cinta adhesiva.
- **Facilitador neutral** que guíe sin imponer.

## Fase 1: Big Picture (Eventos de dominio en desorden)
Objetivo: capturar la línea de tiempo del proceso de negocio de principio a fin, desde la perspectiva de los eventos que ocurren.

1. **Disparar con el evento inicial y final:** se pide al grupo que identifique el evento que da inicio al flujo principal (ej. `ClienteRealizaPedido` y el evento final `PedidoEntregado`). Se colocan al principio y final del lienzo.
2. **Tormenta de eventos:** cada participante escribe eventos en notas naranjas y los pega cronológicamente entre el inicio y el final. Se fomenta la cantidad sobre la calidad. Las discusiones se anotan en notas rojas (conflictos) y se posponen para no frenar el flujo.
3. **Refinamiento:** una vez que la línea de tiempo está poblada, se revisan secuencias, se añaden eventos faltantes y se eliminan duplicados (fusionando los que describan lo mismo). Los expertos del dominio corrigen la secuencia.
4. **Identificación de pivotes y hotspots:** surgen puntos donde la lógica diverge (caminos alternativos) o donde hay desacuerdo (muchas rojas). Estas áreas marcan complejidad que requerirá profundización posterior.

**Resultado:** un gráfico de la narrativa del dominio expresada únicamente en eventos, comprensible para todos. Emerge un primer esbozo del lenguaje ubicuo. Se pueden identificar subdominios observando agrupaciones naturales de eventos (por ejemplo, los eventos de logística vs los de facturación).

## Fase 2: Process Modeling (Modelado del proceso)
Se añaden los elementos que orquestan los eventos, para entender qué los provoca y cómo se estructura el sistema.

- **Agregar comandos (azules):** para cada evento, se coloca a su izquierda el comando que lo desencadena (`RealizarPedido` → `PedidoRealizado`). Un comando puede fallar, el evento no; el evento es el hecho consumado.
- **Identificar agregados (amarillos):** se levantan las notas amarillas que reciben comandos y generan eventos. Los agregados emergen de la discusión: ¿quién es responsable de mantener la integridad en este paso? `Pedido` recibe `RealizarPedido` y emite `PedidoRealizado`.
- **Políticas (lilas):** reglas de negocio automáticas: “Cuando ocurre `PedidoPagado`, automáticamente se dispara `IniciarPreparacion`”. Se colocan entre eventos y comandos. Revelan lógica reactiva y posibles listeners.
- **Read Models (verdes):** datos que un actor necesita para tomar una decisión (ej. `ListadoPedidosPendientes` para que el operador elija uno y emita `PrepararPedido`). Ayudan a identificar futuras proyecciones CQRS.
- **Actores (blancas) y sistemas externos (rosas):** se asignan responsables de los comandos (personas o sistemas) y se marcan dependencias externas.

**Dinámica:** esta fase ya empieza a segmentar el lienzo. Se notan grupos cohesivos de comandos, agregados y eventos que pertenecen a un mismo contexto. Las zonas de conflicto (muchas rojas, agregados con demasiadas responsabilidades) se hacen evidentes.

**Resultado:** un modelo de procesos rico que captura la lógica de negocio de forma explícita, con un lenguaje común. Aparecen los candidatos a Bounded Contexts: cada isla de alta cohesión en el lienzo se marcará con cinta y se le pondrá un nombre.

## Fase 3: Software Design (Diseño de software)
Focaliza un área concreta (un Bounded Context) para detallar el diseño táctico. Normalmente se hace en sesiones posteriores, a veces solo con el equipo de desarrollo y un experto.

- **Definir agregados con precisión:** se toman los agregados candidatos y se detallan sus invariantes, sus raíces y los objetos internos.
- **Diseñar políticas como manejadores de eventos:** se explicitan las suscripciones entre contextos.
- **Identificar vistas y consultas (CQRS):** se esbozan las proyecciones necesarias para los read models.
- **Mapear contextos y relaciones:** se dibuja un mini context map directamente a partir de los límites encontrados.

**Técnica de “Reverse engineer”:** a veces se empieza por un modelo existente para rediseñarlo, usando eventos de verdad para visualizar el estado actual y el deseado.

## Beneficios en DDD
- **Descubrimiento acelerado del lenguaje ubicuo:** los términos que aparecen repetidamente en los eventos se validan con el experto y quedan fijados.
- **Identificación de Bounded Contexts de forma empírica:** las fronteras no se imponen; surgen de la naturaleza del flujo. Los contextos se nombran en la sesión.
- **Base para Event Sourcing y CQRS:** el énfasis en eventos prepara el terreno para una arquitectura basada en eventos.
- **Alineación multidisciplinar:** compradores, operadores y desarrolladores comparten un entendimiento visual.

## Facilitación y trampas comunes
- **El facilitador no debe dominar la conversación:** asegura que todos peguen notas, frena a los “hiper-detallistas” en la fase Big Picture y guarda los temas espinosos para las rojas.
- **No comenzar con entidades o BD:** empezar por la estructura de datos mata el enfoque en el comportamiento. El mantra es “eventos primero”.
- **Fallo en la duración:** Big Picture puede tomar 3-4 horas; una sesión completa de las tres fases, de 1 a 2 días. Agotar al grupo es contraproducente.
- **Post-its digitales:** las herramientas remotas funcionan, pero se pierde algo de interacción física; se deben usar salas de videoconferencia y facilitador experimentado en dinámicas virtuales.
- **No iterar:** un Event Storming único puede ser insuficiente. Se debe repetir al profundizar en cada contexto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Destilacion core domain](../1-fundamentos/05-destilacion-core-domain.md) | [🏠 Inicio](../index.md) | [Sociotechnical aspects ▶](02-sociotechnical-aspects.md) |
