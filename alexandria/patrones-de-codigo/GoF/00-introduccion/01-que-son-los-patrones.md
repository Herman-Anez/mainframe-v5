# Que son los patrones

## Definición esencial

Un **patrón de diseño** es una solución general, reutilizable y probada para un problema recurrente dentro de un contexto dado. No es una pieza de código lista para copiar y pegar, sino una **plantilla conceptual** que describe el problema, los participantes, sus responsabilidades, colaboraciones y consecuencias.

Christopher Alexander acuñó el término en arquitectura civil: “Cada patrón describe un problema que ocurre una y otra vez en nuestro entorno, y entonces describe la solución central a ese problema, de tal modo que se puede usar un millón de veces sin hacerlo nunca igual dos veces”. La ingeniería de software adoptó esta idea porque el diseño orientado a objetos enfrenta problemas similares de manera recurrente.

Un patrón se compone de cuatro elementos esenciales:

1. **Nombre**: vocabulario compartido que permite elevar el nivel de abstracción en una conversación entre diseñadores.
2. **Problema**: describe cuándo aplicar el patrón. Incluye el contexto y las condiciones que deben darse.
3. **Solución**: elementos abstractos (clases, objetos, relaciones, colaboraciones) que resuelven el problema. No es una implementación concreta.
4. **Consecuencias**: resultados y compromisos (*trade-offs*) de aplicar la solución. Son críticos para evaluar alternativas.

## ¿Qué no es un patrón?

- No es un algoritmo concreto (un algoritmo resuelve un problema computacional; un patrón resuelve un problema de diseño).
- No es una librería ni un framework.
- No es una regla rígida; se aplica tras evaluar el contexto.

## ¿Por qué estudiar patrones?

- **Vocabulario común**: decir “usamos un Observer” transmite instantáneamente la estructura y dinámica del diseño.
- **Reutilización de experiencia**: evita redescubrir soluciones. Cada patrón es la cristalización de décadas de prueba y error.
- **Mejor comunicación y documentación**: los diagramas y descripciones se estandarizan.
- **Facilita el mantenimiento**: el código basado en patrones es más predecible y extensible.
- **Educa sobre principios**: cada patrón encarna principios de bajo acoplamiento, alta cohesión, etc.

## Cómo usar los patrones correctamente

1. **Identificar el problema y el contexto**, no forzar el patrón.
2. **Estudiar patrones similares** para elegir el que mejor equilibre las consecuencias.
3. **Entender los participantes y sus colaboraciones**, adaptando nombres al dominio.
4. **Implementar respetando la intención**, no la forma literal.
5. **Evaluar las consecuencias**: ¿realmente ha mejorado la flexibilidad? ¿ha introducido complejidad innecesaria?

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| ➖ | [🏠 Inicio](../index.md) | [Historia y gof ▶](02-historia-y-gof.md) |
