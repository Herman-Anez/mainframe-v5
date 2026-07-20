import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Arrow, Button } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/Arrow',
  component: Arrow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Draws an animated arrow that points from a trigger element toward the cursor, typically used inside a hover target like a button.',
      },
    },
  },
  argTypes: {
    scale: { control: 'number', description: 'Size multiplier for the arrow.' },
    color: { control: 'select', options: ['onBackground', 'onSolid'], description: 'Color scheme used to draw the arrow.' },
  },
  args: {
    trigger: '.arrow-trigger',
    scale: 1,
    color: 'onBackground',
  },
} satisfies Meta<typeof Arrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Button className="arrow-trigger" label="Hover me" variant="secondary" suffixIcon={undefined}>
      <Arrow {...args} />
    </Button>
  ),
};
