import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An animated loading indicator used to signal that content or an action is in progress.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of the spinner.' },
  },
  args: {
    size: 'm',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Row gap="16" vertical="center">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </Row>
  ),
};
