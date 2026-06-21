# Políticas y especificaciones

Estos dos patrones encapsulan reglas de negocio que pueden variar con frecuencia o combinarse entre sí.

## Especificaciones (Specification)

### Definición
Una especificación es un predicado que evalúa si un objeto cumple una determinada condición de negocio. Se modela como un objeto que encapsula una regla lógica reutilizable y combinable (AND, OR, NOT).

### Rol en la hexagonal
- Residen en el dominio, porque son reglas de negocio puras.
- Permiten probar condiciones complejas de forma aislada.
- Se pueden inyectar en servicios de dominio o en entidades para evaluar criterios cambiantes sin modificar el código de la entidad.
- Ayudan a implementar consultas: un repositorio puede recibir una especificación y traducirla a una consulta SQL/NoSQL (siempre que el patrón no filtre infraestructura al dominio; normalmente se pasa una representación abstracta o se implementa un visitor).

### Ejemplo
```java
public class ClientePremiumSpec implements Specification<Cliente> {
    public boolean seCumple(Cliente cliente) {
        return cliente.getVolumenCompras().esMayorQue(new Dinero("5000", "EUR"));
    }
}

// Uso en un servicio de dominio
if (clientePremiumSpec.seCumple(cliente)) {
    descuento = new Porcentaje(15);
}
```
Especificaciones compuestas:
```java
Specification<Cliente> vip = new ClientePremiumSpec().and(new ClienteAntiguedadSpec(2, AÑOS));
```

## Políticas (Policies)

### Definición
Una política es un objeto que encapsula una estrategia de negocio que puede variar. A diferencia de una especificación (que responde a una pregunta booleana), una política ejecuta una acción o calcula un resultado concreto siguiendo una regla de negocio.

### Rol en la hexagonal
- Residen en el dominio y representan reglas que podrían externalizarse o cambiarse según el contexto.
- Suelen implementarse con el patrón Strategy: se define una interfaz en el dominio y múltiples implementaciones (todas dentro del dominio). El servicio de aplicación o una fábrica elige la política adecuada según parámetros.
- Inyección de políticas: se pueden inyectar en servicios de dominio a través de sus constructores; el cableado (configuración) decide qué política se utiliza.

### Ejemplo
```java
public interface PoliticaDescuento {
    Dinero aplicarDescuento(Pedido pedido, Cliente cliente);
}

public class DescuentoPorVolumen implements PoliticaDescuento { ... }
public class DescuentoPorFidelidad implements PoliticaDescuento { ... }
```
El servicio de dominio recibe la política adecuada sin saber cuál es. Esto cumple el Principio de Inversión de Dependencias a nivel de dominio: la política es una abstracción, las variantes son detalles.

## Mejores prácticas
- **No abusar**: no cualquier `if` debe ser una especificación o política; solo cuando la regla cambia independientemente o se combina dinámicamente.
- **Separar validaciones de especificaciones**: una especificación puede lanzar una excepción si se usa para validar, pero a menudo solo informa un booleano. La validación se realiza en la entidad o servicio de dominio.
- **Persistencia**: Si se necesita persistir qué política se aplicó, se puede guardar un identificador de la política en el agregado o en un evento de dominio.
- **No filtrar infraestructura**: Las especificaciones y políticas no deben contener referencias a repositorios ni servicios externos, porque son objetos de dominio puro.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Fábricas](02-fabricas.md) | [🏠 Inicio](../index.md) | [Publicador de eventos de dominio ▶](04-publicador-de-eventos-de-dominio.md) |
