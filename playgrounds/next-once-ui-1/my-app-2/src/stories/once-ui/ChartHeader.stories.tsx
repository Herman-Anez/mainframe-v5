import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChartHeader } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Charts/ChartHeader',
  component: ChartHeader,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Chart title.' },
    description: { control: 'text', description: 'Chart description/subtitle.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'The title/description/date-range header used internally by BarChart, LineChart, etc. — can also be reused standalone above a custom chart.',
      },
    },
  },
  args: {
    title: 'Weekly signups',
    description: 'New accounts created per day',
  },
} satisfies Meta<typeof ChartHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
