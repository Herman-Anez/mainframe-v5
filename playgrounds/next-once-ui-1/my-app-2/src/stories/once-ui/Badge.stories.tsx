import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A pill-shaped label used to draw attention to new features, announcements, or optional links.',
      },
    },
  },
  argTypes: {
    arrow: { control: 'boolean', description: 'Shows a trailing arrow icon.' },
    effect: { control: 'boolean', description: 'Enables a decorative animated visual effect.' },
    title: { control: 'text', description: 'Text displayed inside the badge.' },
    icon: { control: 'text', description: 'Name of the icon displayed inside the badge.' },
    href: { control: 'text', description: 'URL that turns the badge into a link.' },
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
