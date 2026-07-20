import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MasonryGrid, Flex, Text } from '@once-ui-system/core';

const heights = [80, 140, 100, 180, 120, 90];

const meta = {
  title: 'Once UI/Layout/MasonryGrid',
  component: MasonryGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A masonry-style grid that lays out children in columns of varying heights, like Pinterest.',
      },
    },
  },
  argTypes: {
    columns: { control: 'number', description: 'Number of columns in the grid.' },
    gap: { control: 'select', options: ['8', '12', '16', '24'], description: 'Spacing between grid items.' },
  },
  args: {
    columns: 3,
    gap: '12',
    children: null,
  },
} satisfies Meta<typeof MasonryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MasonryGrid {...args}>
      {heights.map((h, i) => (
        <Flex
          key={i}
          height={h as unknown as number}
          radius="m"
          background="neutral-alpha-weak"
          border="neutral-alpha-medium"
          horizontal="center"
          vertical="center"
        >
          <Text onBackground="neutral-weak">{i + 1}</Text>
        </Flex>
      ))}
    </MasonryGrid>
  ),
};
