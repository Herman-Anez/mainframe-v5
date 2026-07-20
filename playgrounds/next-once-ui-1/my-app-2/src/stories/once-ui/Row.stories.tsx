import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Row } from '@once-ui-system/core';

const Box = ({ children }: { children: React.ReactNode }) => (
  <Row
    padding="12"
    radius="m"
    background="brand-medium"
    border="brand-alpha-medium"
    horizontal="center"
    vertical="center"
  >
    {children}
  </Row>
);

const meta = {
  title: 'Once UI/Layout/Row',
  component: Row,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Row is a horizontal flex container that lays out children side by side, with props for gap, alignment, and wrapping.',
      },
    },
  },
  argTypes: {
    horizontal: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Horizontal alignment of children along the row.' },
    vertical: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'even', 'stretch'], description: 'Vertical alignment of children along the row.' },
    gap: { control: 'select', options: ['4', '8', '12', '16', '24', '32'], description: 'Spacing between child items.' },
    wrap: { control: 'boolean', description: 'Whether children wrap onto multiple lines.' },
    fillWidth: { control: 'boolean', description: 'Whether the row stretches to fill the available width.' },
  },
  args: {
    gap: '12',
  },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Row {...args}>
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Row>
  ),
};

export const SpaceBetween: Story = {
  args: { horizontal: 'between', fillWidth: true },
  render: (args) => (
    <Row {...args} style={{ maxWidth: 320 }}>
      <Box>Left</Box>
      <Box>Right</Box>
    </Row>
  ),
};
