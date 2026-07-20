import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Column, Heading, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    fillHeight: { control: 'boolean' },
    padding: { control: 'select', options: ['0', '4', '8', '12', '16', '20', '24', '32'] },
    radius: { control: 'select', options: ['none', 's', 'm', 'l', 'full'] },
    border: { control: 'select', options: ['neutral-alpha-weak', 'neutral-alpha-medium', 'neutral-alpha-strong'] },
    href: { control: 'text' },
  },
  args: {
    padding: '24',
    radius: 'l',
    border: 'neutral-alpha-medium',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} maxWidth={20}>
      <Column gap="8">
        <Heading variant="heading-strong-s">Card title</Heading>
        <Text onBackground="neutral-weak">A short description of what this card represents.</Text>
      </Column>
    </Card>
  ),
};

export const Clickable: Story = {
  args: { href: 'https://docs.once-ui.com' },
  render: (args) => (
    <Card {...args} maxWidth={20}>
      <Column gap="8">
        <Heading variant="heading-strong-s">Linked card</Heading>
        <Text onBackground="neutral-weak">Cards with an href render as links.</Text>
      </Column>
    </Card>
  ),
};
