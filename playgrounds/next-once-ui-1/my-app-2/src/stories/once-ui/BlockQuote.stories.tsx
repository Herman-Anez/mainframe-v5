import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BlockQuote } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Typography/BlockQuote',
  component: BlockQuote,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a highlighted quotation with an optional author, preline, subline, and separator rule.',
      },
    },
  },
  argTypes: {
    align: { control: 'select', options: ['left', 'center', 'right'], description: 'Horizontal alignment of the quote content.' },
    separator: { control: 'select', options: ['top', 'bottom', 'both', 'none'], description: 'Position of the divider rule around the quote.' },
    preline: { control: 'text', description: 'Short text shown above the quote.' },
    subline: { control: 'text', description: 'Short text shown below the quote.' },
  },
  args: {
    children: 'Presence that doesn’t beg for attention.',
    author: { name: 'Once UI' },
  },
} satisfies Meta<typeof BlockQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
