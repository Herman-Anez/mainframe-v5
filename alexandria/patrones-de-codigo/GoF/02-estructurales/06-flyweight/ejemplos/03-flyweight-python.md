# Flyweight python

Mismo ejemplo en Python. Usaremos un diccionario en la fábrica para almacenar los flyweights.

```python
# ---------- Flyweight ----------
class Glyph:
    def draw(self, x: int, y: int, font: str) -> None:
        raise NotImplementedError

# ---------- ConcreteFlyweight ----------
class CharacterGlyph(Glyph):
    def __init__(self, symbol: str):
        self.symbol = symbol  # estado intrínseco inmutable

    def draw(self, x: int, y: int, font: str) -> None:
        print(f"Dibujando '{self.symbol}' en ({x},{y}) con fuente {font}")

# ---------- FlyweightFactory ----------
class GlyphFactory:
    def __init__(self):
        self._glyphs: dict[str, Glyph] = {}

    def get_glyph(self, character: str) -> Glyph:
        if character not in self._glyphs:
            print(f"Creando nuevo flyweight para: '{character}'")
            self._glyphs[character] = CharacterGlyph(character)
        return self._glyphs[character]

    @property
    def count(self) -> int:
        return len(self._glyphs)

# ---------- Cliente ----------
class TextEditor:
    def __init__(self):
        self.factory = GlyphFactory()

    def render_text(self, text: str, start_x: int, start_y: int, font: str):
        x = start_x
        y = start_y
        for ch in text:
            glyph = self.factory.get_glyph(ch)
            glyph.draw(x, y, font)
            x += 10  # avance simplificado

if __name__ == "__main__":
    editor = TextEditor()
    editor.render_text("Hola Mundo", 0, 0, "Arial")
    print("---")
    editor.render_text("Hola", 100, 50, "Times New Roman")
    print("---")
    editor.render_text("Hello World", 0, 100, "Arial")
    print(f"Total flyweights creados: {editor.factory.count}")
```

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ Flyweight java](02-flyweight-java.md) | [🏠 Inicio](../../../index.md) | [Proxy ▶](../../07-proxy/01-proxy.md) |
