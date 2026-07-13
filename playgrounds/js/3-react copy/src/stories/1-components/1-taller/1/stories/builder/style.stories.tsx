import type { ComponentProps } from "react";
import type { Meta, StoryFn } from "@storybook/react-vite";
import cssModule from "./ejemplo.module.css";
import Ejemplo from "../component/ejemplo.component";
import createBuilder from "../ejemplo.builder";
import { withModuleStyle } from "../component/hoc";

const Style = createBuilder().use("moduleStyle", withModuleStyle).build(Ejemplo);

const ModularStyle = createBuilder().use("moduleStyle", withModuleStyle, cssModule).build(Ejemplo);

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
} satisfies ComponentProps<typeof Style>;
export const ModularStyled = ModularStyleTemplate.bind({});
ModularStyled.args = {
    text: "prueba",
    flag1:true,
} satisfies ComponentProps<typeof ModularStyle>;