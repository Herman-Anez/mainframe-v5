import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Carousel } from '@once-ui-system/core';

const items = [
  { slide: '/images/og/home.jpg', alt: 'Slide 1' },
  { slide: '/images/og/home.jpg', alt: 'Slide 2' },
  { slide: '/images/og/home.jpg', alt: 'Slide 3' },
];

const meta = {
  title: 'Once UI/Media/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A slideshow component for cycling through a set of images or slides.',
      },
    },
  },
  argTypes: {
    controls: { control: 'boolean', description: 'Shows previous/next navigation controls.' },
    indicator: { control: 'select', options: ['line', 'thumbnail', false], description: 'Style of the slide indicator.' },
    aspectRatio: { control: 'text', description: 'Aspect ratio applied to the carousel, e.g. "16 / 9".' },
  },
  args: {
    items,
    controls: true,
    indicator: 'line',
    aspectRatio: '16 / 9',
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Carousel {...args} style={{ maxWidth: 480 }} />,
};
