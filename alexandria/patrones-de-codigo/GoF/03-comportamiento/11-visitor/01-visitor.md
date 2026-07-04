# Visitor

## 1. Nombre y clasificación
- **Nombre**: Visitor (Visitante)
- **Clasificación GoF**: Comportamiento, de objeto

## 2. Propósito
**Representar una operación a realizar sobre los elementos de una estructura de objetos.** El patrón Visitor permite definir una nueva operación sin cambiar las clases de los elementos sobre los que opera. Separa el algoritmo de la estructura del objeto, facilitando la adición de nuevas operaciones sin modificar los elementos ni su jerarquía.

## 3. Motivación
Imagina un árbol sintáctico abstracto (AST) generado por un compilador, con distintos tipos de nodos: `Asignación`, `ExpresiónBinaria`, `Variable`, `Constante`, etc. Sobre este árbol se deben realizar múltiples operaciones: análisis semántico, generación de código, optimización, impresión bonita, cálculo de constantes... Si cada operación se implementara añadiendo un método en cada clase de nodo, los nodos se llenarían de responsabilidades no relacionadas y, lo que es peor, la jerarquía de nodos tendría que modificarse cada vez que se añadiese una nueva operación (violando el Principio Open/Closed).

El patrón Visitor resuelve esto encapsulando cada operación en una clase `Visitor` separada. Cada visitante concreto declara un método `visit` para cada tipo de nodo concreto (sobrecarga o nombre distinto). Los nodos, a su vez, implementan un método `accept(Visitor)` que simplemente llama a `visitor.visit(this)`. Gracias al **doble despacho**, la combinación del tipo de elemento y del tipo de visitante determina qué método concreto se ejecuta. Añadir una nueva operación (por ejemplo, `Optimizador`) se limita a crear un nuevo visitante, sin tocar los nodos. Añadir un nuevo tipo de nodo, sin embargo, obliga a modificar todos los visitantes existentes.

## 4. Aplicabilidad
Usa Visitor cuando:
- Una estructura de objetos contiene muchas clases con interfaces diferentes y quieres realizar operaciones que dependen de esas clases concretas.
- Necesitas realizar operaciones distintas e inconexas sobre una estructura de objetos, y quieres evitar "contaminar" las clases de los elementos con estas operaciones.
- Las clases que definen la estructura rara vez cambian, pero a menudo necesitas definir nuevas operaciones sobre la estructura.
- Quieres mantener juntas las operaciones relacionadas en una sola clase, en lugar de dispersarlas en múltiples clases.

**No uses Visitor si**:
- La jerarquía de elementos cambia con frecuencia: añadir un nuevo elemento concreto obliga a modificar todos los visitantes.
- El número de tipos de elementos es muy grande y las operaciones comparten muy poco; la interfaz del visitante se vuelve enorme.

## 5. Estructura
```
┌───────────────────────┐         ┌──────────────────────────────┐
│       Visitor         │ (interfaz)       ┌──────────────────────┐
├───────────────────────┤         │         Element            │ (interfaz)
│ + visitElementA(A)    │         ├──────────────────────────────┤
│ + visitElementB(B)    │         │ + accept(Visitor)            │
└───────────────────────┘         └──────────────────────────────┘
            △                                     △
            │                                     │
┌───────────────────────┐         ┌──────────────────────────────┐
│  ConcreteVisitor1     │         │     ConcreteElementA         │
├───────────────────────┤         ├──────────────────────────────┤
│ + visitElementA(A)    │         │ + accept(Visitor v)          │
│ + visitElementB(B)    │         │     v.visitElementA(this)    │
└───────────────────────┘         └──────────────────────────────┘
            △                                     △
            │                                     │
┌───────────────────────┐         ┌──────────────────────────────┐
│  ConcreteVisitor2     │         │     ConcreteElementB         │
├───────────────────────┤         ├──────────────────────────────┤
│ + visitElementA(A)    │         │ + accept(Visitor v)          │
│ + visitElementB(B)    │         │     v.visitElementB(this)    │
└───────────────────────┘         └──────────────────────────────┘
```
El cliente crea un visitante concreto y lo pasa a la estructura (típicamente a través de `accept()` en el elemento raíz). Cada elemento llama al método `visit` correspondiente del visitante, pasándose a sí mismo como argumento.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-visitorpuml.md).

## 6. Participantes
- **Visitor** (`NodeVisitor`): Declara una operación `visit` para cada clase de elemento concreto en la estructura de objetos. El nombre y la firma del método identifican la clase que envía la petición al visitante.
- **ConcreteVisitor** (`TypeChecker`, `CodeGenerator`): Implementa cada operación declarada por `Visitor`. Cada operación implementa un fragmento del algoritmo, y el visitante mantiene el estado local (acumulando resultados, por ejemplo).
- **Element** (`ASTNode`): Define una operación `accept()` que toma un visitante como argumento.
- **ConcreteElement** (`Assignment`, `Variable`): Implementa `accept()`, que típicamente se limita a invocar `visitor.visitConcreteElement(this)`.
- **ObjectStructure**: Normalmente una colección de elementos (como un árbol). Puede proporcionar una interfaz para permitir al visitante recorrer sus elementos. Puede ser un Composite, una lista, etc.

## 7. Colaboraciones
- El cliente crea un `ConcreteVisitor` y se lo pasa al primer elemento de la estructura mediante `accept()`.
- Cada elemento invoca el método `visit` adecuado del visitante, pasándose a sí mismo.
- El visitante ejecuta la operación; para continuar el recorrido, puede llamar a `accept()` en los hijos del elemento (si la estructura es un árbol o grafo), propagando la visita.
- El visitante acumula estado mientras recorre la estructura.

## 8. Consecuencias
**Ventajas:**
- **Facilidad para añadir nuevas operaciones**: Un nuevo visitante concreto añade una nueva operación sin modificar los elementos. Principio Open/Closed en el eje de las operaciones.
- **Separa operaciones de la estructura**: El código de la operación se concentra en el visitante; los elementos permanecen centrados en sus datos.
- **Acumulación de estado**: El visitante puede acumular información mientras recorre la estructura, sin necesidad de pasarla como parámetros o variables globales.

**Desventajas:**
- **Dificultad para añadir nuevos elementos**: Cada nuevo `ConcreteElement` obliga a añadir un nuevo método `visit` a la interfaz `Visitor` y a implementarlo en todos los visitantes concretos. Esto rompe OCP en el eje de los elementos.
- **Rompe la encapsulación**: El visitante a menudo necesita acceder a los detalles internos del elemento para realizar su trabajo, lo que fuerza a exponer métodos públicos que quizá deberían ser privados.
- **Acoplamiento entre visitante y elementos**: El visitante conoce las clases concretas de los elementos, no solo su interfaz. Esto puede hacer el código más frágil si la jerarquía cambia.

## 9. Implementación
**a) Doble despacho**
El éxito de Visitor depende del doble despacho: la combinación de dos polimorfismos en tiempo de ejecución (el tipo de elemento y el tipo de visitante) determina el método ejecutado. En lenguajes que no soportan sobrecarga de métodos (como Python), se suele usar un diccionario de funciones o una convención de nombres (por ejemplo, `visit_assignment`, `visit_variable`).

**b) Recorrido de la estructura**
- **Recorrido externo**: El cliente o la `ObjectStructure` se encarga de iterar y llamar a `accept()` en cada elemento. El visitante solo define `visit` y no itera.
- **Recorrido interno**: Cada `accept()` del elemento se encarga de llamar a `accept()` en sus hijos después (o antes) de llamar a `visit()`. Esto evita duplicar el código de recorrido en cada visitante, pero acopla la lógica de recorrido a los elementos.

**c) Interfaz del Visitor: nombres de métodos**
- En Java, se sobrecargan con el mismo nombre `visit` y distintos tipos de parámetro.
- En Python, se pueden usar métodos con nombres compuestos (`visit_assignment`, `visit_binary_expression`) y despachar mediante `getattr` o un diccionario.

**d) Visitor acumulando estado**
El visitante puede tener atributos para almacenar resultados intermedios (por ejemplo, un `StringBuilder` para generar código). Tras el recorrido, el cliente obtiene el resultado.

**e) Visitor genérico o con retorno**
Se puede parametrizar el visitante para que devuelva un valor genérico (`Visitor<R>` con `visitX(): R`). Esto evita el estado mutable y facilita el estilo funcional.

**f) Alternativas en lenguajes funcionales**
En lenguajes con *pattern matching* (Scala, Kotlin, Haskell), el patrón Visitor es menos necesario porque el matching sobre tipos algebraicos resuelve el doble despacho de forma nativa y concisa.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-visitor-java.md) y [Python](ejemplos/03-visitor-python.md).)

## 11. Usos conocidos
- **Compiladores**: El AST se visita para análisis semántico, generación de código, optimización, etc.
- **Analizadores XML/HTML**: DOM expone `NodeVisitor` para recorrer el árbol y realizar transformaciones.
- **Frameworks de testing**: JUnit usa internamente un patrón similar para recorrer los métodos de prueba.
- **ORM / Hibernate**: El `CriteriaVisitor` recorre una estructura de criterios para generar SQL.
- **Editores gráficos**: Operaciones como escalado, rotación, exportación se implementan con visitantes sobre la estructura de figuras.

## 12. Patrones relacionados
- **Composite**: Visitor puede aplicarse sobre una estructura Composite para añadir operaciones sin modificar los componentes.
- **Interpreter**: Un AST es un Interpreter. Visitor puede encapsular la interpretación en una clase separada.
- **Iterator**: Puede usarse para recorrer la estructura antes de visitar los elementos.
- **Abstract Factory**: Un visitante podría usar una fábrica abstracta para crear objetos mientras recorre la estructura.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Template method python](../10-template-method/ejemplos/03-template-method-python.md) | [🏠 Inicio](../../index.md) | [visitor.puml ▶](diagramas/04-visitorpuml.md) |
