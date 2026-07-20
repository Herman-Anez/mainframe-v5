import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ColorInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/ColorInput',
  component: ColorInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ColorInput is a text field paired with a color swatch/picker for entering a hex (or hex+alpha) color value.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Floating label text for the field.' },
    supportAlpha: { control: 'boolean', description: 'Whether to allow an alpha channel in the picked color.' },
  },
  args: {
    id: 'color-input-default',
    label: 'Brand color',
    value: '#7c3aed',
    onChange: () => {},
  },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const ColorInputWithState = () => {
      const [value, setValue] = useState(args.value);
      return <ColorInput {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
    };
    return <ColorInputWithState />;
  },
};
