/**
 * ============================================================
 *  bind() en JavaScript - Explicación y ejemplos prácticos
 * ============================================================
 *
 * El método .bind() crea una nueva función que, cuando se invoca,
 * tiene su valor 'this' fijado al objeto que se pasa como argumento.
 * Además, permite pre-fijar argumentos (currying parcial).
 *
 * Sintaxis: funcion.bind(thisArg[, arg1[, arg2[, ...]]])
 *
 * Características principales:
 *  - No ejecuta la función de inmediato, devuelve una nueva función.
 *  - El 'this' queda ligado permanentemente al objeto proporcionado.
 *  - Se pueden pasar argumentos adicionales que se antepondrán a los
 *    argumentos que reciba la función cuando sea llamada.
 *  - Útil para eventos, temporizadores, y para crear funciones con
 *    contexto fijo.
 *
 * Diferencia con call() y apply():
 *  - call() y apply() ejecutan la función inmediatamente.
 *  - bind() devuelve una nueva función lista para ser ejecutada después.
 *
 * ============================================================
 */

// ============================================================
//  EJEMPLO 1: Fijar el contexto 'this'
// ============================================================

const persona = {
  nombre: 'Ana',
  apellido: 'Pérez',
  nombreCompleto: function() {
    return `${this.nombre} ${this.apellido}`;
  }
};

const otraPersona = {
  nombre: 'Luis',
  apellido: 'Gómez'
};

// Sin bind: el método nombreCompleto usa el 'this' de persona
console.log(persona.nombreCompleto()); // "Ana Pérez"

// Usamos bind para crear una nueva función con 'this' fijo a otraPersona
const nombreCompletoLuis = persona.nombreCompleto.bind(otraPersona);
console.log(nombreCompletoLuis()); // "Luis Gómez"

// ============================================================
//  EJEMPLO 2: Argumentos predefinidos (currying parcial)
// ============================================================

function multiplicar(a, b) {
  return a * b;
}

// Creamos una función que siempre multiplica por 2
const duplicar = multiplicar.bind(null, 2); // El primer argumento (this) no importa aquí
console.log(duplicar(5)); // 10 (2 * 5)

// También podemos fijar varios argumentos
const triplicarYSumar = multiplicar.bind(null, 3, 10); // fija a=3, b=10
console.log(triplicarYSumar()); // 30 (3 * 10)

// ============================================================
//  EJEMPLO 3: Uso con temporizadores (setTimeout) y eventos
// ============================================================

const contador = {
  valor: 0,
  incrementar: function() {
    this.valor++;
    console.log(`Valor actual: ${this.valor}`);
  }
};

// Sin bind: al pasar contador.incrementar a setTimeout, pierde el 'this'
// setTimeout(contador.incrementar, 1000); // this => window, NaN o error

// Con bind: fijamos el 'this' a contador
setTimeout(contador.incrementar.bind(contador), 1000);
// Después de 1 segundo: "Valor actual: 1"

// Ejemplo con addEventListener (simulado)
const boton = {
  clicks: 0,
  handleClick: function() {
    this.clicks++;
    console.log(`Clicks en botón: ${this.clicks}`);
  }
};

// En un entorno real: botonElement.addEventListener('click', boton.handleClick.bind(boton));
// Simulamos una llamada:
const boundClick = boton.handleClick.bind(boton);
boundClick(); // "Clicks en botón: 1"
boundClick(); // "Clicks en botón: 2"

// ============================================================
//  EJEMPLO 4: Comparación con call() y apply()
// ============================================================

function saludar(saludo, puntuacion) {
  console.log(`${saludo}, ${this.nombre}${puntuacion}`);
}

const usuario = { nombre: 'Carlos' };

// call: ejecuta inmediatamente con argumentos separados
saludar.call(usuario, 'Hola', '!'); // "Hola, Carlos!"

// apply: ejecuta inmediatamente con argumentos en array
saludar.apply(usuario, ['Hey', '...']); // "Hey, Carlos..."

// bind: devuelve una nueva función, no ejecuta
const saludarCarlos = saludar.bind(usuario, 'Buen día');
saludarCarlos('.'); // "Buen día, Carlos."

// ============================================================
//  EJEMPLO 5: Crear funciones reutilizables con bind
// ============================================================

const logger = {
  nivel: 'INFO',
  log: function(mensaje) {
    console.log(`[${this.nivel}] ${mensaje}`);
  }
};

// Creamos versiones especializadas
const logInfo = logger.log.bind(logger, 'Información:');
const logError = logger.log.bind({ nivel: 'ERROR' }, '¡Error!');

logInfo('Todo bien'); // "[INFO] Información: Todo bien"
logError('Algo falló'); // "[ERROR] ¡Error! Algo falló"

// ============================================================
//  EJEMPLO 6: bind en métodos de clase (ES6)
// ============================================================

class Reloj {
  constructor() {
    this.tiempo = 0;
    // Enlazamos el método tick para que siempre tenga el this correcto
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.tiempo++;
    console.log(`Tiempo: ${this.tiempo}s`);
  }

  iniciar() {
    // Ahora podemos pasar this.tick sin perder el contexto
    setInterval(this.tick, 1000);
  }
}

// Descomentar para probar (cuidado con el intervalo)
// const miReloj = new Reloj();
// miReloj.iniciar();

// ============================================================
//  RESUMEN
// ============================================================
//  - bind() fija el 'this' y devuelve una nueva función.
//  - Permite prefijar argumentos (currying).
//  - No ejecuta la función, a diferencia de call/apply.
//  - Esencial para pasar métodos como callbacks sin perder contexto.
// ============================================================