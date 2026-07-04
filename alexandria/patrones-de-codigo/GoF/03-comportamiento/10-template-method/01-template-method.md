# Template method

## 1. Nombre y clasificación
- **Nombre**: Template Method (Método Plantilla)
- **Clasificación GoF**: Comportamiento, de clase

## 2. Propósito
**Definir el esqueleto de un algoritmo en una operación, difiriendo algunos pasos a las subclases.** El patrón Template Method permite que las subclases redefinan ciertos pasos de un algoritmo sin cambiar su estructura general. Es una técnica fundamental para la reutilización de código y la inversión de control.

## 3. Motivación
Piensa en un framework de minería de datos que procesa archivos de distintos formatos (CSV, JSON, XML). El algoritmo general es siempre el mismo: abrir archivo, leer datos, analizarlos, generar informe y cerrar archivo. Sin embargo, los pasos de "leer datos" y "analizarlos" varían según el formato.

Si se implementara una clase por formato repitiendo la estructura general, se duplicaría el código de los pasos comunes (abrir, cerrar, generar informe). Con el patrón Template Method, la clase base `DataMiner` define el método plantilla `mine(path)`, que invoca secuencialmente `openFile()`, `readData()`, `analyzeData()`, `generateReport()` y `closeFile()`. `openFile()` y `closeFile()` son comunes, mientras que `readData()` y `analyzeData()` son abstractos y se implementan en subclases (`CsvMiner`, `JsonMiner`). La estructura del algoritmo permanece invariable, pero los pasos concretos varían.

## 4. Aplicabilidad
Usa Template Method:
- Para implementar las partes invariantes de un algoritmo una sola vez y dejar que las subclases implementen el comportamiento variable.
- Cuando el comportamiento común entre subclases debe factorizarse en una clase base para evitar duplicación de código.
- Para controlar las extensiones de subclases: una clase base define puntos de extensión (*hooks*) que las subclases pueden o no sobrescribir.
- Para aplicar el **Principio de Hollywood**: "No nos llames; nosotros te llamamos". La clase base llama a las subclases, nunca al revés.

## 5. Estructura
```
┌─────────────────────────┐
│     AbstractClass       │
├─────────────────────────┤
│ + templateMethod()      │  (define el esqueleto del algoritmo)
│ # primitiveOperation1() │  (abstracto o con implementación por defecto)
│ # primitiveOperation2() │
└─────────────────────────┘
                △
                │
┌─────────────────────────┐
│     ConcreteClass       │
├─────────────────────────┤
│ # primitiveOperation1() │
│ # primitiveOperation2() │
└─────────────────────────┘
```
`templateMethod()` es el método plantilla. Llama a los métodos primitivos en el orden definido. Los métodos primitivos son aquellos cuyo comportamiento varía; pueden ser abstractos (obligan a la subclase a implementarlos) o tener una implementación por defecto que la subclase puede sobrescribir opcionalmente (*hooks*).

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-template-methodpuml.md).

## 6. Participantes
- **AbstractClass** (`DataMiner`): Define los métodos primitivos abstractos que las subclases concretas implementarán. Implementa el método plantilla que define el esqueleto del algoritmo, llamando a los métodos primitivos.
- **ConcreteClass** (`CsvMiner`, `JsonMiner`): Implementa los métodos primitivos definidos en `AbstractClass` con los pasos específicos del algoritmo.

## 7. Colaboraciones
- El cliente invoca el método plantilla (`templateMethod()`) sobre una instancia de `ConcreteClass`.
- El método plantilla, definido en la clase base, ejecuta la secuencia de pasos.
- Durante la ejecución, el método plantilla llama a los métodos primitivos implementados en la subclase concreta.
- El flujo de control sigue el **Principio de Hollywood**: la clase base llama a las subclases, no al revés.

## 8. Consecuencias
**Ventajas:**
- **Reutilización de código**: El esqueleto del algoritmo se escribe una sola vez en la clase base y se comparte entre todas las subclases.
- **Inversión de control**: La clase base controla el flujo y llama a las subclases. El framework es el que controla.
- **Flexibilidad controlada**: Las subclases solo pueden variar los pasos permitidos, no la estructura global. Esto protege la integridad del algoritmo.
- **Principio Open/Closed**: Se pueden añadir nuevas variantes del algoritmo creando nuevas subclases sin modificar la clase base.

**Desventajas:**
- **La estructura fija puede limitar**: Si el algoritmo necesita variar en su secuencia, el patrón Template Method es demasiado rígido. En ese caso, se prefiere **Strategy** (composición).
- **Dependencia de la herencia**: Las subclases están ligadas a la clase base mediante herencia, lo que es menos flexible que la composición.
- **Complejidad de depuración**: Al estar el flujo repartido entre la clase base y las subclases, puede ser más difícil seguir la ejecución.
- **Posible violación del Principio de Liskov si no se diseña bien**: Las subclases deben implementar los métodos primitivos respetando el contrato implícito del algoritmo.

## 9. Implementación
**a) Método plantilla `final` (o no virtual)**
Es una buena práctica declarar el método plantilla como `final` en Java (o `sealed` en otros lenguajes) para que las subclases no puedan alterar la estructura del algoritmo.

**b) Métodos primitivos abstractos vs. concretos**
- **Abstractos**: Obligan a la subclase a implementarlos. Se usan para pasos que siempre varían.
- **Concretos con implementación por defecto**: La subclase puede sobrescribirlos si lo necesita, pero no está obligada. Son los llamados **hooks**. Un hook puede no hacer nada (cuerpo vacío) o proporcionar un comportamiento estándar.

**c) Hooks de decisión**
Se pueden añadir hooks que devuelvan un booleano y que el método plantilla consulte para decidir si ejecuta o no ciertos pasos (por ejemplo, `isDataValid()`). Esto da flexibilidad sin romper el esqueleto.

**d) Número de operaciones primitivas**
Para que el patrón tenga sentido, debe haber al menos dos operaciones primitivas que varíen. Si solo hay una, se podría usar Strategy.

**e) Template Method vs Strategy**
- **Template Method**: Usa herencia. La estructura del algoritmo está fija en la clase base; las subclases redefinen pasos.
- **Strategy**: Usa composición. El algoritmo completo se puede reemplazar en tiempo de ejecución. Es más flexible pero puede requerir más clases.

A menudo se puede empezar con Template Method y, si se necesita más flexibilidad, migrar a Strategy.

**f) Nombrar los métodos primitivos**
Es convención usar prefijos como `do` o `perform` para los métodos que deben ser sobrescritos por las subclases, por ejemplo `doReadData()`, `doAnalyze()`.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-template-method-java.md) y [Python](ejemplos/03-template-method-python.md).)

## 11. Usos conocidos
- **Java `InputStream` / `OutputStream`**: La clase `InputStream` define el método plantilla `read(byte[] b, int off, int len)` que internamente llama repetidamente al método primitivo abstracto `read()`. Las subclases como `FileInputStream` solo implementan `read()`.
- **Java Applets y Servlets**: Los métodos `init()`, `service()`, `destroy()` en Servlets son llamados por el contenedor siguiendo un ciclo de vida (método plantilla). El desarrollador sobrescribe `doGet()`, `doPost()`.
- **JUnit**: `TestCase` define `runBare()` como método plantilla que llama a `setUp()`, `runTest()`, `tearDown()`. Las subclases sobrescriben `setUp()` y `tearDown()`.
- **Frameworks de UI**: El bucle principal de eventos es un método plantilla; los manejadores de eventos (`onClick`, `onDraw`) son los métodos primitivos.
- **Spring**: `JdbcTemplate` define el esqueleto para operaciones de base de datos, delegando en callbacks la ejecución de consultas.

## 12. Patrones relacionados
- **Factory Method**: Es un Template Method especializado para crear objetos. El método plantilla llama al Factory Method en un paso del algoritmo.
- **Strategy**: Alternativa a Template Method usando composición. Template Method usa herencia; Strategy es más flexible pero más compleja.
- **Observer**: El método plantilla puede incluir notificaciones a observadores en ciertos pasos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Strategy python](../09-strategy/ejemplos/03-strategy-python.md) | [🏠 Inicio](../../index.md) | [template-method.puml ▶](diagramas/04-template-methodpuml.md) |
