import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, Column, Heading, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A container for grouping related content, optionally rendered as a clickable link when given an href.',
      },
    },
  },
  argTypes: {
    fillHeight: { control: 'boolean', description: 'Makes the card expand to fill the height of its container.' },
    padding: { control: 'select', options: ['0', '4', '8', '12', '16', '20', '24', '32'], description: 'Inner padding of the card.' },
    radius: { control: 'select', options: ['none', 's', 'm', 'l', 'full'], description: 'Corner radius of the card.' },
    border: { control: 'select', options: ['neutral-alpha-weak', 'neutral-alpha-medium', 'neutral-alpha-strong'], description: 'Border strength of the card.' },
    href: { control: 'text', description: 'URL that turns the card into a link.' },
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
