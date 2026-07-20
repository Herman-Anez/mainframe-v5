import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OgCard } from '@once-ui-system/core';

const ogData = {
  title: 'Once UI — Design system for Next.js',
  description: 'A design system and component library built for Next.js applications.',
  faviconUrl: '/favicon.ico',
  image: '/images/og/home.jpg',
  url: 'https://docs.once-ui.com',
};

const meta = {
  title: 'Once UI/Data Display/OgCard',
  component: OgCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A card that displays Open Graph metadata (title, description, image, favicon) for a URL, either provided directly or fetched.',
      },
    },
  },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], description: 'Layout direction of the image and text content.' },
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the card.' },
  },
  args: {
    ogData,
    direction: 'column',
    size: 'm',
  },
} satisfies Meta<typeof OgCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <OgCard {...args} style={{ maxWidth: 320 }} />,
};
