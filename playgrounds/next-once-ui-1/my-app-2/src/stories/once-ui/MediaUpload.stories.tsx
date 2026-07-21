import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MediaUpload } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/MediaUpload',
  component: MediaUpload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A drag-and-drop / click-to-browse file input for uploading images or other media, with preview support.',
      },
    },
  },
  args: {
    onFileUpload: async () => {},
  },
} satisfies Meta<typeof MediaUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
