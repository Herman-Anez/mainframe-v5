import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A single-line text field for entering short form data, with support for labels, errors, and validation states.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost'], description: 'Visual style of the input field.' },
    height: { control: 'select', options: ['s', 'm', 'l'], description: 'Height of the input field.' },
    error: { control: 'boolean', description: 'Shows the input in an error state.' },
    disabled: { control: 'boolean', description: 'Disables the input and prevents interaction.' },
    loading: { control: 'boolean', description: 'Shows a loading indicator inside the input.' },
    characterCount: { control: 'boolean', description: 'Displays a character count below the input.' },
    label: { control: 'text', description: 'Label text displayed above the input.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when the input is empty.' },
    description: { control: 'text', description: 'Helper text displayed below the input.' },
    errorMessage: { control: 'text', description: 'Message shown below the input when in an error state.' },
  },
  args: {
    id: 'input-default',
    label: 'Email',
    placeholder: 'you@example.com',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Column gap="16" maxWidth={20}>
      <Input id="input-default-state" label="Default" placeholder="Type here" />
      <Input id="input-disabled-state" label="Disabled" placeholder="Type here" disabled />
      <Input id="input-loading-state" label="Loading" placeholder="Type here" loading />
      <Input id="input-error-state" label="Error" placeholder="Type here" error errorMessage="This field is required" />
    </Column>
  ),
};
