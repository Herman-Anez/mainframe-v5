import type { Meta, StoryFn } from "@storybook/react-vite";

import Ejemplo, { type ExampleComponentProps } from "../component/ejemplo.component";
import createBuilder from "../ejemplo.builder";


const Dumb = createBuilder().build(Ejemplo);


const meta: Meta<typeof Dumb> = {
    title: "Ejemplos/base1/component",
    component: Dumb,
    
};

export default meta;

const DumbTemplate: StoryFn<typeof Dumb> = (args) => (
    <Dumb {...args} />
);

export const Dumb1 = DumbTemplate.bind({});
// `satisfies` fuerza que el literal cumpla TODAS las props requeridas de
// ExampleComponentProps -- .args por si solo es Partial<Args> (tipado asi
// por Storybook a proposito, para permitir args globales/heredados), asi que
// sin esto faltar flag1/text no tira error de compilacion.
Dumb1.args = {
    text: "prueba",
    flag1:true
} satisfies ExampleComponentProps;
export const Dumb2 = DumbTemplate.bind({});
Dumb2.args = {
    text: "prueba",
    flag1:false
} satisfies ExampleComponentProps;