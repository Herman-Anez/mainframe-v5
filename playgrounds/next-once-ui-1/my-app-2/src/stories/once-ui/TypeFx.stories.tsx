import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TypeFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/TypeFx',
  component: TypeFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Types out one or more words character by character like a typewriter, optionally cycling through the list on a loop.',
      },
    },
  },
  argTypes: {
    speed: { control: 'number', description: 'Typing speed in milliseconds per character.' },
    delay: { control: 'number', description: 'Delay in milliseconds before typing starts.' },
    hold: { control: 'number', description: 'How long a fully typed word stays visible before the next one starts.' },
    loop: { control: 'boolean', description: 'Cycles through the word list repeatedly.' },
  },
  args: {
    words: ['Design.', 'Build.', 'Ship.'],
    speed: 60,
    hold: 1200,
    loop: true,
    variant: 'heading-strong-l',
  },
} satisfies Meta<typeof TypeFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
