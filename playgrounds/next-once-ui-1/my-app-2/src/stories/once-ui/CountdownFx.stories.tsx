import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CountdownFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/CountdownFx',
  component: CountdownFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a live countdown timer that animates down to a target date, useful for launches, deadlines, or limited-time offers.',
      },
    },
  },
  argTypes: {
    format: { control: 'select', options: ['HH:MM:SS', 'DD:HH:MM:SS', 'MM:SS'], description: 'Which time units to display and their order.' },
  },
  args: {
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 26),
    format: 'DD:HH:MM:SS',
    variant: 'display-strong-l',
  },
} satisfies Meta<typeof CountdownFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
