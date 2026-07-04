import type { Meta, StoryFn } from '@storybook/react-vite';

import SubmitButton  from '../../components/buttons/submit/submitButton.component';

import withFakeStatus  from '../../components/buttons/submit/withFakeStatus.hoc';

const SubmitButtonWithFakeStatus = withFakeStatus(SubmitButton);

const meta: Meta<typeof SubmitButton> = {
  title: 'Buttons/SubmitButton',
  component: SubmitButton,
};

export default meta;

const Template: StoryFn<typeof SubmitButton> = (args) => <SubmitButton {...args} />



export const PendingTrue = Template.bind({})
PendingTrue.args = {
  pending:true
}

export const PendingFalse = Template.bind({})
PendingFalse.args = {
  pending:false
}

const HocTemplate: StoryFn<typeof SubmitButtonWithFakeStatus> = (args) => (
  <SubmitButtonWithFakeStatus {...args} />
);

export const WithFakeStatus = HocTemplate.bind({});
WithFakeStatus.args = {
  // Si tu HOC acepta props adicionales (ej: delay, initialPending, etc.)
  // las pasas aquí. Si no, déjalo vacío.
  // delay: 3000,
};
WithFakeStatus.parameters = {
  docs: {
    description: {
      story: 'Botón envuelto con `withFakeStatus`. Simula el estado de envío de un formulario.',
    },
  },
};