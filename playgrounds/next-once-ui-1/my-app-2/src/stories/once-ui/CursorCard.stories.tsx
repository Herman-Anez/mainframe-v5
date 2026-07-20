import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CursorCard, Text, Card } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/CursorCard',
  component: CursorCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Shows an overlay card that follows the mouse cursor while hovering over a trigger element, useful for contextual previews or extra info.',
      },
    },
  },
  args: {
    trigger: <Text>Hover this text to see a cursor-following card</Text>,
    overlay: (
      <Card padding="12" radius="m" border="neutral-alpha-medium">
        <Text onBackground="neutral-weak">Extra info</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof CursorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
