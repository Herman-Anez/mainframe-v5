import type { Meta, StoryFn } from "@storybook/react-vite";
import cssModule from "./ejemplo.module.css";
import Ejemplo from "../../component/ejemplo.component";
import ComponentFib from "../../ejemplo.fib";

const Style = ComponentFib.from(Ejemplo).withModuleStyle().Component;

const ModularStyle = ComponentFib.from(Ejemplo).withModuleStyle(cssModule).Component;

const meta: Meta<typeof Style> = {
    title: "Ejemplos/base1/StyledComponent",
    component: Style,
};

export default meta;

const StyleTemplate: StoryFn<typeof Style> = (args) => (
    <Style {...args} />
);
const ModularStyleTemplate: StoryFn<typeof ModularStyle> = (args) => (
    <ModularStyle {...args} />
);
export const Styled = StyleTemplate.bind({});
Styled.args = {
    text: "prueba",
    flag1:true
};
export const ModularStyled = ModularStyleTemplate.bind({});
ModularStyled.args = {
    text: "prueba",
    flag1:true,

};