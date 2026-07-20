import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Checkbox } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    label: 'Accept terms and conditions',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const CheckboxWithState = () => {
      const [checked, setChecked] = useState(false);
      return <Checkbox {...args} isChecked={checked} onToggle={() => setChecked((v) => !v)} />;
    };
    return <CheckboxWithState />;
  },
};

export const Indeterminate: Story = {
  args: { isIndeterminate: true, label: 'Select all' },
  render: (args) => {
    const CheckboxWithState = () => {
      const [checked, setChecked] = useState(false);
      return <Checkbox {...args} isChecked={checked} onToggle={() => setChecked((v) => !v)} />;
    };
    return <CheckboxWithState />;
  },
};
