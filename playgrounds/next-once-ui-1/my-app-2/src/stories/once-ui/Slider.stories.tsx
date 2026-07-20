import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Slider } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A range input for selecting a numeric value by dragging a handle between a minimum and maximum.',
      },
    },
  },
  argTypes: {
    min: { control: 'number', description: 'Minimum selectable value.' },
    max: { control: 'number', description: 'Maximum selectable value.' },
    step: { control: 'number', description: 'Increment between selectable values.' },
    showValue: { control: 'boolean', description: 'Displays the current numeric value next to the label.' },
    disabled: { control: 'boolean', description: 'Disables interaction with the slider.' },
    label: { control: 'text', description: 'Label text describing the slider.' },
  },
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    value: 40,
    onChange: () => {},
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const SliderWithState = () => {
      const [value, setValue] = useState(args.value ?? 40);
      return <Slider {...args} value={value} onChange={setValue} />;
    };
    return <SliderWithState />;
  },
};
