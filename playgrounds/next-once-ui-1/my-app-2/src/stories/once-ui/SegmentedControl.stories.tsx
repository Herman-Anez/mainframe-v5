import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SegmentedControl } from '@once-ui-system/core';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const meta = {
  title: 'Once UI/Forms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A horizontal group of toggle buttons where only one option can be selected at a time, e.g. for switching views.',
      },
    },
  },
  argTypes: {
    fillWidth: { control: 'boolean', description: 'Expands the control to fill the width of its container.' },
    compact: { control: 'boolean', description: 'Renders the buttons with reduced padding.' },
  },
  args: {
    buttons: options,
    selected: 'week',
    onToggle: () => {},
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const SegmentedWithState = () => {
      const [selected, setSelected] = useState('week');
      return <SegmentedControl {...args} selected={selected} onToggle={setSelected} />;
    };
    return <SegmentedWithState />;
  },
};
