# Facade python

```python
# ---------- Clases del subsistema ----------
class Lexer:
    def tokenize(self, source: str) -> None:
        print(f"Lexer: Tokenizando '{source}'")

class Parser:
    def parse(self, tokens: str) -> None:
        print(f"Parser: Analizando tokens '{tokens}'")

class CodeGenerator:
    def generate_code(self, parse_tree: str) -> str:
        print(f"CodeGen: Generando código desde '{parse_tree}'")
        return "101010"

class Linker:
    def link(self, object_code: str) -> str:
        print(f"Linker: Enlazando código '{object_code}'")
        return "ejecutable"

# ---------- Fachada ----------
class Compiler:
    def __init__(self):
        self.lexer = Lexer()
        self.parser = Parser()
        self.code_gen = CodeGenerator()
        self.linker = Linker()

    def compile(self, source: str) -> str:
        self.lexer.tokenize(source)
        tokens = "lista_de_tokens"  # simplificación
        self.parser.parse(tokens)
        parse_tree = "arbol_sintactico"
        object_code = self.code_gen.generate_code(parse_tree)
        executable = self.linker.link(object_code)
        return executable

# ---------- Cliente ----------
if __name__ == "__main__":
    compiler = Compiler()
    result = compiler.compile("código fuente")
    print(f"Resultado: {result}")
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Facade java](02-facade-java.md) | [🏠 Inicio](../../../index.md) | [Flyweight ▶](../../06-flyweight/01-flyweight.md) |
