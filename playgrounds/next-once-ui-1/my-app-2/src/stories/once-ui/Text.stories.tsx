import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Typography/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders inline or block text styled from the Once UI typography scale. Use it for body copy, labels, and code snippets.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'body-default-xs', 'body-default-s', 'body-default-m', 'body-default-l',
        'body-strong-s', 'body-strong-m', 'body-strong-l',
        'label-default-s', 'label-default-m',
        'code-default-s', 'code-default-m',
      ],
      description: 'Typography scale variant applied to the text.',
    },
    align: { control: 'select', options: ['left', 'center', 'right'], description: 'Horizontal text alignment.' },
    onBackground: { control: 'text', description: 'Text color token, expressed as a background/weight pair.' },
    truncate: { control: 'boolean', description: 'Truncates overflowing text with an ellipsis.' },
  },
  args: {
    variant: 'body-default-m',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <Column gap="8">
      <Text variant="body-default-xs">body-default-xs</Text>
      <Text variant="body-default-s">body-default-s</Text>
      <Text variant="body-default-m">body-default-m</Text>
      <Text variant="body-default-l">body-default-l</Text>
      <Text variant="body-strong-m">body-strong-m</Text>
      <Text variant="label-default-s">label-default-s</Text>
      <Text variant="code-default-s">code-default-s</Text>
    </Column>
  ),
};

export const OnBackground: Story = {
  render: () => (
    <Column gap="8">
      <Text onBackground="neutral-weak">onBackground neutral-weak</Text>
      <Text onBackground="brand-medium">onBackground brand-medium</Text>
      <Text onBackground="danger-medium">onBackground danger-medium</Text>
      <Text onBackground="success-medium">onBackground success-medium</Text>
    </Column>
  ),
};
