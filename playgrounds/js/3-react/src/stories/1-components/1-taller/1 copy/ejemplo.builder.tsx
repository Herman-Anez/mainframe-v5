import type { ComponentType } from "react";
import type { ExampleComponentProps } from "./component/ejemplo.component";

// Forma que debe cumplir cualquier HOC usable en .use(): su propio generico
// P extends ExampleComponentProps se instancia contra el `Out` concreto del
// builder al pasarlo POR REFERENCIA (no via typeof/Parameters<>, ahi se pierde
// la relacion con el Out real y TS cae al constraint).
// Si algun HOC futuro no calza (el componente no es el primer parametro, o
// tiene mas de un generico independiente), envolverlo en un lambda no-generico
// en el call site: .use("tag", (c: ComponentType<Out>, extra?: T) => miHoc(c, extra), extra)

// Guard de compile-time: como .use() es un unico metodo generico (no un
// metodo por HOC como en el patron viejo), no hay "nombre de metodo" del que
// colgar un Omit<Class, Key>. En cambio cada .use() pide un tag string
// literal; si ese tag ya esta en `Used`, el tipo esperado del parametro
// colapsa a este objeto imposible de satisfacer con un string comun, asi
// TypeScript marca error ANTES de correr nada (aunque el mensaje sea menos
// lindo que un "property does not exist").
type DuplicateTag<T extends string> = {
    __error: `ComponentBuilder: el tag '${T}' ya fue usado, elegi otro`;
};

class ComponentBuilder<
    RootIn extends ExampleComponentProps,
    // OJO: `Out`/`NewOut` NO deben acotarse a `ExampleComponentProps`. Un HOC
    // como withCustomText hace `Omit<P,'flag1'|'text'>`, que deja de cumplir
    // ese bound (le faltan flag1/text a proposito). Si Out estuviera acotado
    // asi, cuando el tipo real inferido violara el bound, TS no tira error:
    // cae en silencio al bound (`ExampleComponentProps` completo) en vez del
    // tipo real, y la cadena queda "pegada" pidiendo props que el HOC ya sacó
    // — bug real que paso en este archivo, no hipotetico.
    Out extends object,
    Used extends string = never,
> {
    // Se guarda UNA sola funcion compuesta en vez de un array de pasos con
    // tipo borrado (heterogeneo → necesitaria `any`): cada `.use()` envuelve
    // la pipeline anterior (ya tipada con precision) dentro de una nueva,
    // cerrando sobre el `Out` concreto de ese paso. No hace falta `any` ni
    // cast en ningun lado.
    private readonly pipeline: (component: ComponentType<RootIn>) => ComponentType<Out>;
    // `string` y no `Used`: `Used` describe que tags acepta el compilador de
    // ACA en mas (via el condicional de `use()`), no que forma tienen los tags
    // ya guardados (que en tiempo de ejecucion son simplemente strings).
    private readonly applied: ReadonlySet<string>;

    private constructor(
        pipeline: (component: ComponentType<RootIn>) => ComponentType<Out>,
        applied: ReadonlySet<string>,
    ) {
        this.pipeline = pipeline;
        this.applied = applied;
    }

    static create<P extends ExampleComponentProps>(): ComponentBuilder<P, P> {
        return new ComponentBuilder<P, P>((component) => component, new Set());
    }

    use<Tag extends string, Args extends unknown[], NewOut extends object>(
        tag: Tag extends Used ? DuplicateTag<Tag> : Tag,
        hoc: (component: ComponentType<Out>, ...args: Args) => ComponentType<NewOut>,
        ...args: Args
    ): ComponentBuilder<RootIn, NewOut, Used | Tag> {
        // `tag` esta tipado como el condicional `Tag extends Used ? DuplicateTag<Tag> : Tag`
        // (eso es lo que bloquea el duplicado en compile-time). En runtime esa
        // rama nunca existe de verdad: siempre es un string plano, pasa por
        // `unknown` para des-escaparlo sin pelear con el chequeo de overlap de `as`.
        const rawTag = tag as unknown as string;

        // Guard en runtime: protege contra `as any`/JS puro, casts, o una
        // referencia intermedia reutilizada esquivando el chequeo de tipos.
        if (this.applied.has(rawTag)) {
            throw new Error(
                `ComponentBuilder: el tag '${rawTag}' ya fue aplicado, no se puede usar dos veces`,
            );
        }
        const { pipeline } = this;
        const nextPipeline = (component: ComponentType<RootIn>) => hoc(pipeline(component), ...args);
        return new ComponentBuilder<RootIn, NewOut, Used | Tag>(
            nextPipeline,
            new Set([...this.applied, rawTag]),
        );
    }

    build(component: ComponentType<RootIn>): ComponentType<Out> {
        return this.pipeline(component);
    }
}

export function createBuilder<P extends ExampleComponentProps = ExampleComponentProps>() {
    return ComponentBuilder.create<P>();
}

export default createBuilder;
