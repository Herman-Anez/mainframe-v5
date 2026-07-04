# Observer

## 1. Nombre y clasificación
- **Nombre**: Observer (Observador, también conocido como *Publicación-Suscripción* o *Dependents*)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Definir una dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia de estado, todos sus dependientes son notificados y actualizados automáticamente.** El patrón Observer promueve el bajo acoplamiento entre el sujeto (el que cambia) y los observadores (los que reaccionan al cambio).

## 3. Motivación
Muchos sistemas requieren consistencia entre objetos relacionados sin acoplarlos fuertemente. Por ejemplo, una hoja de cálculo con datos numéricos puede tener múltiples representaciones: una tabla, un gráfico de barras y un gráfico circular. Cuando el usuario modifica los datos en la tabla, todas las vistas deben actualizarse inmediatamente. Si el objeto de datos conociera explícitamente a cada representación, el acoplamiento sería alto y añadir nuevas vistas sería difícil.

El patrón Observer resuelve esto definiendo un sujeto (*Subject*) que mantiene una lista de observadores (*Observers*) y ofrece métodos para agregarlos y eliminarlos. Cuando el estado del sujeto cambia, éste recorre su lista de observadores y les notifica llamando a su método `update()`. Los observadores concretos consultan al sujeto para obtener los datos actualizados. De este modo, el sujeto no necesita conocer detalles de las vistas; solo sabe que son objetos que implementan la interfaz `Observer`.

## 4. Aplicabilidad
Usa Observer cuando:
- Un objeto debe notificar a otros sin hacer suposiciones sobre quiénes son esos objetos (desacoplamiento).
- Una abstracción tiene dos aspectos que dependen uno del otro, y encapsular estos aspectos en objetos separados permite variarlos y reutilizarlos independientemente.
- Un cambio en un objeto requiere cambios en otros, pero no se sabe de antemano cuántos objetos necesitan cambiar.
- Se desea evitar el acoplamiento cíclico (el sujeto no debe conocer a los observadores concretos).

## 5. Estructura
```
┌───────────────────┐       ┌──────────────────────┐
│      Subject      │       │      Observer        │ (interfaz)
├───────────────────┤       ├──────────────────────┤
│ + attach(Observer)│       │ + update()           │
│ + detach(Observer)│       └──────────────────────┘
│ + notify()        │                  △
│ - observers: List │                  │
└───────────────────┘       ┌──────────┴──────────┐
          △                 │                     │
          │          ┌──────────────────┐  ┌──────────────────┐
┌───────────────────┐ │ConcreteObserver1 │  │ConcreteObserver2 │
│ ConcreteSubject   │ ├──────────────────┤  ├──────────────────┤
├───────────────────┤ │ + update()       │  │ + update()       │
│ - state           │ │ - subject        │  │ - subject        │
│ + getState()      │ └──────────────────┘  └──────────────────┘
│ + setState()      │
└───────────────────┘
```
El `Subject` mantiene la lista de observadores y los notifica cuando su estado cambia. Los `ConcreteSubject` implementan el estado concreto y lo exponen mediante `getState()`. Los `ConcreteObserver` se registran en un sujeto y, al recibir la notificación, consultan el estado del sujeto y actualizan su propia representación.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-observerpuml.md).

## 6. Participantes
- **Subject** (`Observable`, `StockMarket`): Conoce a sus observadores. Proporciona interfaz para agregar y eliminar observadores.
- **ConcreteSubject** (`StockMarketData`): Almacena el estado de interés para los observadores. Envía notificaciones cuando su estado cambia.
- **Observer** (`StockObserver`): Define una interfaz para los objetos que deben ser notificados ante cambios en el sujeto.
- **ConcreteObserver** (`ChartView`, `ListView`): Mantiene una referencia a un `ConcreteSubject`. Implementa la interfaz `Observer` para mantener su estado consistente con el del sujeto.

## 7. Colaboraciones
- Los observadores se registran en el sujeto mediante `attach()`.
- Cuando el estado del sujeto cambia (generalmente tras una operación `setState`), el sujeto llama a su propio método `notify()`.
- `notify()` itera sobre la lista de observadores y llama a `update()` en cada uno.
- El `update()` del observador suele consultar al sujeto (via `getState()`) para obtener la información actualizada y actuar en consecuencia.

Existen dos modelos de notificación:
- **Push**: El sujeto envía la información del cambio como parte de la notificación (parámetros en `update()`). Más eficiente, pero puede forzar a los observadores a recibir datos que no necesitan.
- **Pull**: El sujeto solo notifica que algo cambió; el observador consulta al sujeto los datos que le interesan. Más flexible, pero requiere que el observador conozca la interfaz del sujeto.

## 8. Consecuencias
**Ventajas:**
- **Bajo acoplamiento**: El sujeto solo conoce la lista de `Observer`, no sus clases concretas. Se pueden añadir nuevos observadores sin modificar el sujeto.
- **Soporte para comunicación broadcast**: El sujeto notifica a todos los observadores suscritos sin necesidad de especificar destinatarios.
- **Flexibilidad dinámica**: Los observadores pueden suscribirse y desuscribirse en tiempo de ejecución.
- **Separación de responsabilidades (SRP)**: El sujeto se centra en su estado; los observadores en representarlo o reaccionar.

**Desventajas:**
- **Notificaciones en cascada**: Una actualización puede provocar una cadena de actualizaciones si los observadores también modifican al sujeto, lo que puede causar bucles o inconsistencias.
- **Coste de notificación**: Si hay muchos observadores, la iteración puede ser costosa, especialmente si no todos necesitan la actualización (puede mitigarse con un protocolo de interés).
- **Sin orden garantizado**: El orden en que se notifica a los observadores no suele estar definido, lo que puede ser problemático si la secuencia es importante.
- **Peligro de fugas de memoria**: Si los observadores no se desuscriben y el sujeto mantiene referencias fuertes, los observadores no se recolectarán (en lenguajes sin gestión automática de referencias débiles).

## 9. Implementación
**a) Notificación push vs pull**
- *Push*: `update(data1, data2)`. El sujeto envía los datos. Ventaja: el observador no necesita llamar de vuelta. Desventaja: acoplamiento a los parámetros.
- *Pull*: `update()`. El observador luego llama a `subject.getState()`. Ventaja: el observador decide qué datos necesita. Desventaja: requiere que el observador conozca al sujeto concreto.

**b) Registro de observadores**
Normalmente con listas o conjuntos. Hay que decidir si se permiten observadores duplicados. En Java, `java.util.Observable` (obsoleto) y `PropertyChangeListener` siguen este esquema.

**c) Evitar bucles de notificación**
Un observador que modifica al sujeto puede desencadenar otra notificación. Se puede usar un flag para evitar reentradas o realizar la notificación después de completar el cambio.

**d) Hilos y concurrencia**
En entornos multihilo, la lista de observadores debe ser segura para hilos (por ejemplo, copiarla antes de iterar o usar colecciones concurrentes) para evitar `ConcurrentModificationException`.

**e) Observer en lenguajes modernos**
- **Java**: `java.beans.PropertyChangeSupport` para propiedades. También `java.util.Observer`/`Observable` (obsoleta). El paradigma reactivo (RxJava) extiende esta idea.
- **C#**: Eventos (`event` keyword) es una implementación nativa del patrón.
- **Python**: Señales y slots en PyQt, o simples callbacks. El patrón puede implementarse manualmente como se muestra en el ejemplo.

**f) Observadores con interés selectivo (Filtrado)**
Los observadores pueden registrarse solo para ciertos eventos o partes del estado. Esto reduce notificaciones innecesarias.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-observer-java.md) y [Python](ejemplos/03-observer-python.md).)

## 11. Usos conocidos
- **MVC (Model-View-Controller)**: El modelo (sujeto) notifica a las vistas (observadores) cuando cambian los datos.
- **Java Swing**: Los `ActionListener`, `ChangeListener` son observadores de eventos de componentes.
- **Java Message Service (JMS)**: Publicador/Suscriptor.
- **Redes sociales**: Notificaciones a seguidores cuando alguien publica.
- **Sistemas de monitoreo**: Sensores (sujetos) y paneles de control (observadores).
- **Bases de datos y ORM**: Eventos de ciclo de vida de entidades (JPA `@EntityListeners`).

## 12. Patrones relacionados
- **Mediator**: Ambos desacoplan emisor y receptor. En Observer, el sujeto notifica directamente a los observadores; en Mediator, un objeto central coordina las notificaciones.
- **Command**: Las notificaciones de Observer pueden encapsularse como comandos para ser manejadas de forma asíncrona.
- **Chain of Responsibility**: La petición se pasa secuencialmente hasta que alguien la maneja; Observer hace broadcast a todos.
- **MVC**: Observer es la base del mecanismo de notificación del modelo a las vistas.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Memento python](../06-memento/ejemplos/03-memento-python.md) | [🏠 Inicio](../../index.md) | [observer.puml ▶](diagramas/04-observerpuml.md) |
