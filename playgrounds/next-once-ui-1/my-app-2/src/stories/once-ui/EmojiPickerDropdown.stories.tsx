import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmojiPickerDropdown, Button } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/EmojiPickerDropdown',
  component: EmojiPickerDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A trigger element that opens an EmojiPicker in a dropdown when clicked.',
      },
    },
  },
  args: {
    onSelect: () => {},
    trigger: <Button label="Pick an emoji" variant="secondary" />,
  },
} satisfies Meta<typeof EmojiPickerDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
