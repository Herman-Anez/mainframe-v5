import type { Meta, StoryFn } from "@storybook/react-vite";


import cssModule from "./ejemplo.module.css";///modulo Css de ejemplo
import Ejemplo from "../component/ejemplo.component";/// Componente de ejemplo



///////////////////////////////////////////////////////////Stories config Start
const meta: Meta<typeof FibStyle> = {
    title: "Ejemplos/A",
    component: Ejemplo,////componente base
};

export default meta;
///////////////////////////////////////////////////////Stories config End

///////////////////////////////////////////////////////////Fib Start
import ComponentFib from "../ejemplo.fib";
////////////////////////////////////////////////
////////////////////////////////////////////////Styles
const FibStyle = ComponentFib.from(Ejemplo).withModuleStyle().Component;
const FibModularStyle = ComponentFib.from(Ejemplo).withModuleStyle(cssModule).Component;

const FibStyleTemplate: StoryFn<typeof FibStyle> = (args) => (
    <FibStyle {...args} />
);
const FibModularStyleTemplate: StoryFn<typeof FibModularStyle> = (args) => (
    <FibModularStyle {...args} />
);
export const Styled = FibStyleTemplate.bind({});
Styled.args = {
    text: "prueba",
    flag1:true
};
export const ModularStyled = FibModularStyleTemplate.bind({});
ModularStyled.args = {
    text: "prueba",
    flag1:true,

};
////////////////////////////////////////////////Styles End
///////////////////////////////////////////////////////////FibEnd


///////////////////////////////////End