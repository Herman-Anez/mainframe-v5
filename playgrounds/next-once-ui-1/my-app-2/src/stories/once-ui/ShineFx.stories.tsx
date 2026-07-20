import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShineFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/ShineFx',
  component: ShineFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animates a light shine sweeping across text, useful for drawing attention to headings or highlighted labels.',
      },
    },
  },
  argTypes: {
    speed: { control: 'number', description: 'Duration of one shine sweep, in seconds.' },
    disabled: { control: 'boolean', description: 'Disables the shine animation.' },
    inverse: { control: 'boolean', description: 'Reverses the direction of the shine sweep.' },
  },
  args: {
    speed: 3,
    variant: 'heading-strong-l',
    children: 'Shining text',
  },
} satisfies Meta<typeof ShineFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
