# Builder

## 1. Nombre y clasificación
- **Nombre**: Builder (Constructor)
- **Clasificación GoF**: Creacional, de objeto

## 2. Propósito
Separar la construcción de un objeto complejo de su representación, de modo que **el mismo proceso de construcción pueda crear diferentes representaciones**.

## 3. Motivación
Imagina un editor de documentos RTF (Rich Text Format). Un lector de RTF debe ser capaz de interpretar el formato y convertirlo en distintos tipos de salida: texto plano, PDF, HTML, o el formato interno del editor. El algoritmo de análisis (parseo del RTF) es el mismo en todos los casos, pero la representación final cambia.  
Sin el patrón, tendríamos un único algoritmo lleno de condicionales (`if (formato == "PDF") ... else if (formato == "HTML") ...`) que se volvería inmanejable.  
Builder resuelve esto definiendo una interfaz común (`TextConverter`) con operaciones para construir paso a paso cada parte del documento (título, párrafo, imagen, etc.). Cada clase que implementa esa interfaz (`PDFConverter`, `HTMLConverter`) va acumulando el resultado en una representación interna adecuada. El director (el analizador RTF) llama a esos métodos en el orden correcto sin conocer la representación concreta. Así podemos añadir nuevos formatos sin tocar el algoritmo de lectura.

Otro ejemplo común es la construcción de objetos complejos con múltiples partes opcionales, como un menú de restaurante o un pedido personalizado: el proceso de construcción es “elige primer plato, segundo, postre”, pero los productos concretos pueden variar según la fábrica de menús.

## 4. Aplicabilidad
Usa Builder cuando:
- La creación de un objeto complejo debe ser independiente de las partes que lo componen y de cómo se ensamblan.
- El proceso de construcción debe permitir diferentes representaciones del objeto construido.
- Quieres un control fino sobre el proceso de construcción paso a paso, posiblemente con validaciones en cada etapa.
- La construcción de un objeto requiere muchos parámetros opcionales; un constructor monstruoso con largas listas de argumentos es inviable y propenso a errores.

## 5. Estructura
```
┌──────────┐         ┌──────────────────────┐
│ Director │         │       Builder        │
├──────────┤         ├──────────────────────┤
│+construct()        │+buildPartA()         │
└──────────┘         │+buildPartB()         │
     │               │+getResult(): Product │
     │               └──────────────────────┘
     │                          △
     │                          │
     │               ┌──────────┴──────────┐
     │               │                     │
     │        ConcreteBuilder1    ConcreteBuilder2
     │               │                     │
     └───────────────┼─────────────────────┘
                     │    (invoca pasos de construcción)
                     ▼
              ┌────────────┐
              │  Producto  │ (representación final)
              └────────────┘
```
El director conoce y utiliza la interfaz del `Builder` para ejecutar los pasos necesarios. Los `ConcreteBuilder` implementan esos pasos, almacenando y ensamblando las piezas internamente. Al finalizar, el cliente obtiene el producto del builder concreto.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-builderpuml.md).

## 6. Participantes
- **Builder** (interfaz): Especifica métodos abstractos para crear las partes del producto. También suele declarar un método `getResult()` que devuelve el producto ensamblado.
- **ConcreteBuilder** (constructor concreto): Implementa los métodos de `Builder` para construir y ensamblar partes concretas. Mantiene la representación interna del producto que está construyendo. Define y rastrea el estado de la construcción.
- **Director**: Construye el objeto utilizando la interfaz de `Builder`. Conoce la secuencia de pasos necesarios, pero **no** conoce los tipos concretos de las partes ni el producto final.
- **Producto**: El objeto complejo que se va a construir. Las clases `ConcreteBuilder` construyen la representación interna del producto; la estructura del producto depende del patrón (puede ser una clase con muchos campos, un árbol, etc.).
- **Cliente** (opcional en la estructura pura, pero presente en la práctica): Configura el director con el builder concreto deseado y obtiene el resultado.

## 7. Colaboraciones
- El cliente crea un objeto `Director` y lo configura con un `ConcreteBuilder`.
- El cliente invoca `director.construct()`. El director, a su vez, llama a `buildPartA()`, `buildPartB()`, etc., según el algoritmo de construcción.
- Cada `ConcreteBuilder` implementa estos métodos para añadir partes al producto incipiente.
- Cuando el director ha terminado, el cliente solicita el producto al builder mediante `getResult()`. El builder entrega el producto completo.

## 8. Consecuencias
**Ventajas:**
- **Separación de construcción y representación**: El mismo director puede construir productos completamente diferentes simplemente cambiando el `ConcreteBuilder`.
- **Control fino del proceso**: La construcción paso a paso permite insertar validaciones, lógica condicional o incluso retroceder antes de obtener el resultado.
- **Reutilización del algoritmo de construcción**: El director encapsula la secuencia de pasos, que puede ser compleja, y se reutiliza con distintos builders.
- **Principio de responsabilidad única (SRP)**: Separa el código de construcción del código de representación.
- **Construcción de objetos inmutables**: Una vez construido, el producto puede ser inmutable porque todas las partes se fijan durante el proceso.

**Desventajas:**
- **Complejidad inicial**: Requiere más clases (Builder, ConcreteBuilder, Director) que un simple constructor.
- **Acoplamiento entre Builder y Producto**: El `ConcreteBuilder` está fuertemente ligado a la estructura del producto concreto que construye.
- **No apto para objetos simples**: Si el objeto tiene pocos parámetros, el patrón añade sobreingeniería. Se recomienda aplicar solo cuando hay al menos 4 o más parámetros opcionales o la construcción es inherentemente compleja.

## 9. Implementación
**a) Variante clásica con Director**
El director invoca una secuencia de métodos del builder. Es adecuada cuando existe un algoritmo de construcción bien definido que no varía (ej. parsear un archivo). El cliente elige el builder concreto.

**b) Variante sin Director (Fluent Builder)**
El propio builder actúa como director y proporciona una API fluida (*method chaining*). Cada método de construcción devuelve el propio builder (`return this`) para encadenar llamadas. Esta variante es muy popular en la actualidad (p.ej. `PizzaBuilder().withCheese().withBacon().build()`). Es más flexible porque el cliente controla directamente los pasos, pero no encapsula un algoritmo complejo de construcción.

**c) Builder parametrizado**
El builder puede recibir parámetros en sus métodos de construcción (p.ej. `setColor(Color)`). No debe confundirse con el patrón Abstract Factory: el builder construye paso a paso un producto complejo; la fábrica abstracta devuelve productos inmediatamente.

**d) Validación en el método `build()`**
Es común que el método `build()` (o `getResult()`) realice validaciones finales (por ejemplo, comprobar que se han establecido todos los campos obligatorios) y lance una excepción si el producto es inválido.

**e) Builder inmutable**
Si el producto es inmutable, el `Builder` acumula los parámetros y en `build()` llama al constructor privado del producto pasando todos los valores. Esto es típico en Java con muchas clases que tienen un `Builder` estático interno.

**f) Reutilización del builder**
¿Se puede reutilizar la misma instancia del builder para construir varios productos? Depende de la implementación. Si después de `build()` se resetea el estado, sí. Muchos builders no lo permiten y se crean de nuevo para cada producto.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-builder-java.md) y [Python](ejemplos/03-builder-python.md).)

## 11. Usos conocidos
- **StringBuilder** en Java y **StringBuilder** en .NET: Construyen cadenas paso a paso y luego devuelven el resultado con `toString()`. Es un caso simplificado del patrón (sin director separado).
- **Lombok `@Builder`**: Genera automáticamente una clase interna estática que implementa el patrón Builder para una clase dada.
- **Frameworks de construcción de UI**: Creación de interfaces gráficas complejas donde se añaden widgets progresivamente.
- **Builders de consultas SQL (jOOQ, Querydsl)**: Permiten construir consultas complejas con tipado seguro.
- **`HttpClient.Builder`** en Java 11+: Construye un `HttpClient` con múltiples opciones de configuración.

## 12. Patrones relacionados
- **Abstract Factory**: Crea familias de productos completos de una vez; Builder los construye paso a paso. Abstract Factory suele devolver el producto inmediatamente; Builder permite postergar la obtención hasta que se invoca `build()`.
- **Factory Method**: Crea un único producto mediante herencia; Builder construye un producto complejo mediante composición.
- **Composite**: A menudo el producto que construye un Builder es un árbol Composite.
- **Prototype**: El builder puede usar un prototipo como base y luego modificar partes, o clonar configuraciones.
- **Template Method**: El director puede implementarse como un Template Method donde los pasos concretos se delegan al builder.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Abstract factory python](../01-abstract-factory/ejemplos/03-abstract-factory-python.md) | [🏠 Inicio](../../index.md) | [builder.puml ▶](diagramas/04-builderpuml.md) |
