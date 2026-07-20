import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
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
