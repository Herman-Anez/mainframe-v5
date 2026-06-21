# Estrategias para múltiples implementaciones de un mismo puerto

Puede ocurrir que existan varias implementaciones para un puerto secundario (ej. notificador por email, notificador por SMS). La configuración decide cuál(es) se usan.

## Decoradores y compuestos
- Se puede usar un **compuesto** que agrupe varias implementaciones y elija en tiempo de ejecución (por ejemplo, un `NotificadorCompuesto` que itera sobre una lista de `Notificador`).
- El cableado monta la lista según configuración.

```java
@Bean
public Notificador notificador(List<Notificador> implementaciones) {
    return new NotificadorCompuesto(implementaciones);
}
```

Así se mantiene el principio de que el núcleo no sabe de la existencia de múltiples variantes.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Cableado de adaptadores secundarios](06-cableado-de-adaptadores-secundarios.md) | [🏠 Inicio](../../index.md) | [Cableado en aplicaciones modulares (módulos de infraestructura) ▶](08-cableado-en-aplicaciones-modulares-modulos-de-infraestructura.md) |
