import type { Meta, StoryFn } from "@storybook/react-vite";
import SubmitButton from "../component/submitButton.component";
import ComponentFactory from "../submitButton.factory";

// Orden: withLoading primero (más adentro) -> withModuleStyle -> withFormStatus (más afuera)
// misma composición que antes: withFormStatus(withModuleStyle(withLoading(SubmitButton)))
const LoadingComponent = ComponentFactory.from(SubmitButton)
    .withLoading()
    .withModuleStyle()
    .withFormStatus().Component;

const meta: Meta<typeof LoadingComponent> = {
    title: "Ejemplos/base/hoc/StatefulFormStatus",
    component: LoadingComponent,
};

export default meta;

// useFormStatus solo funciona dentro de un <form>, por eso el wrapper aquí
const Template: StoryFn<typeof LoadingComponent> = () => (
    <form action={async () => new Promise((resolve) => setTimeout(resolve, 1000))}>
        <LoadingComponent />
    </form>
);

export const Loading = Template.bind({});
