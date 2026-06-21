# Proxy y reflect

## Proxy

El objeto `Proxy` permite crear un intermediario (wrapper) alrededor de un objeto objetivo y redefinir operaciones fundamentales mediante **trampas (traps)**.

```javascript
const objetivo = { nombre: 'Ana' };
const handler = {
  get(target, prop, receiver) {
    console.log(`Acceso a propiedad "${prop}"`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Asignando ${prop} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};
const proxy = new Proxy(objetivo, handler);
proxy.nombre;            // Log: Acceso a propiedad "nombre"
proxy.edad = 30;         // Log: Asignando edad = 30
```

El `receiver` es el propio proxy o el objeto que recibe la operación, útil cuando el proxy está en la cadena de prototipos.

### Trampas disponibles

El handler puede definir las siguientes trampas, que interceptan operaciones internas:

- `get`, `set`, `deleteProperty`
- `has` (operador `in`)
- `ownKeys` (Object.keys, for...in)
- `apply` (llamada a función)
- `construct` (operador new)
- `defineProperty`, `getOwnPropertyDescriptor`
- `preventExtensions`, `isExtensible`
- `getPrototypeOf`, `setPrototypeOf`

### Casos de uso prácticos

#### Validación de propiedades

```javascript
function crearObjetoValidado(esquema) {
  return new Proxy({}, {
    set(target, prop, value) {
      if (prop in esquema && typeof value !== esquema[prop]) {
        throw new TypeError(`${prop} debe ser ${esquema[prop]}`);
      }
      target[prop] = value;
      return true;
    }
  });
}
const persona = crearObjetoValidado({ nombre: 'string', edad: 'number' });
persona.nombre = 'Luis'; // OK
persona.edad = '30';     // Error
```

#### Reactividad al estilo Vue

Vue 3 utiliza `Proxy` para detectar cambios y actualizar la UI.

```javascript
function crearReactivo(objetivo, callback) {
  return new Proxy(objetivo, {
    set(target, prop, value, receiver) {
      const old = target[prop];
      const result = Reflect.set(target, prop, value, receiver);
      if (old !== value) callback(prop, value, old);
      return result;
    }
  });
}
```

#### Registro y auditoría (logging)

Registrar todas las interacciones con un objeto para depuración.

#### Acceso seguro a propiedades profundas (sin errores)

```javascript
const safeHandler = {
  get(target, prop) {
    return prop in target ? target[prop] : {};
  }
};
const safeObj = new Proxy({}, safeHandler);
const valor = safeObj.a.b.c; // no lanza error, devuelve {} (o se puede afinar para devolver undefined)
```

#### Objetos virtuales y simulación de APIs

Se puede simular un objeto con miles de propiedades sin almacenarlas todas, generándolas bajo demanda.

#### Revocable Proxy

`Proxy.revocable(objetivo, handler)` devuelve un objeto con `proxy` y `revoke`. Al llamar a `revoke()`, cualquier operación en el proxy lanza `TypeError`. Útil para conceder acceso temporal a un recurso.

```javascript
const { proxy, revoke } = Proxy.revocable({}, {});
proxy.a = 1;
revoke();
proxy.a; // TypeError
```

## Reflect

`Reflect` es un objeto incorporado que proporciona métodos estáticos equivalentes a las trampas de proxy, realizando las operaciones por defecto. Su uso dentro de un proxy facilita delegar al comportamiento original.

```javascript
const handler = {
  set(target, prop, value, receiver) {
    if (prop === 'id') throw new Error('No se puede modificar id');
    return Reflect.set(target, prop, value, receiver);
  }
};
```

### Métodos de Reflect

- `Reflect.get(target, prop, receiver?)`
- `Reflect.set(target, prop, value, receiver?)`
- `Reflect.has(target, prop)`
- `Reflect.deleteProperty(target, prop)`
- `Reflect.apply(func, thisArg, args)`
- `Reflect.construct(Constructor, args, newTarget?)`
- `Reflect.defineProperty`, `Reflect.getOwnPropertyDescriptor`, etc.

### Ventajas de Reflect

- Centraliza la funcionalidad que antes estaba dispersa en `Object` y operadores (`in`, `delete`).
- Proporciona valores de retorno consistentes (ej. `Reflect.set` devuelve `true`/`false`, mientras que una asignación directa no).
- `Reflect.apply` y `Reflect.construct` son más legibles y seguros que `Function.prototype.apply` o `new`.

### Proxy + Reflect en la práctica

Siempre que se escribe un handler, se suele usar `Reflect` para no romper el comportamiento esperado y solo interceptar lo necesario. Por ejemplo, al interceptar `get`, se puede llamar a `Reflect.get` para obtener el valor real y luego modificarlo.

```javascript
const handler = {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'string' ? value.toUpperCase() : value;
  }
};
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Currying y composicion](02-currying-y-composicion.md) | [🏠 Inicio](../index.md) | [Symbols iteradores ▶](04-symbols-iteradores.md) |
