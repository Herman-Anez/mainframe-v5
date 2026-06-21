# `interfaces de linea de comandos

## Rol en la arquitectura hexagonal

Una **interfaz de línea de comandos (CLI)** es otro tipo de adaptador primario. Permite que un usuario (humano o script) interactúe con el sistema mediante comandos de texto y opciones. Al igual que un controlador web, traduce la entrada textual a comandos del núcleo y presenta los resultados por consola. La CLI es simétrica a la API REST: ambas invocan los mismos puertos primarios, demostrando la independencia del canal de entrada.

La CLI es especialmente útil para:
- Pruebas manuales rápidas de la lógica de negocio sin necesidad de un servidor HTTP.
- Automatización y tareas programadas (cron jobs, CI/CD).
- Administración del sistema (migraciones, comandos de mantenimiento).
- Proporcionar una experiencia de desarrollo más directa.

## Estructura típica de un adaptador CLI

1. **Punto de entrada**: archivo ejecutable que arranca la CLI (por ejemplo, `cli.js`, `Program.cs`, clase con `main`).
2. **Parseo de argumentos**: librería CLI que analiza los argumentos de la línea de comandos (comandos, subcomandos, opciones, flags) y construye una estructura de configuración.
3. **Mapeo a comandos del núcleo**: conversión de los valores parseados a los comandos/consultas del dominio.
4. **Invocación del puerto primario**: igual que en un controlador web.
5. **Salida formateada**: presentación del resultado en la consola (tablas, JSON, texto plano, colores) y manejo de errores.

## Principios de diseño

- **Separar parsing de ejecución**: La lógica de parseo de argumentos no debe mezclarse con la lógica de negocio. El comando parseado se pasa a un método que solo invoca el puerto primario.
- **Usar los mismos puertos primarios**: No crear casos de uso diferentes para la CLI. Se reutilizan exactamente los mismos contratos que usa la API web. Así se garantiza que cualquier cambio en la lógica de negocio se refleje en ambas interfaces.
- **Manejo de la salida**: La CLI puede emitir JSON para scripts, o tablas legibles para humanos. El adaptador elige el formato, pero el contenido es generado por el dominio (DTOs).
- **Validación temprana**: Los argumentos se validan sintácticamente en el parser (tipos, rangos) antes de construir el comando. Si se usa un value object del dominio como parte del parseo, la validación del dominio se ejecutará automáticamente.

## Ejemplo con Node.js (Commander.js)

```javascript
// cli.js
import { Command } from 'commander';
import { gestionPedidos } from './dependencias.js'; // Puerto primario
import { ClienteId } from './domain/model/ClienteId.js';

const program = new Command();

program
  .command('crear-pedido')
  .requiredOption('--cliente-id <id>', 'ID del cliente')
  .option('--linea <items...>', 'Líneas en formato prodId,cant,precio,moneda')
  .action(async (options) => {
    try {
      const lineas = options.linea.map(parsearLinea);
      // Construir comando del núcleo (puede usar el mismo TransportMapper adaptado)
      const comando = { clienteId: new ClienteId(options.clienteId), lineas };
      const id = await gestionPedidos.crearPedido(comando);
      console.log(`Pedido creado con ID: ${id.valor}`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
```

La función `parsearLinea` convierte una cadena como `"P01,2,19.99,EUR"` en un `SolicitudLinea`. Todo el mapeo reside en el adaptador, nunca en el dominio.

## Ejemplo con .NET (System.CommandLine)

```csharp
// Program.cs
using System.CommandLine;
using Microsoft.Extensions.DependencyInjection;

var servicios = new ServiceCollection()
    .AddSingleton<IGestionPedidos, PedidoApplicationService>() // cableado
    .BuildServiceProvider();

var clienteIdOption = new Option<string>("--cliente-id") { IsRequired = true };
var lineasOption = new Option<string[]>("--linea") { AllowMultipleArgumentsPerToken = true };

var crearPedidoCommand = new Command("crear-pedido", "Crea un nuevo pedido")
{
    clienteIdOption,
    lineasOption
};

crearPedidoCommand.SetHandler(async (string clienteId, string[] lineas) =>
{
    var gestion = servicios.GetRequiredService<IGestionPedidos>();
    var lineasSolicitud = lineas.Select(ParsearLinea).ToList();
    var comando = new CrearPedidoCommand(new ClienteId(clienteId), lineasSolicitud);
    var id = await gestion.CrearPedidoAsync(comando);
    Console.WriteLine($"Pedido creado: {id.Valor}");
}, clienteIdOption, lineasOption);

await crearPedidoCommand.InvokeAsync(args);
```

Aquí el servicio de aplicación se obtiene del contenedor de DI, demostrando que la CLI puede compartir la misma configuración que el resto del sistema.

## Ejemplo con Java (Picocli)

```java
@Command(name = "crear-pedido", description = "Crea un nuevo pedido")
public class CrearPedidoCommand implements Runnable {

    @Option(names = {"--cliente-id"}, required = true)
    private String clienteId;

    @Option(names = {"--linea"}, split = ",")
    private List<String> lineas;

    private IGestionPedidos gestionPedidos; // Inyectado

    @Override
    public void run() {
        List<SolicitudLinea> solicitudes = lineas.stream()
            .map(this::parsearLinea)
            .collect(Collectors.toList());
        CrearPedidoCommand comando = new CrearPedidoCommand(new ClienteId(clienteId), solicitudes);
        PedidoId id = gestionPedidos.crearPedido(comando);
        System.out.println("Pedido creado con ID: " + id.getValor());
    }
    // ...
}
```

Se puede ejecutar desde el `main` con `new CommandLine(new CrearPedidoCommand()).execute(args)`.

## Testing de adaptadores CLI

Los adaptadores CLI se prueban de dos formas:
- **Test unitario del mapeo y lógica de parseo**: Se ejecuta el comando con argumentos simulados, mockeando el puerto primario. Se verifica que los argumentos se parsean correctamente, que el comando se construye como se espera y que el puerto se invoca con los valores adecuados.
- **Test de integración**: Se ejecuta el proceso real con un script y se captura la salida estándar. Se puede usar un puerto primario real en memoria (con dobles de repositorios) para verificar el comportamiento completo.

```javascript
// test con Node.js usando child_process o mock
import { gestionPedidos } from './mockPuerto.js';
// mock de gestionPedidos.crearPedido con jest.spyOn
// ejecutar el handler del comando con opciones simuladas y verificar la salida
```

## Buenas prácticas

- **Reutilizar la misma factoría de comandos/consultas**: No duplicar la construcción de objetos del núcleo. Si se tiene un `TransportMapper` para la API web, puede reutilizarse o extenderse para la CLI.
- **Ofrecer salida en múltiples formatos**: Permitir flags como `--json` para que scripts puedan parsear el resultado.
- **Mensajes de error consistentes**: Al igual que en HTTP, mapear excepciones de dominio a mensajes claros y códigos de salida distintos de cero.
- **Mantener la CLI ligera**: Si la CLI requiere cargar dependencias pesadas, considerar un perfil de DI específico que evite iniciar módulos innecesarios (por ejemplo, sin conexión a Kafka).
- **Simetría con la UI web**: La misma operación ejecutada por CLI y por REST debe producir los mismos efectos de negocio y eventos, demostrando la correcta implementación de la arquitectura hexagonal.

---

Al igual que con los controladores web, las interfaces de línea de comandos son solo otra cara del hexágono, enchufadas a los mismos puertos primarios. La arquitectura permite añadir, eliminar o cambiar estos adaptadores de presentación sin que el núcleo del negocio sufra ningún impacto.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ `controladores web](01-`controladores-web.md) | [🏠 Inicio](../../index.md) | [Propósito y ubicación ▶](../4-configuracion-y-cableado/01-proposito-y-ubicacion.md) |
