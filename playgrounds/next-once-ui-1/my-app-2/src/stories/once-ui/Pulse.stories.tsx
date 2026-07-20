import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pulse, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/Pulse',
  component: Pulse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a small pulsing dot indicator, commonly used to show live/active status.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'brand', 'accent', 'info', 'danger', 'warning', 'success'], description: 'Color scheme of the pulse dot.' },
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the pulse dot.' },
  },
  args: {
    variant: 'success',
    size: 'm',
  },
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Row gap="16">
      {(['brand', 'success', 'danger', 'warning'] as const).map((variant) => (
        <Pulse key={variant} variant={variant} size="m" />
      ))}
    </Row>
  ),
};
