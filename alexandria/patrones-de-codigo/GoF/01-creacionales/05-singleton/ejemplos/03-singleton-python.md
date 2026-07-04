# Singleton python

En Python, el patrón Singleton se implementa frecuentemente sobrescribiendo el método especial `__new__`, usando un decorador, o aprovechando el módulo como Singleton por naturaleza.

## Ejemplo 1: Usando `__new__`

```python
class Configuration:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # Inicialización costosa aquí
            print("Cargando configuración...")
            cls._instance.language = "es"
            cls._instance.dark_mode = False
        return cls._instance

    def set_language(self, lang):
        self.language = lang

    def set_dark_mode(self, enabled):
        self.dark_mode = enabled

    def __str__(self):
        return f"Config[{self.language}, dark_mode={self.dark_mode}]"
```

**Uso:**
```python
c1 = Configuration()
c2 = Configuration()
print(c1 is c2)  # True
c1.set_language("en")
print(c2.language)  # "en"
```

> [!CAUTION]
> **Cuidado**: Si `__init__` se define, se llamará cada vez que se instancie, aunque `__new__` devuelva la misma instancia. La inicialización debe hacerse preferentemente en `__new__` o controlar con un flag.

## Ejemplo 2: Usando un decorador de clase

```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Logger:
    def __init__(self):
        print("Inicializando Logger...")
        self.log_file = "app.log"

    def log(self, message):
        print(f"[LOG] {message}")
```

**Uso:**
```python
logger1 = Logger()
logger2 = Logger()
print(logger1 is logger2)  # True
```

## Ejemplo 3: Singleton como módulo

En Python, un módulo se importa una sola vez; todos los clientes comparten el mismo espacio de nombres. Esto por sí solo constituye un Singleton natural.

**Archivo `config.py`:**
```python
language = "es"
dark_mode = False

def apply_theme():
    print(f"Aplicando tema: {language}, oscuro={dark_mode}")
```

**Uso en otros archivos:**
```python
import config

config.language = "en"
```

Cualquier otro módulo que importe `config` verá el cambio. No se requiere clase ni control alguno.

## Ejemplo 4: Usando una metaclase (más avanzado)

```python
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]

class DatabasePool(metaclass=SingletonMeta):
    def __init__(self):
        print("Creando pool de conexiones...")
        self.connections = ["conn1", "conn2"]
```

**Uso:**
```python
pool1 = DatabasePool()
pool2 = DatabasePool()
print(pool1 is pool2)  # True
```

La metaclase garantiza que solo exista una instancia por clase, sin interferir con la lógica de `__init__` (solo se llama una vez, cuando se crea la instancia).

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Singleton java](02-singleton-java.md) | [🏠 Inicio](../../../index.md) | [Adapter ▶](../../../02-estructurales/01-adapter/01-adapter.md) |
