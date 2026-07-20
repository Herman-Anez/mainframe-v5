import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusIndicator, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    color: {
      control: 'select',
      options: ['blue', 'indigo', 'violet', 'magenta', 'pink', 'red', 'orange', 'yellow', 'moss', 'green', 'emerald', 'aqua', 'cyan', 'gray'],
    },
  },
  args: {
    size: 'm',
    color: 'green',
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['blue', 'green', 'red', 'yellow', 'gray', 'violet', 'orange', 'cyan'] as const).map((color) => (
        <StatusIndicator key={color} color={color} size="m" />
      ))}
    </Row>
  ),
};
