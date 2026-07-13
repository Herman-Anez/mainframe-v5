import type { ComponentType } from "react";
import type { SubmitButtonProps } from "./component/submitButton.component";
import { withFakeStatus, withFormStatus, withLoading, withModuleStyle } from "./component/hoc";

// Unión de todos los nombres de método encadenables. Se usa en 3 lugares:
//  1. como el tipo del parámetro genérico `Used` (qué métodos ya se llamaron)
//  2. como parámetro de `next()` (qué método se está aplicando ahora)
//  3. como la clave que `Omit<...>` borra del tipo de retorno (ver más abajo)
// Debe mantenerse sincronizada a mano con los nombres reales de los métodos de la clase.
type FactoryMethod =
    | "withStyles"
    | "withModuleStyle"
    | "withLoading"
    | "withFormStatus"
    | "withFakeStatus";

// ─────────────────────────────────────────────────────────────────────────────
// ComponentFactory<P, C, Used>
// ─────────────────────────────────────────────────────────────────────────────
// Builder fluido/inmutable sobre un ComponentType<P>. Cada método de HOC
// (withStyles, withModuleStyle, withLoading, withFormStatus, withFakeStatus)
// NO muta la instancia actual: crea una instancia NUEVA cuyo `.Component` es
// el componente anterior envuelto por ese HOC. Por eso se puede encadenar:
//
//   ComponentFactory.from(SubmitButton)   // instancia 1, Component = SubmitButton
//     .withStyles(styles)                 // instancia 2, Component = WithStyles(SubmitButton)
//     .withFormStatus()                   // instancia 3, Component = WithFormStatus(WithStyles(SubmitButton))
//     .Component;                         // <- ComponentType final, listo para <Component />
//
// El ORDEN importa: el método llamado más tarde queda MÁS AFUERA en el árbol
// de componentes (envuelve al anterior), igual que si compusieras los HOCs a mano:
// withFormStatus(withStyles(styles)(SubmitButton)).
//
// ── Parámetros de tipo ──────────────────────────────────────────────────────
// P:    las props del componente ORIGINAL pasado a `.from()`. No cambia nunca
//       en la cadena — es solo la referencia de "con qué arrancamos".
// C:    las props que el `.Component` ACTUAL realmente necesita recibir desde
//       afuera. Sí cambia con cada método, porque cada HOC decide qué prop
//       agrega/consume/descarta. Por ejemplo `withFormStatus` no reenvía nada
//       de lo que traía adentro — llama su propio hook — así que después de
//       aplicarlo, `C` pasa a ser `{}` (no hace falta pasarle ninguna prop).
//       Sin este parámetro separado de `P`, `.Component` quedaría siempre
//       tipado como si necesitara las props originales, aunque en runtime ya
//       no las use — eso es justo el bug que motivó agregar `C`: TS marcaba
//       error real al hacer `<StatefulForm />` sin `pending`, cuando el
//       componente de verdad no lo pide.
// Used: unión de los nombres de método YA aplicados en esta cadena, ej.
//       `"withStyles" | "withFormStatus"`. Arranca en `never` (ningún método
//       usado) y crece con cada llamada. Es lo que le permite a TypeScript
//       "recordar" qué se llamó, sin necesidad de leer el Set en runtime.
//
// ── Por qué bloquear llamadas repetidas ─────────────────────────────────────
// Cada HOC de este proyecto, al aplicarse dos veces (una envolviendo a la otra),
// tiene un comportamiento distinto pero siempre indeseado:
//  - withFormStatus / withFakeStatus: la capa interior vuelve a llamar su propio
//    hook (useFormStatus / useFakePending) e IGNORA el valor que le pasó la capa
//    exterior → la capa exterior hizo trabajo (y en el caso de withFakeStatus,
//    hasta un setTimeout) que nunca se usa.
//  - withLoading: ambas capas leen el mismo `pending` sin pisarlo → se renderiza
//    el `<p>pending</p>` DOS veces cuando pending=true.
//  - withStyles / withModuleStyle: cada capa hardcodea su propio valor de
//    `styles` en un closure y lo pisa sin mirar el que le llegó por props → gana
//    la capa MÁS INTERNA, no la más reciente en la cadena (contraintuitivo).
// Ninguno de estos casos rompe en runtime (no hay excepción, no hay loop), por
// eso el bug es silencioso — de ahí el guard.
//
// ── Guard de tipos (compile-time) ───────────────────────────────────────────
// Cada método delega en `next()`, cuyo tipo de retorno es:
//
//     Omit<ComponentFactory<P, NC, Used | M>, Used | M>
//
// Es decir: "una ComponentFactory normal, pero AL TIPO le borramos las claves
// que están en Used | M" (los métodos ya aplicados + el que se acaba de aplicar).
// Como el nombre de cada método (ej. "withFormStatus") es también una key literal
// del tipo de la clase, `Omit` elimina esa key del tipo público del objeto que
// se devuelve. El objeto en RUNTIME sigue teniendo el método en su prototipo
// (JS no lo borra, es un objeto ComponentFactory normal) — lo único que cambia
// es qué le permite ver el type-checker. Si intentás llamar `.withFormStatus()`
// otra vez sobre ese resultado, TypeScript tira:
//   "Property 'withFormStatus' does not exist on type 'Omit<...>'"
// sin necesidad de ejecutar nada. Esto es el patrón conocido como
// "fluent builder con guard a nivel de tipos" (a veces vía `Omit<this, K>`).
//
// ── Guard en runtime ─────────────────────────────────────────────────────────
// El guard de tipos NO protege si alguien usa `as any`, JS puro sin TS, o
// guarda una referencia intermedia y la reutiliza con un cast. Por eso `next()`
// también mantiene `applied`, un Set INMUTABLE (nunca se muta el Set existente,
// se crea uno nuevo con el método agregado) y tira `throw new Error(...)` si el
// método ya estaba en el Set. Es el mismo chequeo que hace TS, pero ejecutado
// de verdad cuando el programa corre.
class ComponentFactory<
    P extends SubmitButtonProps, //propiedades del componente
    C,
    Used extends FactoryMethod = never,
> {
    // Componente final resultante de la cadena hasta este punto, tipado con las
    // props REALES que necesita en este paso (`C`), no con las props originales
    // (`P`) — ver nota de `C` más arriba.
    readonly Component: ComponentType<C>;

    // Qué métodos ya se aplicaron en ESTA cadena. Es la contraparte en runtime
    // del parámetro de tipo `Used`. Privado: no forma parte de la API pública,
    // solo lo usa `next()` para decidir si tirar el error.
    private readonly applied: ReadonlySet<FactoryMethod>;

    // Constructor privado: la única forma de crear una instancia es vía
    // `ComponentFactory.from(...)` (primera instancia) o vía `next(...)`
    // (instancias siguientes, una por cada HOC aplicado). Esto evita que
    // alguien construya una instancia "a mano" con un `applied` inconsistente.
    private constructor(
        component: ComponentType<C>,
        applied: ReadonlySet<FactoryMethod>,
    ) {
        this.Component = component;
        this.applied = applied;
    }

    // Punto de entrada de la cadena. `P` (y `C`, que arranca igual a `P`) se
    // infieren del componente que le pasás, así el resto de la cadena ya sabe
    // con qué props está trabajando. `Used` arranca implícito en `never`
    // (ningún método aplicado todavía).
    static from<P extends SubmitButtonProps>(component: ComponentType<P>) {
        return new ComponentFactory<P, P>(component, new Set());
    }

    // Punto único por el que pasan TODOS los métodos encadenables. Centraliza:
    //   1. el guard en runtime (`applied.has(method)` → throw)
    //   2. la construcción de la siguiente instancia (Set nuevo, no mutado)
    //   3. el guard de tipos, vía la firma de retorno `Omit<..., Used | M>`
    // `M extends FactoryMethod` se infiere del literal que le pasa cada método
    // (ej. al llamar `this.next("withLoading", ...)`, M = "withLoading").
    // `NC` (next current props) se infiere del componente que le pasa cada
    // método — cada uno decide qué props necesita el HOC que acaba de aplicar.
    private next<M extends FactoryMethod, NC>(
        method: M,
        component: ComponentType<NC>,
    ): Omit<ComponentFactory<P, NC, Used | M>, Used | M> {
        if (this.applied.has(method)) {
            throw new Error(
                `ComponentFactory: '${method}' ya fue aplicado, no se puede llamar dos veces`,
            );
        }
        // Spread del Set viejo + el método nuevo → instancia siguiente con su
        // propio Set independiente (inmutabilidad: el `applied` de `this` nunca
        // se toca, así que reusar una instancia intermedia sigue siendo seguro).
        return new ComponentFactory<P, NC, Used | M>(
            component,
            new Set([...this.applied, method]),
        );
    }

    // Variante "manual" de estilo: a diferencia de withModuleStyle (que lee el
    // css module), acá el consumidor pasa el objeto `styles` explícitamente.
    // Se envuelve en un componente anónimo que cierra sobre `styles` (closure)
    // y lo inyecta siempre con ese mismo valor fijo — de ahí que llamarlo dos
    // veces sea inútil: la capa interna nunca ve el `styles` de la capa externa.
    // `styles` queda cubierto por este HOC, así que ya no hace falta pasarlo
    // desde afuera → `C` pasa de `C` a `Omit<C, "styles">`.
    withStyles(styles: NonNullable<SubmitButtonProps["styles"]>) {
        const WrappedComponent = this.Component;
        // Recibe las props del paso anterior SIN `styles` (se lo agrega este
        // componente), y las reenvía intactas + el `styles` fijo del closure.
        function WithStyles(props: Omit<C, "styles">) {
            return <WrappedComponent {...(props as C)} styles={styles} />;
        }
        return this.next("withStyles", WithStyles);
    }

    // Delega en el HOC `withModuleStyle` ya existente (inyecta `styles.button`
    // leyendo `submitButton.module.css`). Igual que `withStyles`, cubre `styles`
    // por su cuenta → `C` pasa a `Omit<C, "styles">`.
    withModuleStyle() {
        const WrappedComponent = withModuleStyle(
            this.Component as ComponentType<C & SubmitButtonProps>,
        );
        return this.next("withModuleStyle", WrappedComponent);
    }

    // Delega en `withLoading`: intercepta `pending` (recibido por props, no por
    // hook) y renderiza `<p>pending</p>` arriba del componente si es `true`.
    // Reenvía todas las props tal cual → `C` no cambia.
    withLoading() {
        const WrappedComponent = withLoading(
            this.Component as ComponentType<C & SubmitButtonProps>,
        );
        return this.next("withLoading", WrappedComponent);
    }

    // Delega en `withFormStatus`. OJO: ese HOC en particular no acepta ni
    // reenvía props — llama su propio `useFormStatus()` (requiere estar dentro
    // de un <form>) y renderiza `<WrappedComponent pending={pending} />` sin
    // `onClick` ni `styles`. Por eso `C` pasa a `{}`: de acá en más el
    // `.Component` resultante se puede renderizar sin pasarle ninguna prop
    // (`<Component />`), reflejando lo que hace de verdad en runtime.
    withFormStatus() {
        const WrappedComponent = withFormStatus(
            this.Component as ComponentType<SubmitButtonProps>,
        );
        return this.next("withFormStatus", WrappedComponent);
    }

    // Delega en `withFakeStatus`: genera un `pending`/`onClick` simulados
    // (timeout local, sin backend ni <form>) vía `useFakePending`, así que ya
    // no hace falta pasarlos desde afuera → `C` pasa a
    // `Omit<C, "pending" | "onClick">`.
    withFakeStatus() {
        const WrappedComponent = withFakeStatus(
            this.Component as ComponentType<C & SubmitButtonProps>,
        );
        return this.next("withFakeStatus", WrappedComponent);
    }
}

export default ComponentFactory;
