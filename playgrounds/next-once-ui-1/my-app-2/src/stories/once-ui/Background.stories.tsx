import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Background, Flex, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/Background',
  component: Background,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A decorative background layer that renders dots, grid lines, gradients, or diagonal lines behind content.',
      },
    },
  },
  args: {
    dots: { display: true, size: '2', opacity: 40 },
    style: { position: 'absolute', inset: 0 },
  },
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dots: Story = {
  render: (args) => (
    <Flex
      style={{ position: 'relative', width: 320, height: 160, overflow: 'hidden' }}
      radius="m"
      border="neutral-alpha-medium"
      horizontal="center"
      vertical="center"
    >
      <Background {...args} />
      <Text>Dotted background</Text>
    </Flex>
  ),
};

export const Grid: Story = {
  args: { dots: undefined, grid: { display: true, opacity: 40 } },
  render: (args) => (
    <Flex
      style={{ position: 'relative', width: 320, height: 160, overflow: 'hidden' }}
      radius="m"
      border="neutral-alpha-medium"
      horizontal="center"
      vertical="center"
    >
      <Background {...args} />
      <Text>Grid background</Text>
    </Flex>
  ),
};
