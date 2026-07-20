import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { NumberInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A text input constrained to numeric values, with optional min/max/step bounds and increment controls.',
      },
    },
  },
  argTypes: {
    min: { control: 'number', description: 'Minimum allowed value.' },
    max: { control: 'number', description: 'Maximum allowed value.' },
    step: { control: 'number', description: 'Increment/decrement step size.' },
    label: { control: 'text', description: 'Label text describing the input.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when empty.' },
  },
  args: {
    id: 'number-input-default',
    label: 'Quantity',
    min: 0,
    max: 10,
    step: 1,
    value: 1,
    onChange: () => {},
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const NumberInputWithState = () => {
      const [value, setValue] = useState(args.value ?? 1);
      return <NumberInput {...args} value={value} onChange={setValue} />;
    };
    return <NumberInputWithState />;
  },
};
