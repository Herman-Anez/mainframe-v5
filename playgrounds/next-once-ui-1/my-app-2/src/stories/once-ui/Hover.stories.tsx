import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hover, Text, Card } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/Hover',
  component: Hover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Shows an overlay near a trigger element while it is hovered, similar to a tooltip but supporting rich content.',
      },
    },
  },
  argTypes: {
    interactive: { control: 'boolean', description: 'Keeps the overlay open while the cursor is over it.' },
    delay: { control: 'number', description: 'Delay in milliseconds before the overlay appears.' },
    disabled: { control: 'boolean', description: 'Disables the hover overlay entirely.' },
  },
  args: {
    trigger: <Text weight="strong">Hover me</Text>,
    overlay: (
      <Card padding="12" radius="m" border="neutral-alpha-medium">
        <Text onBackground="neutral-weak">Overlay content</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof Hover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
