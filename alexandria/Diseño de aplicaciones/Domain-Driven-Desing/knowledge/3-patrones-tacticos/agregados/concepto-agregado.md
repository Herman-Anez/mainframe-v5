# Concepto agregado

Un **Agregado** (Aggregate) es un clúster de objetos del dominio (entidades y value objects) que se tratan como una única unidad para los cambios de datos. Cada agregado tiene una **Raíz de Agregado** (Aggregate Root), una entidad específica que actúa como puerta de entrada y guardiana de la consistencia del grupo. El resto de objetos dentro del agregado no son accesibles desde fuera; cualquier operación que modifique el estado del agregado debe pasar obligatoriamente por la raíz.

## ¿Por qué surgen los agregados?
En un dominio complejo, las entidades y value objects establecen relaciones entre sí. Sin un mecanismo de control, estas relaciones pueden dar lugar a grafos de objetos enormes y frágiles, donde un cambio local desencadena cascadas de modificaciones no controladas, violando invariantes de negocio. Los agregados ponen límites explícitos a esas relaciones:
- Definen una **frontera de consistencia**: todas las invariantes dentro del agregado se mantienen en cada operación que se realiza sobre él.
- Reducen el acoplamiento: ningún objeto externo puede referenciar un objeto interno del agregado excepto a través de la raíz.
- Simplifican la persistencia: se recupera y almacena el agregado como una unidad.

## La Raíz del Agregado (Aggregate Root)
Es la única entidad a la que el mundo exterior puede tener referencia directa. Sus responsabilidades:
1. **Identidad global del agregado:** cualquier petición para modificar el agregado llega mediante el identificador de la raíz.
2. **Garantizar invariantes:** todos los métodos de la raíz que cambian estado deben dejar el agregado en un estado válido según las reglas de negocio.
3. **Controlar el acceso a los objetos internos:** nunca expone referencias a entidades internas mutables; si es necesario exponer información, se devuelven copias inmutables (value objects) o DTOs.
4. **Registrar eventos de dominio:** normalmente es la raíz quien recopila y emite los eventos que han ocurrido dentro del agregado.

**Ejemplo básico:**
```java
public class Pedido { // Raíz
    private PedidoId id;
    private List<LineaPedido> lineas; // Entidades internas
    private DireccionEnvio direccion; // Value Object
    private EstadoPedido estado;

    public void añadirProducto(ProductoId producto, Cantidad cantidad) {
        if (estado != EstadoPedido.BORRADOR) throw new PedidoNoModificableException();
        // Verificar invariante: no duplicar producto
        LineaPedido nueva = new LineaPedido(producto, cantidad);
        lineas.add(nueva);
        // Disparar evento ProductoAñadido
    }

    public void confirmar() {
        if (lineas.isEmpty()) throw new PedidoSinLineasException();
        this.estado = EstadoPedido.CONFIRMADO;
        // Evento PedidoConfirmado
    }
}
```
Aquí `LineaPedido` es una entidad interna; nunca se accede directamente a ella desde fuera.

## Objetos internos del agregado
Pueden ser:
- **Entidades** (con identidad local, válida solo dentro del agregado). Ejemplo: `LineaPedido` tiene un `lineaId` único dentro del pedido, pero sin sentido fuera.
- **Value Objects** (inmutables, definen propiedades). Ejemplo: `DireccionEnvio`.

Las entidades internas no son accesibles desde fuera. Si otro agregado necesita referenciar algo, lo hace por el ID del agregado raíz.

## Invariantes del agregado
Las invariantes son reglas de negocio que deben cumplirse en todo momento dentro de la frontera de consistencia. Ejemplos:
- Un `Pedido` confirmado no puede modificarse.
- El total del pedido debe ser la suma de los importes de sus líneas.
- El saldo de una cuenta nunca puede ser negativo.

El raíz es responsable de que cada método público verifique y mantenga estas invariantes. No se puede delegar en servicios externos; la raíz debe rechazar cualquier cambio que las viole.

## Agregados y repositorios
Solo deben existir repositorios para raíces de agregado. Un `PedidoRepository` recupera y guarda el pedido completo (incluidas sus líneas). No se crea un `LineaPedidoRepository`. El repositorio devuelve un agregado íntegro; la responsabilidad de construir correctamente los objetos internos recae en la infraestructura de persistencia.

## Identificadores como Value Objects
El ID de la raíz se modela como un Value Object (`PedidoId`, `ClienteId`). Esto evita la obsesión por primitivos y proporciona tipado fuerte.

## Agregados y operaciones atómicas
Un comando que modifica el agregado debe modificar solo **un agregado** por transacción. Si un caso de uso requiere modificar dos agregados, se utiliza consistencia eventual mediante eventos de dominio o procesos en saga (no se fuerza una transacción distribuida). Esta es una regla de diseño fundamental.

## ¿Por qué no poner toda la base de datos en un solo agregado?
Porque un agregado enorme genera contención, problemas de rendimiento y acopla lógica que debería ser independiente. Cada agregado es una unidad transaccional; hacerlos pequeños y con un propósito claro es esencial para sistemas escalables y mantenibles.

## Ejemplo de un agregado mal diseñado (antipatrón)
Un `Cliente` que contiene una colección de `Pedido`. Si se necesitara consultar el historial de pedidos, cargar el cliente con miles de pedidos en memoria es ineficiente. Peor aún, una modificación en un pedido requeriría cargar todo el cliente. La solución: `Cliente` y `Pedido` son agregados separados; `Pedido` referencia al `ClienteId` como identidad.
