import type { ComponentProps } from "react";
import type { Meta, StoryFn } from "@storybook/react-vite";
import Ejemplo from "../component/ejemplo.component";
import createBuilder from "../ejemplo.builder";
import { withCustomText } from "../component/hoc";

// withCustomText inyecta flag1/text fijos (Omit<P,'flag1'|'text'>) -> el
// componente final no necesita esas props desde afuera.
const CustomTextStyle = createBuilder()
    .use("customText", withCustomText)
    .build(Ejemplo);

const meta: Meta<typeof CustomTextStyle> = {
    title: "Ejemplos/base1/CustomText",
    component: CustomTextStyle,
};

export default meta;

const CustomTextStyleTemplate: StoryFn<typeof CustomTextStyle> = (args) => (
    <CustomTextStyle {...args} />
);

export const CustomTexted = CustomTextStyleTemplate.bind({});
CustomTexted.args = {} satisfies ComponentProps<typeof CustomTextStyle>;
