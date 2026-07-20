import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tag, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'accent', 'info', 'danger', 'warning', 'success', 'gradient'],
    },
    size: { control: 'select', options: ['s', 'm', 'l'] },
    prefixIcon: { control: 'text' },
    suffixIcon: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    label: 'New',
    variant: 'brand',
    size: 'm',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['neutral', 'brand', 'accent', 'info', 'danger', 'warning', 'success', 'gradient'] as const).map((variant) => (
        <Tag key={variant} variant={variant} label={variant} />
      ))}
    </Row>
  ),
};
