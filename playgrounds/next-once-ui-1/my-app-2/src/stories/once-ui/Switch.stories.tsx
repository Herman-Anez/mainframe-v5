import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Switch } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A toggle control for switching a single setting between on and off states.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean', description: 'Disables the switch and prevents interaction.' },
    loading: { control: 'boolean', description: 'Shows a loading state and disables interaction.' },
    reverse: { control: 'boolean', description: 'Places the switch before the label instead of after.' },
    label: { control: 'text', description: 'Label text displayed next to the switch.' },
    description: { control: 'text', description: 'Helper text displayed below the label.' },
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
