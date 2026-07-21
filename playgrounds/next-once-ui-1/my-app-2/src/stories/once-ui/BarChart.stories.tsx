import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BarChart } from '@once-ui-system/core';

const data = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 8 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 17 },
];

const meta = {
  title: 'Once UI/Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['flat', 'gradient', 'outline'], description: 'Visual style of the bars.' },
    grid: { control: 'select', options: ['x', 'y', 'both', 'none'], description: 'Which gridlines to show.' },
    axis: { control: 'select', options: ['x', 'y', 'both', 'none'], description: 'Which axes to show.' },
    loading: { control: 'boolean', description: 'Shows a loading state instead of the chart.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A bar chart built on Recharts, with built-in title/description header, legend, tooltip, and loading/empty/error states.',
      },
    },
  },
  args: {
    title: 'Weekly signups',
    series: { key: 'value' },
    data,
    variant: 'flat',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <BarChart {...args} style={{ maxWidth: 480, height: 280 }} />,
};
