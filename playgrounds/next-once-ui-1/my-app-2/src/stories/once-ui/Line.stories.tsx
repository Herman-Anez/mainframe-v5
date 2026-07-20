import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Line, Row, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Layout/Line',
  component: Line,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A thin divider used to visually separate content, either horizontally or vertically.',
      },
    },
  },
  argTypes: {
    vert: { control: 'boolean', description: 'Renders the line vertically instead of horizontally.' },
    background: { control: 'text', description: 'Background color token used for the line.' },
  },
  args: {
    background: 'neutral-alpha-medium',
  },
} satisfies Meta<typeof Line>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Column fillWidth maxWidth={24}>
      <Line {...args} />
    </Column>
  ),
};

export const Vertical: Story = {
  args: { vert: true },
  render: (args) => (
    <Row height={4}>
      <Line {...args} />
    </Row>
  ),
};
