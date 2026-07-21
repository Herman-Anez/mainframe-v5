import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LineChart } from '@once-ui-system/core';

const data = [
  { label: 'Jan', value: 40 },
  { label: 'Feb', value: 55 },
  { label: 'Mar', value: 48 },
  { label: 'Apr', value: 70 },
  { label: 'May', value: 62 },
];

const meta = {
  title: 'Once UI/Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['flat', 'gradient', 'outline'], description: 'Visual style of the line/area.' },
    grid: { control: 'select', options: ['x', 'y', 'both', 'none'], description: 'Which gridlines to show.' },
    axis: { control: 'select', options: ['x', 'y', 'both', 'none'], description: 'Which axes to show.' },
    loading: { control: 'boolean', description: 'Shows a loading state instead of the chart.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A line/area chart built on Recharts, with built-in title/description header, legend, tooltip, and loading/empty/error states.',
      },
    },
  },
  args: {
    title: 'Monthly revenue',
    series: { key: 'value' },
    data,
    variant: 'gradient',
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <LineChart {...args} style={{ maxWidth: 480, height: 280 }} />,
};
