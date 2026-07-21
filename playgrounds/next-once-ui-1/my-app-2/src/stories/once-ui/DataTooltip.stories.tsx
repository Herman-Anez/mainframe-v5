import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DataTooltip } from '@once-ui-system/core';

const payload = [{ dataKey: 'value', value: 42, name: 'value', color: '#7c93c4' }];

const meta = {
  title: 'Once UI/Charts/DataTooltip',
  component: DataTooltip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['flat', 'gradient', 'outline'], description: 'Visual style matching the chart variant.' },
    colors: { control: 'boolean', description: 'Shows a color swatch per series.' },
  },
  parameters: {
    docs: {
      description: {
        component: "The tooltip content renderer passed to Recharts' <Tooltip content={...}> — used internally by the chart components, shown here with sample data.",
      },
    },
  },
  args: {
    active: true,
    payload,
    label: 'Mon',
    colors: true,
  },
} satisfies Meta<typeof DataTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
