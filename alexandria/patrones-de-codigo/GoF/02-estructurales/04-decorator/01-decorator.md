# Decorator

## 1. Nombre y clasificación
- **Nombre**: Decorator (Decorador, también conocido como *Wrapper*)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Añadir responsabilidades adicionales a un objeto de forma dinámica.** Los decoradores proporcionan una alternativa flexible a la herencia para extender funcionalidades, envolviendo un objeto con otro que comparte la misma interfaz.

## 3. Motivación
Imagina un sistema de ventanas donde se desea añadir bordes, barras de desplazamiento o sombras a las ventanas. Si se usara herencia para cada combinación posible (`VentanaConBorde`, `VentanaConScroll`, `VentanaConBordeYScroll`, etc.), la explosión de subclases haría el sistema inmanejable.

El patrón Decorator aborda este problema envolviendo dinámicamente un componente (`Window`) con decoradores que implementan la misma interfaz. Un decorador `BorderDecorator` envuelve una ventana y añade el borde antes/después de delegar la operación `draw()`. El cliente no nota la diferencia, y las combinaciones se logran apilando decoradores en tiempo de ejecución, no mediante herencia estática.

## 4. Aplicabilidad
Usa Decorator cuando:
- Necesitas añadir responsabilidades a objetos individuales de forma dinámica y transparente, sin afectar a otros objetos de la misma clase.
- La extensión mediante herencia es impráctica por la explosión de subclases (combinaciones múltiples e independientes de comportamientos).
- Quieres que las responsabilidades añadidas puedan ser retiradas fácilmente (basta con no envolver con ese decorador).
- La clase base está cerrada a modificación (principio Open/Closed) pero necesitas ampliar su comportamiento.

## 5. Estructura
```
          ┌──────────────────────┐
          │      Component       │ (interfaz o clase abstracta)
          ├──────────────────────┤
          │ + operation()        │
          └──────────────────────┘
                      △
                      │
          ┌───────────┴───────────────┐
          │                           │
┌──────────────────┐        ┌─────────────────────┐
│ ConcreteComponent│        │     Decorator       │ (abstracto, mantiene ref. a Component)
├──────────────────┤        ├─────────────────────┤
│ + operation()    │        │ - component: Component│
└──────────────────┘        │ + operation()       │
                            └─────────────────────┘
                                        △
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                 ConcreteDecoratorA        ConcreteDecoratorB
                 + operation()             + operation()
                 + addedBehavior()         + addedBehavior()
```

- **Component**: Interfaz común para objetos que pueden recibir responsabilidades adicionales.
- **ConcreteComponent**: Objeto original al que se le pueden añadir responsabilidades.
- **Decorator**: Mantiene una referencia a un `Component` y conforma la interfaz de `Component`. Delega la operación al componente envuelto.
- **ConcreteDecorator**: Añade comportamiento antes o después de delegar en el componente.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-decoratorpuml.md).

## 6. Participantes
- **Component** (`Window`): Define la interfaz de los objetos a los que se pueden añadir responsabilidades.
- **ConcreteComponent** (`SimpleWindow`): Objeto base que puede ser decorado.
- **Decorator** (`WindowDecorator`): Clase abstracta que implementa la interfaz `Component` y contiene una referencia a un objeto `Component`. La operación por defecto simplemente delega.
- **ConcreteDecorator** (`BorderDecorator`, `ScrollDecorator`): Añade responsabilidades específicas. Invoca al decorado y luego (o antes) ejecuta su funcionalidad adicional.
- **Client**: Usa la interfaz `Component` y no necesita saber si está tratando con el componente original o con una cadena de decoradores.

## 7. Colaboraciones
- El cliente configura una cadena de decoradores envolviendo el `ConcreteComponent`.
- Cada decorador recibe una llamada, realiza su función adicional y luego reenvía la petición a su componente interno (que puede ser otro decorador o el componente original).
- La solicitud fluye a través de la cadena hasta el componente base.
- El cliente interactúa exclusivamente con la interfaz `Component`, transparente a la existencia de decoradores.

## 8. Consecuencias
**Ventajas:**
- **Mayor flexibilidad que la herencia estática**: Las responsabilidades se pueden añadir y quitar en tiempo de ejecución simplemente envolviendo o desenvolviendo objetos.
- **Evita la explosión de clases**: La combinación de comportamientos se logra apilando decoradores, no creando una clase por cada combinación.
- **Responsabilidades bien separadas**: Cada decorador encapsula un único aspecto añadido. Se cumple el Principio de Responsabilidad Única (SRP).
- **Principio Open/Closed**: El componente original no se modifica; se extiende mediante decoradores.

**Desventajas:**
- **Muchos objetos pequeños**: Un sistema con muchos decoradores crea una miríada de pequeños objetos similares, difíciles de depurar e inspeccionar.
- **Orden de decoración relevante**: El resultado puede depender del orden en que se apilan los decoradores, lo que puede ser fuente de errores si no se controla.
- **La interfaz del componente debe ser ligera**: Si `Component` tiene muchos métodos, los decoradores deben delegarlos todos, lo que genera código repetitivo (aunque puede mitigarse con una clase base `Decorator` que delegue por defecto).
- **No apto para sistemas donde la identidad es importante**: Un objeto decorado es una instancia distinta; no se puede comparar por identidad con el original.

## 9. Implementación
**a) Decorator abstracto vs concreto**
Frecuentemente se define una clase abstracta `Decorator` que almacena la referencia al `Component` y delega todas las operaciones. Los decoradores concretos heredan de ella y solo sobrescriben las operaciones donde añaden comportamiento.

**b) Interfaz del componente**
Para que el patrón sea práctico, la interfaz `Component` debe ser lo más simple posible. Si tiene muchos métodos, los decoradores requieren mucho código de delegación. Una solución es una clase base `Decorator` que delegue todo y subclases que solo sobrescriban lo necesario.

**c) Decoradores ligeros vs pesados**
Si el decorador solo añade comportamiento antes/después sin modificar la lógica central, es ligero. Si necesita sustituir completamente el comportamiento, es pesado y puede romper la transparencia.

**d) Decorador vs Proxy**
Proxy controla el acceso (caching, lazy loading, protección) y mantiene la misma interfaz; Decorator añade funcionalidad. La implementación puede ser casi idéntica, pero la intención es diferente. Un proxy puede no permitir apilar múltiples capas.

**e) Decorator vs Adapter**
Adapter cambia la interfaz; Decorator la mantiene.

**f) Decorator y la herencia**
El decorador se basa en composición, pero hereda de `Component` para garantizar la compatibilidad de tipo. Es una mezcla de composición (delega) y herencia (es-un Component).

**g) Alternativas funcionales**
En lenguajes con funciones de orden superior o traits/mixins, el patrón se simplifica:
- En Python, se pueden usar decoradores de función o closures.
- En Java 8+, con lambdas y `Function` se pueden encadenar comportamientos, aunque para objetos con estado el patrón clásico sigue siendo necesario.

**h) Transparencia**
El cliente debe ser capaz de ignorar la diferencia entre un componente decorado y uno sin decorar. Esto requiere que el decorador no introduzca efectos secundarios visibles a través de la interfaz normal (p.ej., no modificar el tipo de retorno de manera incompatible).

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-decorator-java.md) y [Python](ejemplos/03-decorator-python.md).)

## 11. Usos conocidos
- **Java I/O**: `BufferedReader` es un decorador de `Reader` que añade buffering. `InputStreamReader` adapta (es un Adapter) y luego puede ser decorado con `BufferedReader`. La jerarquía `java.io` está llena de decoradores.
- **Swing**: `JScrollPane` decora cualquier `Component` añadiendo barras de desplazamiento.
- **Python**: Los decoradores de funciones (`@decorator`) son una aplicación del patrón a nivel de funciones, no de objetos.
- **Frameworks web**: Middleware en Express.js, Django, ASP.NET Core: cada middleware envuelve la petición/respuesta añadiendo funcionalidad (logging, autenticación, compresión).

## 12. Patrones relacionados
- **Adapter**: Cambia la interfaz; Decorator la mantiene.
- **Composite**: Ambos se basan en composición recursiva, pero Composite agrega hijos (parte-todo) mientras que Decorator envuelve un único componente para añadir responsabilidades.
- **Strategy**: Strategy cambia las “entrañas” del objeto (algoritmo), Decorator cambia la “piel” (funcionalidad añadida externamente). Se pueden combinar: un decorador que aplica una estrategia.
- **Proxy**: Misma interfaz, pero Proxy controla el acceso; Decorator añade comportamiento.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Composite python](../03-composite/ejemplos/03-composite-python.md) | [🏠 Inicio](../../index.md) | [decorator.puml ▶](diagramas/04-decoratorpuml.md) |
