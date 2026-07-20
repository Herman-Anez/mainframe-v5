import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Checkbox } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A checkbox input for toggling a single boolean option on or off, with support for an indeterminate state.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables the checkbox and prevents interaction.' },
    isIndeterminate: { control: 'boolean', description: 'Shows the checkbox in a partially-checked state.' },
    label: { control: 'text', description: 'Label text displayed next to the checkbox.' },
    description: { control: 'text', description: 'Helper text displayed below the label.' },
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
