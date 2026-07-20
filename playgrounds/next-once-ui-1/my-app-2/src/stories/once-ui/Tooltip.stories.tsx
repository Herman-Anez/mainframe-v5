import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tooltip, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A small floating label used to show additional context or a hint, typically alongside another element.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text displayed inside the tooltip.' },
    prefixIcon: { control: 'text', description: 'Icon rendered before the label.' },
    suffixIcon: { control: 'text', description: 'Icon rendered after the label.' },
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
