# Interpreter java

## Ejemplo: Evaluador de expresiones booleanas

Implementaremos un pequeño lenguaje para evaluar condiciones booleanas con variables, constantes `true`/`false`, y operadores `AND`, `OR`, `NOT`. El contexto almacenará los valores de las variables.

```java
import java.util.HashMap;
import java.util.Map;

// ---------- Context ----------
class Context {
    private Map<String, Boolean> variables = new HashMap<>();

    public void setVariable(String name, boolean value) {
        variables.put(name, value);
    }

    public boolean lookup(String name) {
        return variables.getOrDefault(name, false);
    }
}

// ---------- AbstractExpression ----------
interface Expression {
    boolean interpret(Context context);
}

// ---------- TerminalExpressions ----------
class Constant implements Expression {
    private boolean value;

    public Constant(boolean value) {
        this.value = value;
    }

    @Override
    public boolean interpret(Context context) {
        return value;
    }
}

class Variable implements Expression {
    private String name;

    public Variable(String name) {
        this.name = name;
    }

    @Override
    public boolean interpret(Context context) {
        return context.lookup(name);
    }
}

// ---------- NonterminalExpressions ----------
class NotExpression implements Expression {
    private Expression expression;

    public NotExpression(Expression expression) {
        this.expression = expression;
    }

    @Override
    public boolean interpret(Context context) {
        return !expression.interpret(context);
    }
}

class AndExpression implements Expression {
    private Expression left;
    private Expression right;

    public AndExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public boolean interpret(Context context) {
        return left.interpret(context) && right.interpret(context);
    }
}

class OrExpression implements Expression {
    private Expression left;
    private Expression right;

    public OrExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    @Override
    public boolean interpret(Context context) {
        return left.interpret(context) || right.interpret(context);
    }
}

// ---------- Cliente ----------
public class InterpreterDemo {
    public static void main(String[] args) {
        // Construir la expresión: (a AND b) OR (NOT c)
        // Donde a, b, c son variables
        Expression expr = new OrExpression(
            new AndExpression(
                new Variable("a"),
                new Variable("b")
            ),
            new NotExpression(
                new Variable("c")
            )
        );

        // Crear contexto y asignar valores
        Context context = new Context();
        context.setVariable("a", true);
        context.setVariable("b", false);
        context.setVariable("c", true);

        boolean result = expr.interpret(context);
        System.out.println("Resultado: " + result); // (true AND false) OR (NOT true) = false OR false = false

        // Cambiar variables
        context.setVariable("b", true);
        context.setVariable("c", false);
        result = expr.interpret(context);
        System.out.println("Resultado: " + result); // (true AND true) OR (NOT false) = true OR true = true
    }
}
```

## Variante con `toString()` para visualización

Se podría añadir un método `toString()` a cada expresión para representar el árbol, similar a cómo se haría con Visitor, pero aquí lo obviamos para centrarnos en la interpretación.

<!-- Navigation Footer -->
---

| Anterior | Inicio | Siguiente |
| :--- | :---: | ---: |
| [◀ interpreter.puml](../diagramas/04-interpreterpuml.md) | [🏠 Inicio](../../../index.md) | [Interpreter python ▶](03-interpreter-python.md) |
