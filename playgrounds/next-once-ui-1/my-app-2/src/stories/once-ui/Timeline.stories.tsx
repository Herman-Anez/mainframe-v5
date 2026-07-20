import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline } from '@once-ui-system/core';

const items = [
  { label: 'Order placed', description: 'Jan 3, 2026', state: 'success' as const },
  { label: 'Shipped', description: 'Jan 4, 2026', state: 'success' as const },
  { label: 'Out for delivery', description: 'Jan 5, 2026', state: 'active' as const },
  { label: 'Delivered', description: 'Estimated Jan 6, 2026', state: 'default' as const },
];

const meta = {
  title: 'Once UI/Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Timeline renders a vertical sequence of events, each with a label, description, and state marker, useful for status tracking or history.',
      },
    },
  },
  argTypes: {
    alignment: { control: 'select', options: ['left', 'right'], description: 'Side of the timeline axis on which content is aligned.' },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the timeline markers and spacing.' },
  },
  args: {
    items,
    alignment: 'left',
    size: 'm',
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
