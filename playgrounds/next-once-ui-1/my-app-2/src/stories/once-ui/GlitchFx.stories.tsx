import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlitchFx, Heading } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/GlitchFx',
  component: GlitchFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Applies a digital glitch/distortion effect to its children, useful for drawing attention or evoking a broken-screen aesthetic.',
      },
    },
  },
  argTypes: {
    speed: { control: 'select', options: ['slow', 'medium', 'fast'], description: 'How fast the glitch effect cycles.' },
    trigger: { control: 'select', options: ['instant', 'hover', 'custom'], description: 'What user action starts the glitch effect.' },
    continuous: { control: 'boolean', description: 'Keeps the glitch effect looping continuously.' },
  },
  args: {
    speed: 'medium',
    trigger: 'hover',
    children: <Heading variant="heading-strong-l">Glitch me</Heading>,
  },
} satisfies Meta<typeof GlitchFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
