import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['s', 'm', 'l'] },
    weight: { control: 'select', options: ['default', 'strong'] },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fillWidth: { control: 'boolean' },
    arrowIcon: { control: 'boolean' },
    prefixIcon: { control: 'text' },
    suffixIcon: { control: 'text' },
    label: { control: 'text' },
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
