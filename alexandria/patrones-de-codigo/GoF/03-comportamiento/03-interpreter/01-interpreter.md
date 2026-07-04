# Interpreter

## 1. Nombre y clasificación
- **Nombre**: Interpreter (Intérprete)
- **Clasificación GoF**: Comportamiento, de clase

## 2. Propósito
Dado un lenguaje, **definir una representación para su gramática junto con un intérprete** que use dicha representación para interpretar sentencias del lenguaje. El patrón modela cada regla gramatical como una clase, facilitando la implementación de evaluadores para lenguajes sencillos.

## 3. Motivación
Muchas aplicaciones necesitan evaluar expresiones o ejecutar pequeños "lenguajes" definidos por el usuario. Por ejemplo, un motor de reglas de negocio puede necesitar interpretar condiciones como `(edad > 18) AND (nacionalidad == "ES")`. Un buscador podría permitir consultas con operadores lógicos: `gato AND (perro OR pájaro) NOT pez`. Un compilador interpreta y ejecuta código fuente.

Para estos escenarios, el patrón Interpreter sugiere modelar cada regla gramatical (terminales y no terminales) como una clase que implementa una interfaz común `Expression` con un método `interpret(Context)`. Las expresiones terminales (como constantes o variables) devuelven valores directamente. Las no terminales (como operadores AND, OR) contienen otras expresiones y calculan su resultado combinando las interpretaciones de sus subexpresiones.

El cliente construye un árbol sintáctico abstracto (AST) usando estas clases y luego llama a `interpret()` en la raíz, pasando un contexto con los valores de las variables. Esto separa la gramática del intérprete del código cliente y facilita añadir nuevas reglas.

## 4. Aplicabilidad
Usa Interpreter cuando:
- Hay un lenguaje sencillo que necesita ser interpretado y la eficiencia no es una preocupación primordial.
- La gramática es relativamente estable y no se espera que crezca mucho.
- El lenguaje puede representarse como un árbol sintáctico con nodos terminales y no terminales.
- No se requiere un analizador sintáctico (parser) sofisticado; se puede construir el AST manualmente.

No uses Interpreter cuando:
- La gramática es compleja y con muchas reglas: el número de clases crece rápidamente, haciéndolo inmanejable. Para esos casos, es mejor usar herramientas de compilación (ANTLR, YACC).
- El rendimiento es crítico: recorrer el AST para cada interpretación puede ser ineficiente.

## 5. Estructura
```
┌──────────────────────────────┐
│     AbstractExpression       │ (interfaz o clase abstracta)
├──────────────────────────────┤
│ + interpret(Context): Object │
└──────────────────────────────┘
                △
                │
   ┌────────────┴────────────┐
   │                         │
┌──────────────────┐   ┌───────────────────────────┐
│ TerminalExpression│   │ NonterminalExpression     │
├──────────────────┤   ├───────────────────────────┤
│ + interpret()    │   │ - expressions: List<Expr>  │
└──────────────────┘   │ + interpret()             │
                       └───────────────────────────┘
                                △
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
        ┌──────────────────┐    ┌──────────────────┐
        │   OrExpression   │    │  AndExpression   │
        ├──────────────────┤    ├──────────────────┤
        │ + interpret()    │    │ + interpret()    │
        └──────────────────┘    └──────────────────┘

┌──────────────┐
│   Context    │
├──────────────┤
│ + lookup(var)│
│ + assign()   │
└──────────────┘
```
El `Context` contiene información global (valores de variables). Las expresiones terminales consultan el contexto; las no terminales operan con los resultados de sus subexpresiones.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-interpreterpuml.md).

## 6. Participantes
- **AbstractExpression** (`Expression`): Declara una interfaz para interpretar operaciones.
- **TerminalExpression** (`Variable`, `Constant`): Implementa `interpret()` para los símbolos terminales de la gramática (por ejemplo, una variable que busca su valor en el contexto o una constante numérica).
- **NonterminalExpression** (`AndExpression`, `OrExpression`, `NotExpression`): Mantiene referencias a otras `AbstractExpression` (una o varias). Su método `interpret()` combina los resultados de interpretar sus componentes según la regla gramatical.
- **Context** (`Context`): Contiene la información global (valores de variables, estado) necesaria para la interpretación. Se pasa a todas las expresiones.
- **Client**: Construye el AST (manualmente o con un parser simple) y lo interpreta invocando `interpret()` en la raíz, pasando el contexto.

## 7. Colaboraciones
- El cliente crea el árbol sintáctico con instancias de las clases concretas de expresiones.
- El cliente crea un `Context` y lo inicializa con los valores necesarios.
- Invoca `interpret(context)` sobre la expresión raíz.
- Cada nodo no terminal invoca `interpret()` en sus hijos, combinando los resultados según su operación.
- Los nodos terminales obtienen su valor del contexto (o lo tienen como constante).

## 8. Consecuencias
**Ventajas:**
- **Fácil de cambiar y extender la gramática**: Cada regla es una clase. Nuevas reglas se añaden implementando nuevas subclases de `Expression` sin modificar las existentes (principio Open/Closed).
- **Implementación directa de gramáticas sencillas**: Modela la estructura del lenguaje de forma natural y orientada a objetos.
- **Separación de responsabilidades**: Cada clase se encarga de una única regla gramatical (SRP).

**Desventajas:**
- **Explosión de clases**: Gramáticas con muchas reglas generan una clase por regla, volviendo el sistema difícil de mantener.
- **Rendimiento limitado**: La interpretación recursiva puede ser ineficiente para expresiones complejas o bucles. No es adecuado para lenguajes de propósito general.
- **Dificultad para manejar gramáticas complejas**: Carece de análisis sintáctico automático; el cliente debe construir el AST manualmente o con un parser improvisado, lo cual no es escalable.

## 9. Implementación
**a) Definición de la interfaz `interpret()`**
Usualmente toma un `Context` como parámetro y devuelve un `Object` o un tipo más específico (por ejemplo, `boolean` para expresiones lógicas, `int` para aritméticas). Si se necesita tipado fuerte, se puede recurrir a genéricos.

**b) Terminal y NoTerminal**
Las terminales no contienen otras expresiones; las no terminales sí. Una expresión no terminal típica es un operador binario con dos hijos (`left` y `right`).

**c) Construcción del AST**
El cliente puede construir el árbol de forma explícita (hardcoded) o mediante un parser simple (descenso recursivo). En patrones más avanzados, se puede combinar con Builder para construir el AST a partir de tokens.

**d) Evaluación perezosa y optimizaciones**
Se pueden añadir simplificaciones en el AST (por ejemplo, evaluar `true AND X` como `X`). Esto mejora el rendimiento.

**e) Flyweight para terminales**
Si las terminales se repiten mucho (como constantes `true`/`false` o variables comunes), se pueden implementar como Flyweights para ahorrar memoria.

**f) Visitor para operaciones externas**
Para separar la interpretación de la estructura del árbol, se puede aplicar Visitor: el AST acepta un visitor que ejecuta la operación. Esto permite añadir nuevas operaciones (interpretación, impresión bonita, análisis de tipo) sin modificar las clases del AST.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-interpreter-java.md) y [Python](ejemplos/03-interpreter-python.md).)

## 11. Usos conocidos
- **Expresiones regulares**: El patrón Interpreter se usó en las primeras implementaciones de motores de regex.
- **Motores de reglas de negocio**: Interpretar condiciones como `cliente.edad > 18 AND cliente.pais == "ES"`.
- **Búsquedas**: Lenguajes de consulta simples con operadores lógicos (Google, bases de datos no relacionales).
- **SQL parsers simples**: Aunque los parsers completos son generados, los evaluadores de expresiones SQL internos pueden usar este patrón.
- **Editores de texto**: Búsqueda y reemplazo con expresiones regulares internas.
- **Intérpretes de lenguajes de scripting empotrados**: Por ejemplo, un pequeño lenguaje para configurar comportamientos en videojuegos.

## 12. Patrones relacionados
- **Composite**: El árbol sintáctico es un Composite. Las expresiones no terminales son compuestos que contienen otras expresiones.
- **Flyweight**: Los terminales (como variables o constantes) pueden ser compartidos mediante Flyweight si aparecen repetidamente.
- **Visitor**: Separa el comportamiento del intérprete (o cualquier otra operación) de la estructura del AST, evitando mezclar la gramática con la lógica de evaluación.
- **Abstract Factory**: Puede usarse para crear nodos del AST de forma abstracta.
- **Builder**: Puede emplearse para construir el AST a partir de una cadena o tokens.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Command python](../02-command/ejemplos/03-command-python.md) | [🏠 Inicio](../../index.md) | [interpreter.puml ▶](diagramas/04-interpreterpuml.md) |
