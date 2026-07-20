import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Particle } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/Particle',
  component: Particle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders an animated field of floating particles, optionally reacting to the cursor, useful as an ambient background effect.',
      },
    },
  },
  argTypes: {
    density: { control: 'number', description: 'Number of particles rendered.' },
    speed: { control: 'number', description: 'Speed at which particles move.' },
    interactive: { control: 'boolean', description: 'Makes particles react to cursor movement.' },
    mode: { control: 'select', options: ['repel', 'attract'], description: 'Whether particles move away from or toward the cursor.' },
  },
  args: {
    density: 40,
    speed: 1,
    interactive: true,
  },
} satisfies Meta<typeof Particle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Particle {...args} width={20} height={12} />,
};
