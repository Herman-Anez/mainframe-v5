import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinearGauge } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Charts/LinearGauge',
  component: LinearGauge,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Value shown by the gauge, 0-100.' },
    hue: { control: 'select', options: ['success', 'neutral', 'danger'], description: 'Color hue of the gauge fill.' },
    labels: { control: 'select', options: ['none', 'percentage'], description: 'Labels shown alongside the gauge segments.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A horizontal segmented gauge bar for showing a single value against a range.',
      },
    },
  },
  args: {
    value: 60,
    hue: 'success',
    labels: 'percentage',
    width: 240,
    height: 40,
  },
} satisfies Meta<typeof LinearGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
