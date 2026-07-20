import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CompareImage } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/CompareImage',
  component: CompareImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A before/after image comparison slider that reveals one image over another as it is dragged.',
      },
    },
  },
  argTypes: {
    aspectRatio: { control: 'text', description: 'Aspect ratio applied to the comparison area, e.g. "16 / 9".' },
  },
  args: {
    leftContent: { src: '/images/og/home.jpg', alt: 'Before' },
    rightContent: { src: '/images/og/home.jpg', alt: 'After' },
    aspectRatio: '16 / 9',
  },
} satisfies Meta<typeof CompareImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <CompareImage {...args} style={{ maxWidth: 480 }} />,
};
