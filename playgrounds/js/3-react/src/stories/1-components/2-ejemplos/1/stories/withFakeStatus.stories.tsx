import type { Meta, StoryFn } from "@storybook/react-vite";
import SubmitButton from "../component/submitButton.component";
import ComponentFactory from "../submitButton.factory";

// Componente armado con la factory en vez de componentHocs.withFakeStatus(SubmitButton) directo
const StatefulFake = ComponentFactory.from(SubmitButton).withFakeStatus().Component;

const meta: Meta<typeof StatefulFake> = {
    title: "Ejemplos/base/hoc/statefull",
    component: StatefulFake,
};

export default meta;

const Template: StoryFn<typeof StatefulFake> = (args) => (
    <StatefulFake {...args} />
);

export const Fake = Template.bind({});



