# Composite

## 1. Nombre y clasificación
- **Nombre**: Composite (Compuesto, también llamado *Árbol de objetos*)
- **Clasificación GoF**: Estructural, de objeto

## 2. Propósito
**Componer objetos en estructuras de árbol para representar jerarquías parte-todo.** Composite permite a los clientes tratar de manera uniforme tanto a objetos individuales (hojas) como a composiciones de objetos (compuestos). Un cliente no necesita distinguir si está tratando con un elemento simple o con un grupo complejo; ambos comparten la misma interfaz.

## 3. Motivación
Imagina una aplicación de dibujo que permite agrupar figuras. Una agrupación de círculos y rectángulos debe comportarse como una única figura: se puede mover, redimensionar o dibujar como un todo. Sin el patrón, el código cliente necesitaría distinguir entre figuras simples y grupos mediante condicionales (ej. `if (obj instanceof Group) { ... } else { ... }`). Esto complica la adición de nuevos tipos de figuras y es propenso a errores.

El patrón Composite define una interfaz común `Graphic` que implementan tanto las figuras simples (hojas) como los grupos (compuestos). Un grupo contiene una colección de `Graphic` y, al recibir una petición, la propaga a todos sus hijos. El cliente solo interactúa con la interfaz `Graphic`, sin preocuparse de si es una hoja o un grupo.

## 4. Aplicabilidad
Usa Composite cuando:
- Quieres representar jerarquías de objetos del tipo *parte-todo* (árboles, catálogos, menús anidados, sistemas de archivos).
- Quieres que los clientes puedan ignorar las diferencias entre objetos compuestos y objetos simples. Tratarlos uniformemente simplifica enormemente el código cliente.
- La estructura puede tener cualquier nivel de profundidad y los clientes no deben preocuparse por la recursividad.

## 5. Estructura
```
        ┌──────────────────────┐
        │      Component       │ (interfaz o clase abstracta)
        ├──────────────────────┤
        │ + operation()        │
        │ + add(Component)     │ (opcional)
        │ + remove(Component)  │ (opcional)
        │ + getChild(int)      │ (opcional)
        └──────────────────────┘
                    △
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────────────┐       ┌───────────────────┐
│     Leaf      │       │     Composite     │
├───────────────┤       ├───────────────────┤
│ + operation() │       │ - children: List  │
└───────────────┘       │ + operation()     │
                        │ + add(Component)  │
                        │ + remove(Component)│
                        │ + getChild(int)   │
                        └───────────────────┘
                                 │
                                 │ (opera sobre hijos)
                                 ▼
                           ┌──────────┐
                           │ Component│ (referencias a hijos)
                           └──────────┘
```

- **Component**: Interfaz común. Declara operaciones como `operation()`. También puede declarar métodos para la gestión de hijos (`add`, `remove`, `getChild`).
- **Leaf**: Representa objetos hoja sin hijos. Implementa `operation()`. Normalmente no implementa la gestión de hijos (o lo hace lanzando excepciones).
- **Composite**: Almacena hijos (usualmente una lista de `Component`). Implementa `operation()` iterando sobre sus hijos y delegando la llamada a cada uno. Implementa los métodos de gestión de hijos para manipular la estructura del árbol.

> [!TIP]
> Código de diagrama disponible en [PlantUML](diagramas/04-compositepuml.md).

## 6. Participantes
- **Component** (`Graphic`): Declara la interfaz común para todos los objetos de la composición. Define el comportamiento por defecto de los métodos de gestión de hijos (si se decide tenerlos en la interfaz) y cualquier operación que las hojas y compuestos deban implementar.
- **Leaf** (`Circle`, `Rectangle`): Representa objetos hoja que no tienen hijos. Define el comportamiento para objetos primitivos.
- **Composite** (`Picture`, `Group`): Define el comportamiento de los compuestos que tienen hijos. Almacena componentes hijos. Implementa las operaciones relacionadas con los hijos.
- **Client**: Usa la interfaz `Component` para manipular objetos en la composición.

## 7. Colaboraciones
- El cliente interactúa con la estructura a través de la interfaz `Component`.
- Si el receptor es una hoja, la petición se maneja directamente.
- Si el receptor es un compuesto, normalmente propaga la petición a todos sus hijos, realizando operaciones adicionales antes o después si es necesario.
- Los clientes no necesitan (y no deben) saber si están tratando con una hoja o un compuesto; la interfaz uniforme oculta la complejidad.

## 8. Consecuencias
**Ventajas:**
- **Tratamiento uniforme**: El código cliente puede tratar objetos simples y compuestos de la misma manera. Esto simplifica el cliente y elimina condicionales de tipo (*type checking*).
- **Facilidad para añadir nuevos componentes**: Definir una nueva subclase de `Leaf` o `Composite` no afecta al código cliente existente. El sistema es abierto/cerrado (OCP) respecto a nuevos tipos de componentes.
- **Estructura recursiva natural**: Se adapta perfectamente a estructuras jerárquicas como árboles.

**Desventajas:**
- **Interfaz demasiado genérica**: Para lograr uniformidad, la interfaz `Component` puede incluir operaciones que no son apropiadas para las hojas (p.ej., `add`). Esto obliga a las hojas a implementar estos métodos con cuerpos vacíos o lanzar excepciones, lo que compromete la seguridad de tipos en tiempo de compilación.
- **Violación del Principio de segregación de interfaces (ISP)**: Las hojas se ven forzadas a heredar métodos que no necesitan, si la interfaz es pesada.
- **Complejidad en la gestión de hijos**: La implementación de `Composite` debe manejar correctamente la adición/eliminación de hijos y la referencia a los padres, lo cual puede ser no trivial si se requieren restricciones (por ejemplo, un hijo no puede pertenecer a dos padres).

## 9. Implementación
**a) Transparencia vs Seguridad**
Hay dos enfoques para definir la interfaz `Component`:
- **Transparencia máxima**: Los métodos de gestión de hijos (`add`, `remove`, etc.) se definen en la interfaz `Component`. Las hojas los implementan como operaciones vacías o lanzando `UnsupportedOperationException`. Ventaja: el cliente puede tratar a todos por igual. Desventaja: no hay seguridad de tipos en tiempo de compilación; el cliente podría intentar añadir un hijo a una hoja y fallar en tiempo de ejecución.
- **Seguridad máxima**: Los métodos de gestión de hijos se definen solo en `Composite`. El cliente que quiera usarlos debe saber que trabaja con un `Composite` (haciendo un casting o programando contra `Composite` directamente). Ventaja: errores detectados en compilación. Desventaja: el cliente pierde la uniformidad y debe distinguir tipos.

El GoF tiende a preferir la transparencia, argumentando que los fallos en tiempo de ejecución por uso incorrecto de `add` en una hoja son raros y el beneficio de uniformidad supera el coste. En la práctica, muchos diseños modernos optan por la seguridad, manteniendo los métodos de gestión solo en el `Composite`.

**b) Referencia al padre**
A veces es útil que un componente conozca a su padre para facilitar el recorrido del árbol o las operaciones de borrado. Esto implica añadir una referencia `parent` en `Component` y actualizarla en los métodos `add`/`remove`. Hay que manejar la integridad referencial cuidadosamente.

**c) Comportamiento de `operation()` en Composite**
La operación en el compuesto generalmente itera sobre los hijos y llama a su `operation()`. Puede agregar resultados (por ejemplo, calcular el precio total de un pedido sumando los precios de sus ítems), o simplemente propagar un efecto (dibujar cada hijo).

**d) Caching**
Si la operación es costosa y se invoca frecuentemente, el compuesto puede cachear resultados y ser notificado cuando un hijo cambia para invalidar la caché.

**e) Orden de los hijos**
Dependiendo del dominio, el orden de los hijos puede ser significativo (como en un documento estructurado) o no. La colección debe elegirse en consecuencia (lista vs conjunto).

## 10. Código de ejemplo
(Ver ejemplos de implementación en [Java](ejemplos/02-composite-java.md) y [Python](ejemplos/03-composite-python.md).)

## 11. Usos conocidos
- **Frameworks de interfaces gráficas**: La jerarquía de widgets (ventanas, paneles, botones, etiquetas) es un Composite. Un panel contiene otros widgets y todos responden a eventos como `draw()`.
- **Sistemas de archivos**: Directorios (composite) y archivos (hojas). Ambos implementan operaciones como `getSize()` o `delete()`.
- **Estructura de documentos**: Un documento compuesto por capítulos, párrafos, figuras, etc. Las operaciones de renderizado y revisión ortográfica se propagan recursivamente.
- **Java AWT/Swing**: `Container` (Composite) y `Component` (hoja como `Button`, `Label`). Métodos como `add(Component comp)` son heredados por todos, aunque las hojas no los usan (transparencia).
- **Editores gráficos**: Agrupación de figuras (un grupo es una figura que contiene figuras).

## 12. Patrones relacionados
- **Decorator**: Tiene estructura similar (interfaz común y composición), pero su propósito es añadir responsabilidades, no representar relaciones parte-todo. Decorator envuelve un solo componente; Composite puede tener muchos hijos.
- **Flyweight**: Para evitar crear muchos objetos hoja idénticos, se pueden compartir usando Flyweight. Composite puede usar Flyweight para sus hojas.
- **Iterator**: Se puede usar para recorrer el árbol de un Composite de diferentes maneras (preorden, postorden, etc.).
- **Visitor**: Permite encapsular operaciones que deben aplicarse a toda la estructura Composite sin modificar las clases de los elementos.
- **Chain of Responsibility**: Puede aplicarse sobre un Composite para que un evento ascienda desde una hoja hasta la raíz.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Bridge python](../02-bridge/ejemplos/03-bridge-python.md) | [🏠 Inicio](../../index.md) | [composite.puml ▶](diagramas/04-compositepuml.md) |
