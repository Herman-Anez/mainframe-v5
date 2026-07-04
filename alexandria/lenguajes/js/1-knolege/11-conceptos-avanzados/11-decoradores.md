# Decoradores

## Propuesta de decoradores en ECMAScript

Los **decoradores** son una propuesta en evolución (actualmente en Stage 3) que añade la capacidad de modificar clases y sus miembros (propiedades, métodos, getters, setters) mediante una sintaxis declarativa con `@`. Inspirados en Python y Java, proporcionan una forma de metaprogramación.

Los decoradores **no son parte del estándar ES aún**, pero son ampliamente usados en TypeScript y entornos como Angular, NestJS, y mediante transpiladores (Babel).

## Sintaxis

Un decorador es una función que recibe información sobre el elemento decorado y puede devolver un nuevo descriptor, modificar el elemento o ejecutar lógica adicional.

```javascript
function sellado(constructor) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sellado
class MiClase {
  @soloLectura
  nombre = 'Ana';

  @log
  saludar() {
    console.log('Hola');
  }
}
```

- **Decorador de clase**: recibe el constructor y puede devolver un nuevo constructor o modificarlo.
- **Decorador de miembro de clase** (campo, método, getter, setter): recibe el prototipo (en métodos) o la clase (en estáticos), el nombre y un descriptor, que puede modificar o reemplazar.
- **Decorador de parámetro**: no es parte del decorator estándar actual; se usan en TypeScript experimental.

## Tipos de decoradores (según la propuesta actual)

### Decorador de clase

```javascript
function conPropiedadEstatica(valor) {
  return function(Constructor) {
    Constructor.version = valor;
  };
}

@conPropiedadEstatica('1.0')
class App {}
console.log(App.version); // '1.0'
```

### Decorador de método

```javascript
function log(target, propertyKey, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`Llamando a ${propertyKey} con`, args);
    const result = original.apply(this, args);
    console.log(`Resultado: ${result}`);
    return result;
  };
  return descriptor;
}

class Calculadora {
  @log
  sumar(a, b) {
    return a + b;
  }
}
```

### Decorador de campo (field)

En la propuesta actual, los decoradores de campo reciben un contexto con `access` para proveer un getter/setter, y pueden inicializar el campo.

```javascript
function upperCase(target, context) {
  return function(initialValue) {
    return initialValue.toUpperCase();
  };
}

class Usuario {
  @upperCase
  nombre = 'ana';
}
console.log(new Usuario().nombre); // 'ANA'
```

La propuesta ha cambiado varias veces; actualmente se basa en el concepto de **decorator context** que proporciona metadatos y la capacidad de reemplazar el valor.

## Decoradores en TypeScript (experimental)

TypeScript implementa una versión anterior de decoradores (basada en la antigua propuesta de TC39) con la bandera `experimentalDecorators`. Es la más utilizada hoy en día en frameworks.

- **Decorador de clase**: función que recibe el constructor.
- **Decorador de método**: `(target, propertyKey, descriptor)`.
- **Decorador de propiedad**: `(target, propertyKey)`.
- **Decorador de parámetro**: `(target, propertyKey, parameterIndex)`.

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // similar al ejemplo JS
}
```

## Casos de uso reales

- **Registro e inyección de dependencias**: Angular usa decoradores como `@Injectable()`, `@Component()`.
- **Validación**: class-validator con `@IsString()`, `@Min(0)`.
- **Serialización**: class-transformer con `@Expose()`, `@Transform()`.
- **ORM**: TypeORM con `@Entity()`, `@Column()`.
- **AOP (Programación Orientada a Aspectos)**: logging, métricas, autorización.
- **React**: antiguamente se usaban decoradores para conectar componentes a Redux (`@connect`), aunque hoy se prefieren hooks.

## Consideraciones y futuro

- La propuesta ha pasado por múltiples iteraciones y aún no está finalizada.
- Los decoradores actuales en TypeScript pueden tener diferencias con la futura implementación nativa.
- Al ser una característica de metaprogramación, deben usarse con moderación para no oscurecer la lógica.

---

Estos seis archivos proporcionan un conocimiento profundo de conceptos avanzados que extienden las capacidades de JavaScript en entornos web modernos y en la construcción de aplicaciones escalables y mantenibles.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Gestion de memoria](10-gestion-de-memoria.md) | [🏠 Inicio](../index.md) | ➖ |
