import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RevealFx, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/RevealFx',
  component: RevealFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Animates its children into view with a fade and vertical translation, useful for revealing content as it enters the viewport or mounts.',
      },
    },
  },
  argTypes: {
    speed: { control: 'select', options: ['slow', 'medium', 'fast'], description: 'How fast the reveal animation plays.' },
    delay: { control: 'number', description: 'Delay in milliseconds before the reveal starts.' },
    revealedByDefault: { control: 'boolean', description: 'Renders content already revealed instead of animating in.' },
    translateY: { control: 'number', description: 'Vertical distance in pixels the content travels while revealing.' },
  },
  args: {
    speed: 'medium',
    revealedByDefault: true,
    translateY: 8,
    children: (
      <Card padding="24" radius="m" border="neutral-alpha-medium">
        <Text>Revealed content</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof RevealFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
