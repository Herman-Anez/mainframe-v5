import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CelebrationFx, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/CelebrationFx',
  component: CelebrationFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Plays a confetti or fireworks particle burst over its children, useful for celebrating completed actions or milestones.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['confetti', 'fireworks'], description: 'Which celebration effect to render.' },
    trigger: { control: 'select', options: ['mount', 'hover', 'manual', 'click'], description: 'What user action starts the effect.' },
    intensity: { control: 'number', description: 'Amount of particles produced by the effect.' },
    duration: { control: 'number', description: 'How long the effect plays, in milliseconds.' },
  },
  args: {
    type: 'confetti',
    trigger: 'hover',
    intensity: 1,
  },
} satisfies Meta<typeof CelebrationFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <CelebrationFx {...args}>
      <Card padding="24" radius="m" border="neutral-alpha-medium">
        <Text>Hover to celebrate</Text>
      </Card>
    </CelebrationFx>
  ),
};
