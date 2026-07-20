import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Switch } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    reverse: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    isChecked: false,
    onToggle: () => {},
    label: 'Enable notifications',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const SwitchWithState = () => {
      const [checked, setChecked] = useState(false);
      return <Switch {...args} isChecked={checked} onToggle={() => setChecked((v) => !v)} />;
    };
    return <SwitchWithState />;
  },
};

export const Reversed: Story = {
  args: { reverse: true },
  render: (args) => {
    const SwitchWithState = () => {
      const [checked, setChecked] = useState(true);
      return <Switch {...args} isChecked={checked} onToggle={() => setChecked((v) => !v)} />;
    };
    return <SwitchWithState />;
  },
};
