import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TiltFx, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/TiltFx',
  component: TiltFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Applies a 3D tilt to its children that follows the cursor while hovering, giving a parallax card effect.',
      },
    },
  },
  argTypes: {
    intensity: { control: 'number', description: 'Maximum tilt angle in degrees.' },
  },
  args: {
    intensity: 10,
    children: (
      <Card padding="24" radius="m" border="neutral-alpha-medium">
        <Text>Move your cursor over this card</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof TiltFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
