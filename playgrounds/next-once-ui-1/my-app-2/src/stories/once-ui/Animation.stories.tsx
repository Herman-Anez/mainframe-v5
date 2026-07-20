import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Animation, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/Animation',
  component: Animation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Wraps a trigger element and animates children (fade, scale, slide, zoom) in response to hover, click, or manual activation.',
      },
    },
  },
  argTypes: {
    triggerType: { control: 'select', options: ['hover', 'click', 'manual'], description: 'What user action activates the animation.' },
    fade: { control: 'number', description: 'Opacity change applied during the animation.' },
    scale: { control: 'number', description: 'Scale factor applied during the animation.' },
    slideUp: { control: 'number', description: 'Distance in pixels the content slides upward.' },
    easing: { control: 'select', options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'spring', 'bounce'], description: 'Easing curve used for the transition.' },
  },
  args: {
    triggerType: 'hover',
    fade: 1,
    slideUp: 8,
    children: (
      <Card padding="16" radius="m" border="neutral-alpha-medium">
        <Text>Hover the trigger to animate me</Text>
      </Card>
    ),
    trigger: <Text weight="strong">Hover me</Text>,
  },
} satisfies Meta<typeof Animation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
