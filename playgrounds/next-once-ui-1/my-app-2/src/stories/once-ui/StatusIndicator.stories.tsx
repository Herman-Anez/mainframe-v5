import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusIndicator, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A small colored dot used to indicate a status, such as online presence or system health.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the status dot.' },
    color: {
      control: 'select',
      options: ['blue', 'indigo', 'violet', 'magenta', 'pink', 'red', 'orange', 'yellow', 'moss', 'green', 'emerald', 'aqua', 'cyan', 'gray'],
      description: 'Color of the status dot.',
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
