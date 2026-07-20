import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Media } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/Media',
  component: Media,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A responsive image/video wrapper built on next/image with support for aspect ratio, captions, and loading states.',
      },
    },
  },
  argTypes: {
    aspectRatio: { control: 'text', description: 'CSS aspect-ratio applied to the media container (e.g. "16 / 9").' },
    objectFit: { control: 'select', options: ['cover', 'contain', 'fill', 'none', 'scale-down'], description: 'CSS object-fit applied to the media element.' },
    radius: { control: 'select', options: ['none', 's', 'm', 'l', 'full'], description: 'Corner radius token applied to the media.' },
    unoptimized: { control: 'boolean', description: 'Skips Next.js image optimization for the source.' },
    loading: { control: 'boolean', description: 'Shows a loading skeleton state while the media loads.' },
    caption: { control: 'text', description: 'Optional caption rendered below the media.' },
  },
  args: {
    src: 'https://picsum.photos/seed/once-ui/640/360',
    alt: 'Placeholder image',
    aspectRatio: '16 / 9',
    radius: 'l',
    unoptimized: true,
  },
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Media {...args} style={{ maxWidth: 480 }} />,
};

export const WithCaption: Story = {
  args: { caption: 'A placeholder image with a caption.' },
  render: (args) => <Media {...args} style={{ maxWidth: 480 }} />,
};
