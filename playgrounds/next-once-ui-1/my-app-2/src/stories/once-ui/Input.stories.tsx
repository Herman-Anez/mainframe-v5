import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost'] },
    height: { control: 'select', options: ['s', 'm', 'l'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    characterCount: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
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
