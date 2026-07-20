import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FadingLettersFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/FadingLettersFx',
  component: FadingLettersFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animates text in or out letter by letter with a fading opacity, useful for transient messages entering or leaving the screen.',
      },
    },
  },
  argTypes: {
    animationState: { control: 'select', options: ['entering', 'visible', 'exiting'], description: 'Current lifecycle phase driving the letter animation.' },
    text: { control: 'text', description: 'Text content to animate.' },
  },
  args: {
    text: 'Presence that does not beg for attention.',
    animationState: 'visible',
    variant: 'body-default-l',
  },
} satisfies Meta<typeof FadingLettersFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
