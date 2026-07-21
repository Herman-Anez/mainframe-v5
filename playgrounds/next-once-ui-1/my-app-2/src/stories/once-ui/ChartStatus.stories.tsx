import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChartStatus } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Charts/ChartStatus',
  component: ChartStatus,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean', description: 'Shows the loading state.' },
    empty: { control: 'boolean', description: 'Shows the empty-data state.' },
    error: { control: 'boolean', description: 'Shows the error state.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders the loading/empty/error placeholder used internally by the chart components in place of the chart itself.',
      },
    },
  },
  args: {
    loading: false,
    empty: true,
  },
} satisfies Meta<typeof ChartStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
  args: { loading: true, empty: false },
};

export const Error: Story = {
  args: { loading: false, empty: false, error: true },
};
