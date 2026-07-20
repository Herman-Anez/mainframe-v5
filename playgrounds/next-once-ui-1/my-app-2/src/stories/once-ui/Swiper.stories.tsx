import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Swiper } from '@once-ui-system/core';

const items = [
  { slide: '/images/og/home.jpg', alt: 'Slide 1' },
  { slide: '/images/og/home.jpg', alt: 'Slide 2' },
  { slide: '/images/og/home.jpg', alt: 'Slide 3' },
];

const meta = {
  title: 'Once UI/Media/Swiper',
  component: Swiper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A touch-friendly, swipeable slideshow component for cycling through images or slides.',
      },
    },
  },
  argTypes: {
    controls: { control: 'boolean', description: 'Shows previous/next navigation controls.' },
    indicator: { control: 'boolean', description: 'Shows dot indicators for the current slide.' },
    aspectRatio: { control: 'text', description: 'Aspect ratio applied to the swiper, e.g. "16 / 9".' },
  },
  args: {
    items,
    controls: true,
    indicator: true,
    aspectRatio: '16 / 9',
  },
} satisfies Meta<typeof Swiper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Swiper {...args} style={{ maxWidth: 480 }} />,
};
