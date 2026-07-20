import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders semantic heading elements (h1-h6) styled from the Once UI typography scale. Use it for page and section titles.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-strong-l', 'display-default-l',
        'heading-strong-xl', 'heading-strong-l', 'heading-strong-m', 'heading-strong-s',
        'heading-default-xl', 'heading-default-l', 'heading-default-m', 'heading-default-s',
      ],
      description: 'Typography scale variant applied to the heading.',
    },
    align: { control: 'select', options: ['left', 'center', 'right'], description: 'Horizontal text alignment.' },
    onBackground: { control: 'text', description: 'Text color token, expressed as a background/weight pair.' },
    wrap: { control: 'select', options: ['normal', 'break-word', 'balance'], description: 'CSS text-wrap behavior for long content.' },
  },
  args: {
    variant: 'heading-strong-l',
    children: 'The quick brown fox',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <Column gap="8">
      <Heading variant="display-strong-l">Display strong l</Heading>
      <Heading variant="heading-strong-xl">Heading strong xl</Heading>
      <Heading variant="heading-strong-l">Heading strong l</Heading>
      <Heading variant="heading-strong-m">Heading strong m</Heading>
      <Heading variant="heading-strong-s">Heading strong s</Heading>
    </Column>
  ),
};
