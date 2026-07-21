import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Legend } from '@once-ui-system/core';

const payload = [
  { value: 'Signups', color: '#7c93c4' },
  { value: 'Churn', color: '#c47c7c' },
];

const meta = {
  title: 'Once UI/Charts/Legend',
  component: Legend,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'], description: 'Layout direction of the legend items.' },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'],
      description: 'Position of the legend relative to the chart.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'The series-color legend used internally by the chart components — maps series names to their colors.',
      },
    },
  },
  args: {
    payload,
    direction: 'row',
  },
} satisfies Meta<typeof Legend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
