import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LetterFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/LetterFx',
  component: LetterFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Scrambles text through random characters before settling into the final content, a decrypt/hacker-style text reveal effect.',
      },
    },
  },
  argTypes: {
    trigger: { control: 'select', options: ['hover', 'instant', 'custom'], description: 'What user action starts the scramble animation.' },
    speed: { control: 'select', options: ['fast', 'medium', 'slow'], description: 'How fast the letters resolve to their final characters.' },
  },
  args: {
    trigger: 'hover',
    speed: 'medium',
    children: 'Hover this text',
  },
} satisfies Meta<typeof LetterFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
