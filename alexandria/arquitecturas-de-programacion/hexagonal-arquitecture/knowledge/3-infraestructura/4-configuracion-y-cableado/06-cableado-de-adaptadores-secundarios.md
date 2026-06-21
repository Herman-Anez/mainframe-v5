# Cableado de adaptadores secundarios

Los adaptadores secundarios implementan puertos secundarios y requieren ser inyectados en los servicios de aplicación.

## Paso a paso típico
1. **Definir el puerto secundario** en el núcleo (`RepositorioPedidos`).
2. **Implementar el adaptador** en infraestructura (`RepositorioPedidosPostgres`).
3. **En la raíz de composición**, instanciar el adaptador y “asignarlo” a la interfaz mediante DI.
4. **Inyectar** esa instancia en los servicios de aplicación (que dependen de la interfaz).

La DI se encarga de la cadena: el servicio de aplicación pide en su constructor `RepositorioPedidos`; el contenedor le da la implementación concreta configurada.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Cableado de adaptadores primarios](05-cableado-de-adaptadores-primarios.md) | [🏠 Inicio](../../index.md) | [Estrategias para múltiples implementaciones de un mismo puerto ▶](07-estrategias-para-multiples-implementaciones-de-un-mismo-puerto.md) |
