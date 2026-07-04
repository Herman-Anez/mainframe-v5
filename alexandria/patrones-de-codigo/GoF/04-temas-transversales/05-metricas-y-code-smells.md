# Metricas y code smells

## 1. Relación entre patrones y code smells

Los *code smells* (malos olores de código) son indicadores superficiales de problemas de diseño más profundos. Muchos patrones GoF son el "medicamento" para un code smell específico. Saber reconocer el smell es el primer paso para aplicar el patrón correcto en el momento adecuado.

| Code Smell | Patrón(es) que lo resuelven |
|------------|-----------------------------|
| **Código duplicado** | Template Method, Strategy |
| **Clase grande (God Class)** | State, Strategy, Mediator, Facade (si es un mediador hinchado) |
| **Envidia de datos (Feature Envy)** | Move Method / Move Field (refactorings), Strategy, Visitor |
| **Intimidad inapropiada** | Mediator, Observer, Facade |
| **Switch statements repetidos** | State, Strategy, Command, Visitor |
| **Jerarquías de herencia paralelas** | Bridge, Abstract Factory |
| **Cambios divergentes** | Separar responsabilidades en diferentes clases (SRP) → State, Strategy |
| **Cirugía de escopeta (Shotgun Surgery)** | Facade, Mediator, Observer |
| **Obsesión por los tipos primitivos** | Builder, Abstract Factory, Flyweight |
| **Listas de parámetros largas** | Builder, Introduce Parameter Object |
| **Cadenas de mensajes (Message Chains)** | Facade, Proxy |
| **Indiferencia perezosa (Lazy class)** | Si es demasiado pequeña, eliminar; si es un delegado, ver si es necesario el patrón |

## 2. Métricas para evaluar la complejidad y necesidad de patrones

Ciertas métricas pueden sugerir cuándo un patrón es necesario o cuándo se ha aplicado en exceso.

**a) Profundidad del árbol de herencia (DIT)**
- Un DIT elevado indica uso intensivo de herencia.
- Si hay herencia profunda para variar comportamientos, considerar **Strategy** o **State** (composición sobre herencia).
- Si hay jerarquías paralelas, considerar **Bridge**.

**b) Número de métodos por clase (WMC)**
- Clases con demasiados métodos suelen ser candidatas a extraer comportamientos en patrones: **State** (si depende de estado), **Strategy** (si son variantes de algoritmos), **Decorator** (si son responsabilidades acumuladas).

**c) Acoplamiento entre clases (CBO)**
- Un CBO alto sugiere que una clase conoce demasiadas otras. Patrones como **Mediator** o **Facade** pueden encapsular esas interacciones.
- Ojo: un Mediator mal diseñado puede ser él mismo una clase con alto CBO, pero concentra el acoplamiento en un punto controlado.

**d) Falta de cohesión (LCOM)**
- Clases con baja cohesión (hacen demasiadas cosas no relacionadas) son candidatas a separar responsabilidades usando **Strategy**, **State**, **Command**, etc.

**e) Complejidad ciclomática**
- Un alto valor indica muchos caminos de ejecución dentro de un método, a menudo debido a `if`/`switch` que dependen del estado o del tipo. Patrones como **State**, **Strategy**, **Command** o **Visitor** pueden eliminar esas condicionales.

**f) Número de instancias de una clase (memoria)**
- Si se detecta que una clase se instancia masivamente con pocas variaciones de estado, **Flyweight** puede ser adecuado.

## 3. Code smells específicos del uso incorrecto de patrones

También es posible abusar de los patrones, creando nuevos problemas.

**a) Patronitis (sobreingeniería)**
- Aplicar patrones sin necesidad, "por si acaso". Se manifiesta en un exceso de clases, interfaces e indirección.
- Solución: aplicar YAGNI (You Ain't Gonna Need It). Empezar simple y refactorizar hacia el patrón cuando el dolor sea evidente.

**b) Singletonitis**
- Uso excesivo de Singleton para cualquier objeto que se necesita en varios sitios, convirtiéndolo en una variable global con todos sus problemas (dificultad de testeo, acoplamiento oculto).
- Solución: usar inyección de dependencias; limitar Singleton a verdaderas infraestructuras únicas.

**c) Dios Mediador / Dios Fachada**
- Un Mediator o Facade que concentra demasiada lógica, volviéndose enorme y difícil de mantener.
- Solución: dividir en múltiples mediadores o usar eventos (Observer) para descentralizar.

**d) Decoradores anidados excesivamente**
- Demasiadas capas de decoración dificultan la depuración. No se sabe qué decorador causó un problema.
- Solución: limitar la profundidad de decoración, o usar AOP (Aspect-Oriented Programming) para preocupaciones transversales.

**e) Comando para todo**
- Crear una clase comando para cada operación trivial, multiplicando clases innecesariamente.
- Solución: usar lambdas o funciones para comandos simples; reservar las clases comando para operaciones complejas con undo/redo.

**f) Visitante frágil**
- Aplicar Visitor a una jerarquía que cambia con frecuencia, obligando a modificar todos los visitantes cada vez que se añade un elemento.
- Solución: si la jerarquía de elementos es inestable, usar pattern matching o funciones externas con `isinstance` (asumiendo las desventajas). O reconsiderar la necesidad de Visitor.

**g) Falsa abstracción con Bridge**
- Crear un Bridge cuando solo hay una implementación concreta, añadiendo una interfaz y una clase extra sin beneficio real.
- Solución: esperar hasta que haya al menos dos implementaciones o la necesidad de variarlas independientemente.

## 4. Directrices para la aplicación correcta de patrones

1. **Identifica el problema, no el patrón**: Ante un dolor de diseño (duplicación, acoplamiento, falta de flexibilidad), busca el patrón que alivia ese dolor.
2. **Aplica el patrón mediante refactorización**: No diseñes de más por adelantado. Refactoriza hacia el patrón cuando el código lo pida.
3. **Evalúa las consecuencias**: Cada patrón tiene ventajas y desventajas. Documenta por qué elegiste ese patrón y qué compromisos aceptaste.
4. **Mide la complejidad antes y después**: Si la aplicación del patrón aumentó la complejidad sin mejorar la mantenibilidad, reconsidera.
5. **Usa herramientas de análisis estático**: SonarQube, PMD, Checkstyle pueden detectar code smells que sugieren la necesidad de un patrón.
6. **No adores los patrones**: Son herramientas, no dogmas. Un buen diseño puede no contener ningún patrón GoF explícito y ser excelente.

## 5. Conclusión

Los patrones y los code smells son dos caras de la misma moneda: los smells indican problemas, los patrones ofrecen soluciones. Las métricas proporcionan una base objetiva para decidir cuándo un patrón es necesario y cuándo se está abusando de él. El diseñador experimentado no solo sabe aplicar patrones, sino también cuándo dejar de aplicarlos y volver a una solución más simple. La sabiduría está en el equilibrio.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Combinacion de patrones](04-combinacion-de-patrones.md) | [🏠 Inicio](../index.md) | ➖ |
