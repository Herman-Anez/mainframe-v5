# Por qué Storybook se quedaba cargando para siempre (explicado sin dar por sentado nada)

## El síntoma

Corrías `pnpm exec storybook dev -p 6006`, abrías el navegador, y cualquier story se quedaba con el spinner de carga infinito. Nunca terminaba de renderizar. Nada de errores visibles en pantalla — solo carga eterna.

## Paso 1: ¿qué es `__dirname`?

En Node.js "clásico" (el sistema de módulos viejo, llamado **CommonJS**), cada archivo `.js` tiene automáticamente disponible una variable mágica llamada `__dirname`. Contiene la ruta absoluta de la carpeta donde vive ese archivo. Por ejemplo, si tenés un archivo en `/home/tu-usuario/proyecto/src/utils.js`, dentro de ese archivo `__dirname` vale `/home/tu-usuario/proyecto/src`.

Muchas librerías viejas de Node usan `__dirname` para, por ejemplo, encontrar archivos relativos a donde está el código (`path.join(__dirname, 'data.json')`).

## Paso 2: ¿por qué `__dirname` a veces NO existe?

Existe un sistema de módulos más nuevo llamado **ESM** (ECMAScript Modules — el que usa `import`/`export` en vez de `require`/`module.exports`). Cuando tu código corre como ESM puro (que es lo que hacen las herramientas modernas como **Vite**, que es lo que usa Storybook por debajo), la variable `__dirname` **no existe**. Es una decisión de diseño del estándar ESM: en su lugar tenés que armarla vos mismo con `import.meta.url` y unas funciones de Node.

Entonces: si un archivo fue escrito asumiendo CommonJS (`__dirname` disponible) pero termina ejecutándose dentro de un entorno ESM/Vite, y ese archivo intenta usar `__dirname`... explota con:

```
ReferenceError: __dirname is not defined
```

## Paso 3: ¿de dónde salía ese error en nuestro caso?

Nuestra app usa Next.js. Next.js, internamente, trae una librería llamada `ua-parser-js` (sirve para detectar qué navegador/dispositivo está usando el visitante). Esa librería fue escrita para CommonJS y usa `__dirname`.

Once UI (la librería de componentes, `@once-ui-system/core`) tiene algunas funciones que se conectan con partes internas de Next.js (`handleOGFetch`, para generar imágenes de vista previa tipo "Open Graph"). Al importar Once UI completo desde una story de Storybook, sin querer se arrastra ese código de Next.js por detrás — incluyendo `ua-parser-js` — y Storybook, que corre todo a través de Vite (o sea, en modo ESM), se encuentra con el `__dirname` que no existe. Crash silencioso dentro del iframe donde se dibuja la story. Por eso la pantalla se quedaba cargando para siempre: el componente nunca llegaba a renderizarse, pero tampoco mostraba un error visible al usuario.

## Paso 4: ¿por qué los tests (`vitest`) sí funcionaban?

Porque el archivo `vitest.config.ts` (que corre los tests con un navegador real controlado por Playwright) **ya tenía el arreglo puesto** desde el principio, cuando se configuró Storybook por primera vez. Pero ese arreglo solo estaba en la configuración de los tests, nunca se copió a la configuración real del servidor de desarrollo (`storybook dev`). Por eso los tests pasaban perfecto (94/94, etc.) pero abrir Storybook en el navegador de verdad fallaba. Dos configuraciones distintas, el arreglo estaba solo en una.

## Paso 5: la solución — "definir" `__dirname` a mano

Vite tiene una opción de configuración llamada `define`. Sirve para decirle: "en todo el código que vayas a empaquetar, cuando encuentres el texto `X`, reemplazalo literalmente por el texto `Y`, antes de ejecutar nada". Es un reemplazo de texto que pasa en el momento de construir el paquete (build time), no mientras el programa corre.

Entonces la solución es: calculamos nosotros mismos la carpeta actual usando la forma correcta en ESM (`import.meta.url` + una función que convierte esa URL en una ruta de carpeta), y le decimos a Vite: "en cualquier lugar donde el código diga `__dirname`, poné directamente esta ruta ya calculada". Así, cuando `ua-parser-js` intenta usar `__dirname`, en realidad Vite ya lo reemplazó por un texto fijo (un string), y el error de "no está definida" desaparece — porque ya no es una variable que falta, es un valor que ya está ahí desde antes de correr.

## El código exacto, línea por línea

Archivo: `.storybook/main.ts`

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
```
Importamos dos herramientas de Node: `path` (para trabajar con rutas de archivos) y `fileURLToPath` (para convertir una URL tipo `file:///...` en una ruta normal tipo `/home/...`).

```ts
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
```
Esto es un "por las dudas". Primero pregunta: ¿existe `__dirname` en este entorno? (podría existir si por algún motivo el archivo corre en modo CommonJS). Si existe, lo usa directamente. Si NO existe (que es el caso normal acá, porque este archivo de configuración también es ESM), lo calculamos a mano:
- `import.meta.url` te da la URL del archivo actual, algo como `file:///home/tu-usuario/proyecto/.storybook/main.ts`
- `fileURLToPath(...)` convierte esa URL en una ruta de archivo normal: `/home/tu-usuario/proyecto/.storybook/main.ts`
- `path.dirname(...)` se queda solo con la carpeta, sacando el nombre del archivo: `/home/tu-usuario/proyecto/.storybook`

Al final, `dirname` tiene la ruta de la carpeta `.storybook`, calculada de forma segura sin depender de que `__dirname` exista.

```ts
viteFinal: async (viteConfig) => {
  viteConfig.define = {
    ...viteConfig.define,
    __dirname: JSON.stringify(dirname),
  };
  return viteConfig;
},
```
`viteFinal` es un "gancho" que Storybook te deja usar para modificar la configuración de Vite antes de que arranque. Acá:
- `...viteConfig.define` copia cualquier configuración de `define` que ya existiera antes (para no borrar nada).
- `__dirname: JSON.stringify(dirname)` agrega la regla nueva: "reemplazá `__dirname` por el valor de la variable `dirname`". El `JSON.stringify` es necesario porque `define` espera que el valor de reemplazo sea un pedazo de código válido en formato texto — si pusiéramos el string pelado (`/home/.../. storybook`), Vite lo interpretaría como código JavaScript real (una división, variables sueltas) y rompería todo. `JSON.stringify("/algo")` produce `"\"/algo\""`, o sea el texto con las comillas incluidas, para que al reemplazarlo quede como un string de JavaScript válido: `__dirname` se convierte literalmente en `"/home/.../.storybook"` dentro del código final.

## Resumen en una frase

Le enseñamos a Vite a reemplazar, antes de arrancar, cualquier uso de la variable vieja `__dirname` (que no existe en el mundo moderno de ESM) por un texto fijo con la ruta correcta — copiando exactamente el mismo truco que ya estaba funcionando en la configuración de los tests, pero aplicado también a la configuración real del servidor de Storybook, que es la que faltaba.
