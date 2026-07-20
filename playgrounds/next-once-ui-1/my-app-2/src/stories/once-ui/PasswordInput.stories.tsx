import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A text input for passwords with a built-in visibility toggle to reveal or mask the entered value.',
      },
    },
  },
  argTypes: {
    error: { control: 'boolean', description: 'Displays the input in an error state.' },
    disabled: { control: 'boolean', description: 'Disables interaction with the input.' },
    label: { control: 'text', description: 'Label text describing the input.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when empty.' },
  },
  args: {
    id: 'password-input-default',
    label: 'Password',
    placeholder: 'Enter your password',
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ErrorState: Story = {
  args: { error: true, errorMessage: 'Password must be at least 8 characters' },
};
