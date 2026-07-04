# Antipatrones comunes

Un **antipatrón** es una solución que parece adecuada pero que en la práctica genera más problemas que beneficios. Conocerlos ayuda a no “forzar” patrones GoF donde no corresponden o a reconocer implementaciones degradadas.

## 1. Singletonitis o uso excesivo del Singleton

- **Problema**: Se convierte en un sustituto de variables globales, creando estado mutable global que complica las pruebas unitarias y el razonamiento sobre el flujo de datos.
- **Síntomas**: Clases que dependen de `MiSingleton.getInstance()` por todas partes, acoplamiento oculto.
- **Solución**: Inyección de dependencias; limitar el Singleton a infraestructura realmente única (logger, configuraciones) y aun así inyectarlo a través de una abstracción.

## 2. God Object (Objeto Dios)

- **Problema**: Una sola clase concentra demasiada responsabilidad y conocimiento (típico de un Mediator mal diseñado o una Facade que no delega).
- **Relación con patrones GoF**: Un **Mediator** que se vuelve omnisciente y contiene toda la lógica de interacción; un **Facade** que en lugar de simplificar, centraliza toda la lógica del subsistema.
- **Solución**: Refactorizar extrayendo responsabilidades a objetos colaboradores o aplicando Observer/Strategy para distribuir el comportamiento.

## 3. Ravioli Code (sobre-ingeniería de patrones)

- **Problema**: Aplicar patrones donde no hay necesidad real, generando multitud de clases pequeñas, indirecciones y código difícil de seguir.
- **Ejemplo típico**: Usar **Abstract Factory** + **Factory Method** + **Singleton** para crear dos tipos de objeto que podrían instanciarse con un simple `new`.
- **Síntoma**: “Por si acaso” se necesite flexibilidad futura (YAGNI – You Ain’t Gonna Need It).
- **Solución**: Empezar con el diseño más simple, y solo introducir el patrón cuando el dolor (complejidad, duplicación, rigidez) sea evidente.

## 4. Poltergeist (Objeto fantasma)

- **Problema**: Clases con un ciclo de vida corto y responsabilidad mínima, que solo invocan métodos de otra clase sin añadir valor (a veces un **Command** o **Strategy** que no encapsula ningún algoritmo real).
- **Solución**: Eliminar la indirección o reemplazarla con una función lambda si el lenguaje lo permite.

## 5. Cadena de responsabilidad sin fin (Chain of Responsibility mal formada)

- **Problema**: La petición recorre toda la cadena sin que ningún manejador la procese, o hay bucles inadvertidos.
- **Solución**: Asegurar siempre un manejador por defecto que procese o informe el error; evitar que un manejador reenvíe al anterior.

## 6. Observer mal gestionado (Lapsed Listener)

- **Problema**: Olvidar eliminar observadores en lenguajes sin gestión automática de memoria (C++) o retener referencias que impiden la recolección de basura (Java/C#), causando fugas de memoria.
- **Solución**: Usar referencias débiles (WeakReference) o mecanismos de suscripción con limpieza automática.

## 7. Estado distribuido (State/Strategy sin criterio)

- **Problema**: Implementar State pero manteniendo la lógica de transición tanto en el contexto como en los estados, o creando estados que no representan verdaderos estados del ciclo de vida.
- **Solución**: Definir claramente quién es responsable de las transiciones (el contexto o los estados) y ser consistente.

## 8. Visitor frágil

- **Problema**: La jerarquía de elementos cambia con frecuencia, obligando a modificar todos los visitantes. Es un antipatrón si la estructura visitada no es estable.
- **Solución**: Si los elementos cambian a menudo, usar otro mecanismo (pattern matching en lenguajes funcionales, o incluso Strategy en cada elemento).

## 9. Adapter / Decorator anidado excesivamente

- **Problema**: Varias capas de envoltura que dificultan la depuración y el rendimiento. Un objeto decorado 10 veces es difícil de entender.
- **Solución**: Limitar la profundidad, o usar otras formas de composición (macros, mixins).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Principios solid y patrones](03-principios-solid-y-patrones.md) | [🏠 Inicio](../index.md) | [Taxonomia y clasificacion ▶](05-taxonomia-y-clasificacion.md) |
