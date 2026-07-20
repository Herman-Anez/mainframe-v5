import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OTPInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A row of single-character inputs for entering a one-time passcode, with automatic focus advancement.',
      },
    },
  },
  argTypes: {
    length: { control: 'number', description: 'Number of individual character inputs to render.' },
    error: { control: 'boolean', description: 'Displays the input in an error state.' },
    disabled: { control: 'boolean', description: 'Disables interaction with the inputs.' },
    autoFocus: { control: 'boolean', description: 'Automatically focuses the first input on mount.' },
  },
  args: {
    length: 6,
  },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ErrorState: Story = {
  args: { error: true, errorMessage: 'Invalid code' },
};
