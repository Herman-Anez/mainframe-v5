import type { Meta, StoryFn } from "@storybook/react-vite";
import SubmitButton from "../component/submitButton.component";
import ComponentFactory from "../submitButton.factory";

const Styled = ComponentFactory.from(SubmitButton).withModuleStyle().Component;

const meta: Meta<typeof Styled> = {
    title: "Ejemplos/base/hoc/StyledModule",
    component: Styled,
};

export default meta;

const Template: StoryFn<typeof Styled> = (args) => (
    <Styled {...args} />
);

export const PendingFalse = Template.bind({});
PendingFalse.args = {
    pending: false,
};
export const PendingTrue = Template.bind({});
PendingTrue.args = {
    pending: true,
};
