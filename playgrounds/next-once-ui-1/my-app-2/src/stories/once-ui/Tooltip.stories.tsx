import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tooltip, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    prefixIcon: { control: 'text' },
    suffixIcon: { control: 'text' },
  },
  args: {
    label: 'Helpful hint',
    prefixIcon: 'info',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="12" wrap>
      <Tooltip label="Plain" />
      <Tooltip label="With prefix" prefixIcon="info" />
      <Tooltip label="With suffix" suffixIcon="check" />
    </Row>
  ),
};
