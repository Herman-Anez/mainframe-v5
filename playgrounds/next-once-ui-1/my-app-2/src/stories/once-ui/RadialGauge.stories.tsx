import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadialGauge, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Charts/RadialGauge',
  component: RadialGauge,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Value shown by the gauge, 0-100.' },
    hue: { control: 'select', options: ['success', 'neutral', 'danger'], description: 'Color hue of the gauge fill.' },
    direction: { control: 'select', options: ['cw', 'ccw'], description: 'Direction the gauge fills in.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A circular radial gauge for showing a single value against a range, e.g. a completion percentage.',
      },
    },
  },
  args: {
    value: 72,
    hue: 'success',
    width: 160,
    height: 160,
  },
} satisfies Meta<typeof RadialGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadialGauge {...args}>
      <Text variant="heading-strong-l">{args.value}%</Text>
    </RadialGauge>
  ),
};
