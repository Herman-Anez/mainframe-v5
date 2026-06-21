# Metáfora del hexágono

## ¿Por qué un hexágono?
Cockburn eligió el hexágono por varias razones:
- Un cuadrado haría pensar en “cuatro capas” (up/down/left/right) o en dos tipos de puertos (entrada/salida). Un hexágono deja claro que no hay un número predefinido de lados; cada lado es un puerto distinto.
- Visualmente, permite dibujar el núcleo en el centro y los adaptadores en los extremos de cada lado, reforzando la idea de simetría: un adaptador de entrada (driving) y uno de salida (driven) se sitúan en lados diferentes pero conceptualmente equivalentes.
- La forma no es importante, lo relevante es la idea de “adentro vs. afuera”.

## Adentro y afuera
- **Adentro**: el dominio, las reglas de negocio, los servicios de aplicación que orquestan casos de uso, los puertos (interfaces). No conoce absolutamente nada del exterior.
- **Afuera**: los adaptadores que implementan los puertos y las tecnologías concretas. Pueden ser sustituidos sin que el interior lo note.

La comunicación entre adentro y afuera se produce exclusivamente mediante los puertos. Un adaptador nunca salta el puerto para acceder directamente a una entidad de dominio; siempre utiliza la interfaz definida.

## Simetría en el trato
Un mismo puerto puede tener múltiples adaptadores. Por ejemplo, una interfaz `Notificador` (puerto secundario) puede ser implementada por un adaptador que envía correos electrónicos y otro que publica eventos en un sistema de mensajería. El dominio no sabe cuál de ellos se está usando.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Principios](02-principios.md) | [🏠 Inicio](../index.md) | [Puertos ▶](04-puertos.md) |
