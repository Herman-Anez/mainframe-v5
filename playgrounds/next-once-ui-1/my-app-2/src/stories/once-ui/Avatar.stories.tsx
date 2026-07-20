import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    loading: { control: 'boolean' },
    empty: { control: 'boolean' },
    value: { control: 'text' },
    src: { control: 'text' },
  },
  args: {
    value: 'JD',
    size: 'm',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Row gap="12" vertical="center">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Avatar key={size} value="JD" size={size} />
      ))}
    </Row>
  ),
};

export const WithStatus: Story = {
  args: { statusIndicator: { color: 'green' } },
};
