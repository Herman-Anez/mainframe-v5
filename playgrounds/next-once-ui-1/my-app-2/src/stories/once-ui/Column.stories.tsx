import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Column } from '@once-ui-system/core';

const Box = ({ children }: { children: React.ReactNode }) => (
  <Column
    padding="12"
    radius="m"
    background="brand-medium"
    border="brand-alpha-medium"
    horizontal="center"
  >
    {children}
  </Column>
);

const meta = {
  title: 'Once UI/Layout/Column',
  component: Column,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Column is a vertical flex container that stacks children on top of each other, with props for gap and alignment.',
      },
    },
  },
  argTypes: {
    horizontal: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Horizontal alignment of children along the column.' },
    vertical: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Vertical alignment of children along the column.' },
    gap: { control: 'select', options: ['4', '8', '12', '16', '24', '32'], description: 'Spacing between child items.' },
    fillWidth: { control: 'boolean', description: 'Whether the column stretches to fill the available width.' },
  },
  args: {
    gap: '12',
  },
} satisfies Meta<typeof Column>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Column {...args}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Column>
  ),
};
