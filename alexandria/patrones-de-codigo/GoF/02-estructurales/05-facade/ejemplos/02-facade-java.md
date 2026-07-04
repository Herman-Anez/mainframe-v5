# Facade java

## Ejemplo: Fachada de un sistema de compilación

Modelaremos un compilador simplificado con varios subsistemas: `Lexer`, `Parser`, `CodeGenerator` y `Linker`. La fachada `Compiler` expone un único método `compile()`.

```java
// ---------- Clases del subsistema ----------
class Lexer {
    public void tokenize(String source) {
        System.out.println("Lexer: Tokenizando '" + source + "'");
    }
}

class Parser {
    public void parse(String tokens) {
        System.out.println("Parser: Analizando tokens '" + tokens + "'");
    }
}

class CodeGenerator {
    public String generateCode(String parseTree) {
        System.out.println("CodeGen: Generando código desde '" + parseTree + "'");
        return "101010";
    }
}

class Linker {
    public String link(String objectCode) {
        System.out.println("Linker: Enlazando código '" + objectCode + "'");
        return "ejecutable";
    }
}

// ---------- Fachada ----------
class Compiler {
    private Lexer lexer;
    private Parser parser;
    private CodeGenerator codeGenerator;
    private Linker linker;

    public Compiler() {
        this.lexer = new Lexer();
        this.parser = new Parser();
        this.codeGenerator = new CodeGenerator();
        this.linker = new Linker();
    }

    public String compile(String source) {
        // El cliente no sabe nada de este proceso interno
        lexer.tokenize(source);
        String tokens = "lista_de_tokens";  // simplificación
        parser.parse(tokens);
        String parseTree = "arbol_sintactico";
        String objectCode = codeGenerator.generateCode(parseTree);
        String executable = linker.link(objectCode);
        return executable;
    }
}

// ---------- Cliente ----------
public class FacadeDemo {
    public static void main(String[] args) {
        Compiler compiler = new Compiler();
        String result = compiler.compile("código fuente");
        System.out.println("Resultado: " + result);
    }
}
```

**Salida esperada:**
```
Lexer: Tokenizando 'código fuente'
Parser: Analizando tokens 'lista_de_tokens'
CodeGen: Generando código desde 'arbol_sintactico'
Linker: Enlazando código '101010'
Resultado: ejecutable
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ facade.puml](../diagramas/04-facadepuml.md) | [🏠 Inicio](../../../index.md) | [Facade python ▶](03-facade-python.md) |
