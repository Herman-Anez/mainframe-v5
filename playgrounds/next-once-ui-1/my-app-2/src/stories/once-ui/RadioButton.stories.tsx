import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { RadioButton, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    label: 'Option A',
    name: 'story-group',
    value: 'a',
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const RadioWithState = () => {
      const [checked, setChecked] = useState(false);
      return <RadioButton {...args} isChecked={checked} onToggle={() => setChecked((v) => !v)} />;
    };
    return <RadioWithState />;
  },
};

export const Group: Story = {
  render: () => {
    const RadioGroup = () => {
      const [selected, setSelected] = useState('a');
      return (
        <Column gap="8">
          {['a', 'b', 'c'].map((value) => (
            <RadioButton
              key={value}
              name="story-group-multi"
              value={value}
              label={`Option ${value.toUpperCase()}`}
              isChecked={selected === value}
              onToggle={() => setSelected(value)}
            />
          ))}
        </Column>
      );
    };
    return <RadioGroup />;
  },
};
