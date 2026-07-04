# Flyweight java

## Ejemplo: Caracteres en un editor de texto

Modelaremos un editor simple donde los caracteres se representan con flyweights. El `Glyph` es el flyweight; `CharacterGlyph` almacena el carácter (intrínseco). La posición y fuente se pasan como extrínseco en el método `draw()`.

```java
import java.util.HashMap;
import java.util.Map;

// ---------- Flyweight ----------
interface Glyph {
    void draw(int x, int y, String font);  // estado extrínseco: posición, fuente
}

// ---------- ConcreteFlyweight ----------
class CharacterGlyph implements Glyph {
    private final char symbol;  // estado intrínseco (inmutable)

    public CharacterGlyph(char symbol) {
        this.symbol = symbol;
    }

    @Override
    public void draw(int x, int y, String font) {
        System.out.println("Dibujando '" + symbol + "' en (" + x + "," + y + ") con fuente " + font);
    }
}

// ---------- FlyweightFactory ----------
class GlyphFactory {
    private Map<Character, Glyph> glyphs = new HashMap<>();

    public Glyph getGlyph(char character) {
        Glyph glyph = glyphs.get(character);
        if (glyph == null) {
            glyph = new CharacterGlyph(character);
            glyphs.put(character, glyph);
            System.out.println("Creando nuevo flyweight para: '" + character + "'");
        }
        return glyph;
    }

    public int getGlyphCount() {
        return glyphs.size();
    }
}

// ---------- Cliente (Editor) ----------
public class TextEditor {
    private GlyphFactory factory = new GlyphFactory();
    // Simula el documento: una lista de "letras" con su posición y fuente (extrínseco)
    private static class CharacterPosition {
        char character;
        int x, y;
        String font;

        CharacterPosition(char character, int x, int y, String font) {
            this.character = character;
            this.x = x;
            this.y = y;
            this.font = font;
        }
    }

    public void renderText(String text, int startX, int startY, String font) {
        int x = startX;
        int y = startY;
        for (char ch : text.toCharArray()) {
            Glyph glyph = factory.getGlyph(ch);
            glyph.draw(x, y, font);
            x += 10; // avance horizontal simplificado
        }
    }

    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        // Renderizar "Hola Mundo" varias veces para ver la compartición
        editor.renderText("Hola Mundo", 0, 0, "Arial");
        System.out.println("---");
        editor.renderText("Hola", 100, 50, "Times New Roman");
        System.out.println("---");
        editor.renderText("Hello World", 0, 100, "Arial");
        System.out.println("Total flyweights creados: " + editor.factory.getGlyphCount());
    }
}
```

**Salida esperada:**
```
Creando nuevo flyweight para: 'H'
Creando nuevo flyweight para: 'o'
Creando nuevo flyweight para: 'l'
Creando nuevo flyweight para: 'a'
Creando nuevo flyweight para: ' '
Creando nuevo flyweight para: 'M'
Creando nuevo flyweight para: 'u'
Creando nuevo flyweight para: 'n'
Creando nuevo flyweight para: 'd'
Dibujando 'H' en (0,0) con fuente Arial
Dibujando 'o' en (10,0) con fuente Arial
Dibujando 'l' en (20,0) con fuente Arial
Dibujando 'a' en (30,0) con fuente Arial
...
---
Dibujando 'H' en (100,50) con fuente Times New Roman
... (se reutilizan flyweights existentes)
Total flyweights creados: 9  (H, o, l, a, espacio, M, u, n, d)
```

Se observa que la segunda vez no crea nuevos flyweights para 'H', 'o', 'l', 'a'; los reutiliza.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ flyweight.puml](../diagramas/04-flyweightpuml.md) | [🏠 Inicio](../../../index.md) | [Flyweight python ▶](03-flyweight-python.md) |
