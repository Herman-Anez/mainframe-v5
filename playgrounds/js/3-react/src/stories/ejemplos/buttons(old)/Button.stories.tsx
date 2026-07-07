import type { Meta, StoryObj, StoryFn } from '@storybook/react-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Ejemplos/Button',
  component: Button,
  argTypes: { handleClick: { action: "handleClick" } }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Red: Story = {
  args: {
    text: 'Click me',
  },
};


export const Custom: Story = {
  render: (args) => <Button {...args} />,
  args: {
    text: 'Custom Button',
    size: '2'
  },
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />

export const Ejemplo1 = Template.bind({})
Ejemplo1.args = {
  text: "ejemplo1"
}