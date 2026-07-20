import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    arrow: { control: 'boolean' },
    effect: { control: 'boolean' },
    title: { control: 'text' },
    icon: { control: 'text' },
    href: { control: 'text' },
  },
  args: {
    title: 'Shipped v1.7',
    icon: 'sparkle',
    arrow: true,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      <Badge title="Plain" />
      <Badge title="With icon" icon="check" />
      <Badge title="With arrow" arrow />
      <Badge title="Effect" effect />
      <Badge title="Link" href="https://docs.once-ui.com" arrow />
    </Row>
  ),
};
