import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmojiPicker } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/EmojiPicker',
  component: EmojiPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A grid of emojis for picking a single emoji, typically embedded in a panel or dropdown.',
      },
    },
  },
  argTypes: {
    columns: { control: 'select', options: ['6', '8', '10'], description: 'Number of columns in the emoji grid.' },
  },
  args: {
    onSelect: () => {},
    columns: '8',
  },
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
