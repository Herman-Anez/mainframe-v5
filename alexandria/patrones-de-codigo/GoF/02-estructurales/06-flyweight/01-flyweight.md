# Flyweight

## 1. Nombre y clasificación
- **Nombre**: Flyweight (Peso ligero)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Usar la compartición para soportar de manera eficiente una gran cantidad de objetos de grano fino.** Flyweight reduce el consumo de memoria separando el estado del objeto en dos: estado intrínseco (compartido, invariante) y estado extrínseco (dependiente del contexto, variable). El estado intrínseco se comparte entre todas las ocurrencias, mientras que el estado extrínseco se mantiene fuera y se pasa como parámetro a las operaciones.

## 3. Motivación
Imagina un editor de texto que representa cada carácter como un objeto `Character`. Para un documento de cientos de páginas, podrían existir millones de objetos `Character` en memoria, la mayoría con los mismos atributos de fuente, tamaño y estilo, difiriendo solo en su posición en el texto y el carácter concreto que representan. Crear un objeto por carácter es inaceptablemente costoso.

Flyweight soluciona esto definiendo un objeto ligero (`Glyph`) que almacena solo el estado intrínseco (la forma del carácter y la fuente). El estado extrínseco (posición en la pantalla, contexto de formato) se pasa como parámetro cuando se necesita dibujar. El mismo objeto `Glyph` para la letra 'A' en Times New Roman tamaño 12 se reutiliza en todas las apariciones de esa letra con ese formato, reduciendo millones de objetos a unas pocas docenas.

## 4. Aplicabilidad
Usa Flyweight solo cuando se cumplan **todas** las siguientes condiciones:
- La aplicación utiliza una gran cantidad de objetos.
- Los costes de almacenamiento son elevados debido a la cantidad masiva de objetos.
- La mayor parte del estado del objeto puede ser extrínseco (movido fuera del objeto).
- Al extraer el estado extrínseco, muchos grupos de objetos pueden ser reemplazados por relativamente pocos objetos compartidos.
- La identidad del objeto no es importante para la aplicación (los objetos flyweight pueden ser compartidos sin problemas).

## 5. Estructura
```
  ┌──────────────┐           ┌─────────────────────┐
  │   Client     │           │  FlyweightFactory   │
  └──────────────┘           ├─────────────────────┤
         │                   │ + getFlyweight(key) │
         │                   └─────────────────────┘
         │                               │
         │                               ▼ (gestiona)
         │              ┌────────────────────────────┐
         │              │       Flyweight            │
         │              ├────────────────────────────┤
         │              │ + operation(extrinsicState)│
         │              └────────────────────────────┘
         │                              △
         │                              │
         │          ┌───────────────────┴───────────────────┐
         │          │                                       │
         │  ConcreteFlyweight                 UnsharedConcreteFlyweight
         │  (compartido)                      (no compartido, opcional)
         └───────────────────────────────────────────────────── (colabora)
```

- **FlyweightFactory**: Mantiene un pool de flyweights (normalmente un diccionario clave → flyweight). El cliente solicita un flyweight por clave; si existe, lo devuelve; si no, lo crea, lo almacena y lo devuelve.
- **Flyweight**: Interfaz que declara la operación que recibe el estado extrínseco.
- **ConcreteFlyweight**: Implementa la interfaz y almacena el estado intrínseco. Debe ser compartible.
- **UnsharedConcreteFlyweight**: Opcional. No todos los flyweights tienen que ser compartidos. Esta clase permite instancias no compartibles (por ejemplo, un carácter especial que tiene su propio estado único).
- **Client**: Mantiene o calcula el estado extrínseco y se lo pasa al flyweight al invocar su operación.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-flyweightpuml.md).

## 6. Participantes
- **Flyweight** (`Glyph`): Declara una interfaz a través de la cual puede recibir y actuar sobre estado extrínseco.
- **ConcreteFlyweight** (`CharacterGlyph`): Implementa la interfaz `Flyweight` y almacena estado intrínseco (fuente, tamaño, etc.).
- **UnsharedConcreteFlyweight**: Representa objetos que no se benefician de la compartición o no pueden compartirse.
- **FlyweightFactory** (`GlyphFactory`): Crea y gestiona flyweights. Asegura que los flyweights se compartan apropiadamente.
- **Client** (`TextEditor`): Mantiene referencias a flyweights y calcula/almacena estado extrínseco.

## 7. Colaboraciones
- El cliente pide un flyweight a la fábrica proporcionando una clave que identifica el estado intrínseco deseado.
- La fábrica devuelve un flyweight existente (compartido) o crea uno nuevo.
- El cliente llama a la operación del flyweight, pasando el estado extrínseco necesario para realizar la acción (por ejemplo, la posición donde dibujarse).
- El cliente es responsable de gestionar el ciclo de vida del estado extrínseco; el flyweight no lo almacena entre invocaciones.

## 8. Consecuencias
**Ventajas:**
- **Reducción drástica de memoria**: Si el estado intrínseco se puede compartir eficazmente, la cantidad de objetos en memoria se reduce en órdenes de magnitud.
- **Centralización del estado compartido**: El estado común se mantiene en un solo lugar, lo que puede facilitar la consistencia.
- **Independencia del contexto**: Los flyweights pueden usarse en múltiples contextos simultáneamente porque no retienen el estado contextual.

**Desventajas:**
- **Mayor complejidad del código**: Separar el estado intrínseco del extrínseco puede complicar el diseño. El cliente debe gestionar el estado extrínseco.
- **Coste de búsqueda en la fábrica**: Cada vez que se necesita un flyweight, hay que buscarlo en el pool, aunque normalmente se mitiga con un diccionario hash.
- **Posible sobrecarga en concurrencia**: Si los flyweights son accedidos concurrentemente y no son inmutables, requieren sincronización; la mejor práctica es hacerlos **inmutables**.
- **No apto si hay mucha variación**: Si la mayoría de los objetos tienen estados intrínsecos únicos, la compartición no se produce y el patrón solo añade indirección.

## 9. Implementación
**a) Separación de estado intrínseco y extrínseco**
Es la parte más crítica. Hay que identificar qué datos son comunes a todas las ocurrencias (intrínseco) y qué datos dependen del contexto (extrínseco). En el editor de texto: el carácter en sí (letra 'A') y su fuente son intrínsecos; la posición y el color de fondo podrían ser extrínsecos.

**b) Inmutabilidad del estado intrínseco**
Para que un flyweight sea seguro compartir, su estado intrínseco debe ser inmutable (o al menos no modificarse después de la construcción). Si el estado intrínseco cambia, afectaría a todos los clientes que lo comparten.

**c) FlyweightFactory como Singleton**
La fábrica suele ser un Singleton porque no tiene sentido tener múltiples pools de flyweights; centraliza la gestión.

**d) Cálculo del estado extrínseco por el cliente o por un contexto**
El cliente debe proporcionar el estado extrínseco en cada llamada. A veces esto se encapsula en un objeto `Context` que se pasa junto con el flyweight.

**e) Flyweights compuestos**
Se pueden combinar con Composite para formar estructuras complejas que comparten flyweights (por ejemplo, un párrafo compuesto de múltiples caracteres flyweight). El Composite manejaría el estado extrínseco de sus hijos.

**f) Gestión de memoria**
En lenguajes con recolección de basura, si los flyweights dejan de ser referenciados por la fábrica pero son compartidos, el GC no los elimina. Si se desea liberar flyweights que ya no se usan, la fábrica podría usar referencias débiles (WeakReference) para permitir la recolección si no hay clientes activos.

**g) Flyweight vs caching**
La fábrica de flyweights es un tipo de caché, pero con la particularidad de que el objeto almacenado es compartido deliberadamente y es inmutable. Un caché genérico puede devolver objetos mutables que luego se modifican; flyweight no.

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-flyweight-java.md) y [Python](ejemplos/03-flyweight-python.md).)

## 11. Usos conocidos
- **Procesadores de texto**: Representación de caracteres con estilos de fuente y tamaño como flyweights (por ejemplo, en MS Word internamente).
- **Editores gráficos**: Figuras geométricas con estilos predefinidos compartidos.
- **AWT/Swing**: `java.awt.Color` y `java.awt.Font` actúan como flyweights (compartidos, inmutables). `javax.swing.text.GlyphView` usa flyweights para la representación de glifos.
- **Juegos**: Bosques con millones de árboles, donde `TreeType` (textura, color) es un flyweight y `Tree` tiene la posición como extrínseco.
- **Web: CSS sprites**: Combinación de iconos en una imagen compartida; la posición de cada icono es extrínseca.
- **Java `Integer.valueOf(int)`**: Cachea valores de -128 a 127; devuelve objetos Integer compartidos (flyweights). Similar `Boolean.TRUE/FALSE`, etc.

## 12. Patrones relacionados
- **Composite**: Flyweight puede usarse para las hojas de un Composite, compartiendo las hojas que son iguales.
- **State y Strategy**: Pueden implementarse como flyweights cuando no tienen estado propio específico.
- **Singleton**: La fábrica de flyweights suele ser Singleton.
- **Abstract Factory**: La fábrica de flyweights puede ser una Abstract Factory que devuelve flyweights según la clave.
- **Prototype**: En lugar de almacenar flyweights, la fábrica podría clonar prototipos, pero Flyweight comparte la misma instancia.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Facade python](../05-facade/ejemplos/03-facade-python.md) | [🏠 Inicio](../../index.md) | [flyweight.puml ▶](diagramas/04-flyweightpuml.md) |
