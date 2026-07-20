import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HoloFx, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/HoloFx',
  component: HoloFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Wraps its children with a holographic shine/burn/texture overlay that reacts to cursor movement, similar to a holographic trading card.',
      },
    },
  },
  args: {
    children: (
      <Card padding="24" radius="m" border="neutral-alpha-medium">
        <Text>Move your cursor over this card</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof HoloFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
