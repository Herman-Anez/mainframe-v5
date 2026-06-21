# Síntesis de la capa de aplicación

Estos cuatro elementos forman una maquinaria de orquestación perfectamente desacoplada del dominio y de la infraestructura:

1. **Los puertos primarios** definen **qué** se puede hacer con el sistema, usando el lenguaje del negocio.
2. **Los comandos y consultas** moldean los datos que cruzan esa frontera, sin contaminar al dominio.
3. **Los servicios de aplicación** **implementan** esos puertos y son los directores que coordinan el **cómo** se ejecuta cada caso de uso, delegando las decisiones de negocio al dominio.
4. **Los casos de uso** son las acciones atómicas que percibe el actor, materializadas en métodos de los puertos y orquestadas por los servicios de aplicación.

Todo ello permanece dentro del hexágono y nunca sabe si la llamada vino de una petición HTTP o de un test. Los adaptadores primarios, externos, se limitan a traducir las señales del mundo exterior en invocaciones a estos puertos. Esta separación es la garantía de que el núcleo de la aplicación pueda evolucionar sin verse afectado por cambios tecnológicos.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Puertos primarios](04-puertos-primarios.md) | [🏠 Inicio](../../index.md) | [Repositorios SQL ▶](../../3-infraestructura/1-persistencia/01-repositorios-sql.md) |
