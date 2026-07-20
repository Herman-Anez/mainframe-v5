import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Flex } from '@once-ui-system/core';

const Box = ({ children }: { children: React.ReactNode }) => (
  <Flex
    padding="12"
    radius="m"
    background="accent-medium"
    border="accent-alpha-medium"
    horizontal="center"
    vertical="center"
  >
    {children}
  </Flex>
);

const meta = {
  title: 'Once UI/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Flex is a generic flex container that lets you control flex-direction, alignment, gap, and wrapping in a single component.',
      },
    },
  },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], description: 'Flex-direction of the container.' },
    horizontal: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Horizontal alignment of children.' },
    vertical: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Vertical alignment of children.' },
    gap: { control: 'select', options: ['4', '8', '12', '16', '24', '32'], description: 'Spacing between child items.' },
    wrap: { control: 'boolean', description: 'Whether children wrap onto multiple lines.' },
  },
  args: {
    direction: 'row',
    gap: '12',
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Flex {...args}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Flex>
  ),
};
