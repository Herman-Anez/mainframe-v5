import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    icon: { control: 'text' },
    tooltip: { control: 'text' },
  },
  args: {
    icon: 'check',
    variant: 'primary',
    size: 'm',
    tooltip: 'Confirm',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      {(['primary', 'secondary', 'tertiary', 'quaternary', 'subtle', 'danger', 'success', 'warning', 'ghost', 'link'] as const).map((variant) => (
        <IconButton key={variant} variant={variant} icon="check" tooltip={variant} />
      ))}
    </Row>
  ),
};
