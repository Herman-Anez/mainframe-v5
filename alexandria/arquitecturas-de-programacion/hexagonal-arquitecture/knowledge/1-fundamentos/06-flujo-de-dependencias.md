# Flujo de dependencias

## La regla fundamental
> **Las dependencias de código fuente solo pueden apuntar hacia el centro.**

Esto significa que:
- Un módulo de infraestructura (donde viven los adaptadores) puede importar y depender de interfaces del dominio/aplicación.
- El dominio **nunca** importa nada de infraestructura.
- Los servicios de aplicación pueden depender de puertos secundarios (interfaces) para inyectarlos, pero no de sus implementaciones concretas.

## Vista en capas y módulos
Si se organiza el código en paquetes/módulos, se observa:
```
infraestructura → aplicación → dominio
```
- `dominio` no depende de `aplicación` ni de `infraestructura`.
- `aplicación` depende de `dominio` y de las interfaces de los puertos que están en `dominio` (o en una subcapa de puertos dentro del núcleo). No depende de `infraestructura`.
- `infraestructura` depende de `aplicación` y `dominio` (porque implementa puertos y construye comandos/DTOs). Es el extremo exterior.

## Cómo se resuelven las dependencias en tiempo de ejecución
Aunque en tiempo de compilación las flechas van hacia adentro, en tiempo de ejecución el flujo de control puede ir desde un controlador (fuera) hacia el dominio (dentro) y luego salir a un repositorio (fuera) mediante un puerto. Esto es posible porque el dominio define la interfaz y el compositor raíz provee la implementación concreta.

- **Inyección de dependencias**: El dominio recibe una instancia de `RepositorioPedidos` (interfaz) en su constructor. La implementación real (por ejemplo, `RepositorioPedidosPostgres`) es inyectada por el framework, que sí conoce ambas partes.
- **Inversión de control**: El control lo cede el sistema de inyección, que invierte la dirección de la dependencia de código fuente respecto al flujo de ejecución tradicional.

## Consecuencias de respetar este flujo
- Es imposible que un cambio en la base de datos afecte al dominio, porque el dominio no conoce la clase concreta del repositorio.
- Los tests pueden sustituir el repositorio real por uno en memoria sin modificar el código de dominio.
- Se puede extraer la lógica de negocio y reutilizarla en diferentes contextos (microservicio, monolito, script batch) solo cambiando los adaptadores.

## Diagrama conceptual
```
 [Controlador REST]  -->  (Puerto primario: GestiónPedidosUseCase)  --> [Servicio Aplicación]  --> [Dominio]
                                                                                              |
                                                           (Puerto secundario: RepositorioPedidos) <-- [RepositorioPostgres]
```
Las flechas continuas indican dependencia de código: todas apuntan hacia la izquierda (hacia las interfaces del centro). La línea punteada representa el flujo de ejecución en tiempo real, que puede ir de derecha a izquierda y luego volver a salir.

---

## Síntesis de los fundamentos
Estos seis temas forman la base teórica sin la cual la arquitectura hexagonal se malinterpreta con facilidad. Toda decisión de diseño (como dónde colocar una interfaz o si un servicio puede llamar directamente a una API) se responde aplicando estos principios. En los siguientes módulos (`elementos-del-nucleo/`, `infraestructura/`, etc.) se aterrizan estos fundamentos en piezas de código y patrones concretos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Adaptadores](05-adaptadores.md) | [🏠 Inicio](../index.md) | [Entidades ▶](../2-elementos-del-nucleo/1-dominio/01-entidades.md) |
