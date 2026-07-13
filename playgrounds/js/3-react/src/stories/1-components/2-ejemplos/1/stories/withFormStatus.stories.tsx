import type { Meta, StoryFn } from "@storybook/react-vite";
import SubmitButton from "../component/submitButton.component";
import ComponentFactory from "../submitButton.factory";

// Componente armado con la factory en vez de componentHocs.withFormStatus(SubmitButton) directo
const StatefulForm = ComponentFactory.from(SubmitButton).withFormStatus().Component;

const meta: Meta<typeof StatefulForm> = {
    title: "Ejemplos/base/hoc/StatefulForm",
    component: StatefulForm,
};

export default meta;

// useFormStatus solo funciona dentro de un <form>, por eso el wrapper aquí
const Template: StoryFn<typeof StatefulForm> = () => (
    <form action={async () => new Promise((resolve) => setTimeout(resolve, 1000))}>
        <StatefulForm />
    </form>
);

export const Form = Template.bind({});
