# Template method java

## Ejemplo: Procesador de archivos de datos

Implementaremos un `DataMiner` abstracto que define el esqueleto para leer, analizar y generar informes. Las subclases `CsvMiner` y `JsonMiner` implementan los pasos variables.

```java
// ---------- AbstractClass ----------
abstract class DataMiner {
    // Método plantilla (final para evitar que sea sobrescrito)
    public final void mine(String filePath) {
        openFile(filePath);
        String rawData = readData();
        String analysis = analyzeData(rawData);
        generateReport(analysis);
        closeFile(filePath);
    }

    // Pasos comunes (ya implementados)
    protected void openFile(String path) {
        System.out.println("Abriendo archivo: " + path);
    }

    protected void closeFile(String path) {
        System.out.println("Cerrando archivo: " + path);
    }

    // Hook: paso por defecto que puede ser sobrescrito
    protected void generateReport(String analysis) {
        System.out.println("Generando informe: " + analysis);
    }

    // Métodos primitivos abstractos (deben ser implementados por subclases)
    protected abstract String readData();
    protected abstract String analyzeData(String rawData);
}

// ---------- ConcreteClasses ----------
class CsvMiner extends DataMiner {
    @Override
    protected String readData() {
        System.out.println("Leyendo datos CSV...");
        return "nombre,edad\nAlice,30\nBob,25";
    }

    @Override
    protected String analyzeData(String rawData) {
        System.out.println("Analizando datos CSV...");
        // Análisis específico para CSV
        long lineCount = rawData.lines().count() - 1; // sin cabecera
        return "Análisis CSV: " + lineCount + " registros encontrados";
    }
}

class JsonMiner extends DataMiner {
    @Override
    protected String readData() {
        System.out.println("Leyendo datos JSON...");
        return "{ \"users\": [{\"name\":\"Alice\",\"age\":30}, {\"name\":\"Bob\",\"age\":25}] }";
    }

    @Override
    protected String analyzeData(String rawData) {
        System.out.println("Analizando datos JSON...");
        // Análisis específico para JSON
        int userCount = 0;
        for (int i = 0; i < rawData.length() - 5; i++) {
            if (rawData.substring(i, i + 4).equals("name")) userCount++;
        }
        return "Análisis JSON: " + userCount + " usuarios encontrados";
    }

    // Sobrescribir hook para generar informe en formato JSON
    @Override
    protected void generateReport(String analysis) {
        System.out.println("{ \"report\": \"" + analysis + "\" }");
    }
}

// ---------- Cliente ----------
public class TemplateMethodDemo {
    public static void main(String[] args) {
        DataMiner csvMiner = new CsvMiner();
        csvMiner.mine("datos.csv");

        System.out.println("---");

        DataMiner jsonMiner = new JsonMiner();
        jsonMiner.mine("datos.json");
    }
}
```

**Salida esperada:**
```
Abriendo archivo: datos.csv
Leyendo datos CSV...
Analizando datos CSV...
Generando informe: Análisis CSV: 2 registros encontrados
Cerrando archivo: datos.csv
---
Abriendo archivo: datos.json
Leyendo datos JSON...
Analizando datos JSON...
{ "report": "Análisis JSON: 2 usuarios encontrados" }
Cerrando archivo: datos.json
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ template-method.puml](../diagramas/04-template-methodpuml.md) | [🏠 Inicio](../../../index.md) | [Template method python ▶](03-template-method-python.md) |
