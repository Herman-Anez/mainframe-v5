# Combinacion de patrones

## 1. Por qué combinar patrones

Ningún patrón existe aislado en una aplicación real. Los sistemas complejos se construyen combinando múltiples patrones que colaboran para resolver un problema más grande. Los patrones del GoF ya documentan las relaciones entre ellos en la sección "Patrones relacionados", pero aquí exploramos las combinaciones más frecuentes y potentes.

## 2. Combinaciones clásicas en frameworks

**Composite + Visitor**
- Es la combinación más emblemática. El Composite representa la estructura jerárquica y el Visitor añade operaciones externas sin modificar los nodos.
- Ejemplos: árbol sintáctico de un compilador, jerarquía de widgets en un toolkit gráfico.
- El Visitor recorre el Composite llamando a `accept()` en la raíz; cada nodo propaga la visita a sus hijos.

**Factory Method + Template Method**
- El Template Method define el esqueleto de un algoritmo que necesita crear un objeto en algún paso. Ese paso es un Factory Method.
- Ejemplo: `DataMiner.mine()` (Template Method) llama a `createParser()` (Factory Method) para obtener el parser específico del formato.
- Es la base de muchos frameworks: la clase base controla el flujo, la subclase concreta proporciona la factoría.

**Observer + Mediator**
- En un diálogo con múltiples controles, el Mediator centraliza la interacción, pero cada control notifica cambios al mediador mediante Observer.
- Ejemplo: un campo de texto notifica al mediador cuando su contenido cambia (Observer); el mediador decide habilitar/deshabilitar otros controles.
- Así se evita que los controles se observen directamente entre sí.

**Command + Memento**
- Para implementar deshacer/rehacer, antes de ejecutar un comando, se solicita un Memento al originador (el receptor). El comando guarda el Memento; al deshacer, restaura el estado.
- Ejemplo: un editor de texto. Cada `InsertarCommand` crea un memento del documento antes de insertar. Al deshacer, se restaura el memento.

**Decorator + Strategy**
- Un decorador puede envolver una estrategia para añadir comportamiento transversal (logging, métricas) sin modificar la estrategia original.
- Ejemplo: `LoggingStrategy` decora `PaymentStrategy` añadiendo logs antes y después de `pay()`.

**Factory Method + Singleton**
- Una fábrica puede ser Singleton para centralizar la creación de productos, especialmente en Abstract Factory.
- Ejemplo: `GlyphFactory` (Flyweight) es un Singleton que crea y cachea glifos.

**Bridge + Abstract Factory**
- El Bridge separa abstracción e implementación. La Abstract Factory puede crear la implementación concreta y el cliente configura la abstracción con ella.
- Ejemplo: un toolkit gráfico multiplataforma. `GUIFactory` crea el `WindowImpl` adecuado, y el `Window` (abstracción) se configura con él.

**Composite + Iterator**
- Un iterador puede recorrer la estructura Composite en un orden específico (preorden, postorden, por niveles), permitiendo a los clientes procesar los elementos sin conocer la estructura.

**Flyweight + Composite**
- Las hojas de un Composite pueden ser Flyweights para ahorrar memoria cuando hay muchas hojas idénticas. El Composite gestiona el estado extrínseco de cada hoja.
- Ejemplo: un documento de texto donde cada carácter es un Flyweight; el párrafo (Composite) contiene la lista de caracteres con sus posiciones.

**State + Strategy**
- A veces, un estado de una máquina de estados necesita seleccionar entre diferentes algoritmos (estrategias) para realizar su tarea. El estado delega en una estrategia.
- Ejemplo: un semáforo en estado `Verde` puede tener distintas estrategias de duración (día, noche).

## 3. Combinaciones en arquitecturas empresariales

**MVC (Model-View-Controller)**
- El Model es el Sujeto del Observer; la View es el Observador.
- El Controller interpreta las acciones del usuario y puede ejecutar Commands sobre el Model.
- El Model puede usar State para gestionar su estado interno.
- La View es un Composite de widgets, que pueden decorarse (Decorator) para añadir bordes, scroll, etc.

**Inyección de Dependencias (DI) + Abstract Factory + Singleton**
- El contenedor DI actúa como una Abstract Factory que construye objetos. Los beans con ámbito `singleton` son, de hecho, Singletons gestionados por el contenedor.
- Las factorías definidas por el usuario (`@Configuration` con `@Bean`) son implementaciones de Factory Method.

**CQRS + Command + Observer**
- El lado de comandos usa el patrón Command para encapsular las intenciones de escritura.
- El lado de consultas se actualiza mediante eventos (Observer) que publica el lado de comandos tras procesar un comando.

**Saga + Command + State**
- Una saga es una secuencia de comandos locales. Cada paso de la saga es un Command que transiciona el estado (State) de la transacción distribuida.
- Si un paso falla, se ejecutan comandos compensatorios (undo).

## 4. Cómo documentar combinaciones

Al documentar una combinación, es útil:
- Identificar los patrones involucrados y sus roles.
- Explicar cómo se mapean los participantes de un patrón a los del otro.
- Mostrar un diagrama de clases integrado.
- Describir la secuencia de colaboración entre ellos.

## 5. Conclusión

La combinación de patrones es la esencia del diseño de software maduro. No se trata de acumular patrones indiscriminadamente, sino de identificar sinergias donde dos o más patrones resuelven aspectos complementarios de un problema. La propia literatura del GoF ya insinúa estas combinaciones; la experiencia en el diseño de frameworks y arquitecturas las materializa.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Evolucion lenguajes modernos](03-evolucion-lenguajes-modernos.md) | [🏠 Inicio](../index.md) | [Metricas y code smells ▶](05-metricas-y-code-smells.md) |
