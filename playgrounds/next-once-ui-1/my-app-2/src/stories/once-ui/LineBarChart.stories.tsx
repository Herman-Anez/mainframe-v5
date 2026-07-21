import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LineBarChart } from '@once-ui-system/core';

const data = [
  { label: 'Jan', bar: 30, line: 40 },
  { label: 'Feb', bar: 45, line: 55 },
  { label: 'Mar', bar: 38, line: 48 },
  { label: 'Apr', bar: 55, line: 70 },
];

const meta = {
  title: 'Once UI/Charts/LineBarChart',
  component: LineBarChart,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['flat', 'gradient', 'outline'], description: 'Visual style of the chart.' },
    grid: { control: 'select', options: ['x', 'y', 'both', 'none'], description: 'Which gridlines to show.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A combined bar + line chart on the same axes, useful for comparing two related series (e.g. volume vs. trend).',
      },
    },
  },
  args: {
    title: 'Orders vs. target',
    series: [{ key: 'bar' }, { key: 'line' }],
    data,
  },
} satisfies Meta<typeof LineBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <LineBarChart {...args} style={{ maxWidth: 480, height: 280 }} />,
};
