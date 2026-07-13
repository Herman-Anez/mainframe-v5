import type { Meta, StoryFn } from "@storybook/react-vite";

import SubmitButton from "../component/submitButton.component";
import ComponentFactory from "../submitButton.factory";

const Dumb = ComponentFactory.from(SubmitButton).Component;


const meta: Meta<typeof Dumb> = {
    title: "Ejemplos/base/component",
    component: Dumb,
    
};

export default meta;

const DumbTemplate: StoryFn<typeof Dumb> = (args) => (
    <Dumb {...args} />
);

export const PendingFalse = DumbTemplate.bind({});
PendingFalse.args = {
    pending: false,
};
export const PendingTrue = DumbTemplate.bind({});
PendingTrue.args = {
    pending: true,
};
