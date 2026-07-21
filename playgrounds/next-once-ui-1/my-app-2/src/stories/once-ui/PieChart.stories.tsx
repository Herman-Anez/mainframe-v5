import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PieChart } from '@once-ui-system/core';

const data = [
  { label: 'Chrome', value: 62 },
  { label: 'Safari', value: 20 },
  { label: 'Firefox', value: 10 },
  { label: 'Other', value: 8 },
];

const meta = {
  title: 'Once UI/Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['flat', 'gradient', 'outline'], description: 'Visual style of the slices.' },
    loading: { control: 'boolean', description: 'Shows a loading state instead of the chart.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A pie/donut chart built on Recharts, with built-in title/description header, legend, and tooltip.',
      },
    },
  },
  args: {
    title: 'Browser share',
    series: { key: 'value' },
    data,
    variant: 'flat',
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <PieChart {...args} style={{ maxWidth: 400, height: 320 }} />,
};
