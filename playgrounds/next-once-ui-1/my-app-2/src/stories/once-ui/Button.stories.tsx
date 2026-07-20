import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A clickable button used to trigger actions, submit forms, or navigate when given an href.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'],
      description: 'Visual style of the button.',
    },
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the button.' },
    weight: { control: 'select', options: ['default', 'strong'], description: 'Font weight of the button label.' },
    rounded: { control: 'boolean', description: 'Renders the button with fully rounded corners.' },
    disabled: { control: 'boolean', description: 'Disables the button and prevents interaction.' },
    loading: { control: 'boolean', description: 'Shows a loading spinner and disables interaction.' },
    fillWidth: { control: 'boolean', description: 'Makes the button expand to fill its container width.' },
    arrowIcon: { control: 'boolean', description: 'Shows a trailing arrow icon.' },
    prefixIcon: { control: 'text', description: 'Icon rendered before the label.' },
    suffixIcon: { control: 'text', description: 'Icon rendered after the label.' },
    label: { control: 'text', description: 'Text displayed inside the button.' },
  },
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'm',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'] as const).map((variant) => (
        <Button key={variant} variant={variant} label={variant} />
      ))}
    </Row>
  ),
};
