# Cableado en aplicaciones modulares (módulos de infraestructura)

En sistemas grandes, la infraestructura se parte en submódulos (persistencia, web, mensajería, clientes). Cada submódulo expone su propia configuración, y la raíz de composición los une.

- **Módulo de persistencia**: Contiene la clase de configuración que define beans para repositorios.
- **Módulo web**: Configura controladores, filtros, seguridad.
- **Módulo de mensajería**: Configura conexiones y listeners.

La raíz principal puede ser una clase que importa las configuraciones de los submódulos (`@Import` en Spring, o bien composición manual en `main`).

Esto facilita que al cambiar de base de datos, solo se reemplace el módulo de persistencia y su configuración, sin tocar el resto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Estrategias para múltiples implementaciones de un mismo puerto](07-estrategias-para-multiples-implementaciones-de-un-mismo-puerto.md) | [🏠 Inicio](../../index.md) | [Pruebas y configuración de prueba ▶](09-pruebas-y-configuracion-de-prueba.md) |
