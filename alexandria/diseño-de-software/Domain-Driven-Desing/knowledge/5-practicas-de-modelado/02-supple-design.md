# Supple design

**Supple Design** (Diseño Flexible) es un conjunto de patrones complementarios introducidos por Eric Evans para lograr que el modelo de dominio sea maleable, expresivo y fácil de extender. El diseño flexible complementa al model-driven design, ayudando a que el código comunique la intención y permita cambios sin resistencia.

## Intention-Revealing Interfaces (Interfaces que Revelan Intenciones)
El nombre de cada clase, método y propiedad debe expresar claramente qué hace sin necesidad de leer la implementación. No se trata de un nombre largo y descriptivo sin más, sino de que el nombre comunique el porqué desde la perspectiva del dominio.
- **Mal:** `int status` o `void process()`.
- **Bien:** `EstadoPedido estado` y `void confirmar()`.

Cuando un desarrollador usa una interfaz, no debería tener que inspeccionar el código interno para entender el efecto. Esto reduce errores y acelera la incorporación de nuevos miembros al equipo.

## Side-Effect-Free Functions (Funciones sin Efectos Colaterales)
Las operaciones se dividen en dos categorías:
- **Comandos:** producen efectos colaterales (cambiar estado, enviar eventos). Nombrados con verbos imperativos.
- **Consultas:** devuelven resultados sin modificar nada. Pueden ser usadas libremente sin riesgo.
Aplicar esta separación en los objetos de dominio (especialmente en value objects) hace el sistema más predecible. Los value objects, al ser inmutables, son naturalmente side-effect-free. Un método como `Dinero.sumar(Dinero otro)` devuelve un nuevo `Dinero`, no modifica el original.

## Assertions (Aserciones)
Incluir validaciones explícitas de precondiciones, postcondiciones e invariantes en el código. Aunque algunas aserciones se implementan con excepciones, el propósito es hacer explícitas las restricciones del dominio en el código, no ocultarlas en condiciones dispersas.
```java
public void retirar(Dinero monto) {
    assert monto != null;
    assert saldo.esMayorOIgual(monto) : "Saldo insuficiente";
    // ...
}
```
En muchos lenguajes se sustituye por excepciones de negocio (`SaldoInsuficienteException`), pero el principio es el mismo: declarar las invariantes de manera visible al leer el método.

## Conceptual Contours (Contornos Conceptuales)
El diseño debe amoldarse a los límites naturales del dominio. Los módulos y agregados deben surgir de las fronteras donde el lenguaje ubicuo cambia o donde la cohesión conceptual disminuye. Forzar una estructura técnica (por ejemplo, separar en componentes "servicios", "DTOs", "entidades" genéricos) en lugar de por capacidades de negocio (`Pedidos`, `Catálogo`) va contra los contornos conceptuales.

**Heurística:** si al refactorizar un cambio de negocio afecta a múltiples módulos, es posible que los contornos conceptuales no se estén respetando.

## Standalone Classes (Clases Independientes)
Extraer lógica de acoplamiento hacia clases que puedan ser entendidas y probadas de forma aislada. Esto se logra con value objects autónomos, especificaciones y servicios de dominio stateless. Cuantas menos dependencias tenga una clase del dominio, más fácil es razonar sobre ella y reutilizarla.

## Closure of Operations (Clausura de Operaciones)
Definir operaciones que devuelvan el mismo tipo que sus argumentos, permitiendo la composición. Es típico en value objects: `Dinero.sumar(Dinero)` devuelve `Dinero`. No se mezcla con tipos primitivos. Esto permite encadenar llamadas y mantener el tipado fuerte del dominio sin fugas a tipos genéricos.

## Declarative Design (Diseño Declarativo)
Crear pequeños lenguajes específicos del dominio (internos o externos) para expresar reglas complejas de forma legible. Por ejemplo, una especificación que se combine así:
```java
spec = Pedido.estado(BORRADOR).and(Pedido.conPrioridad(ALTA));
```
Esto se apoya en el patrón Specification y en interfaces fluidas. Aunque no siempre es necesario, en partes muy complejas del core domain puede clarificar enormemente la lógica.

## La flexibilidad como objetivo estratégico
El diseño flexible no es un lujo estético; es una inversión que amortiza cuando el dominio cambia. Un modelo rígido cuesta más de modificar y desalienta la innovación. Por ello, en el core domain se debe dedicar tiempo a refactorizar hacia un supple design, mientras que en subdominios genéricos se puede permitir cierta rigidez.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Model driven design](01-model-driven-design.md) | [🏠 Inicio](../index.md) | [Patrones de diseno complementarios ▶](03-patrones-de-diseno-complementarios.md) |
