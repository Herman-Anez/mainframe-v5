import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FlipFx, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/FlipFx',
  component: FlipFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a card that flips between a front and back face on click, like a 3D flip card.',
      },
    },
  },
  argTypes: {
    flipDirection: { control: 'select', options: ['horizontal', 'vertical'], description: 'Axis the card flips around.' },
    timing: { control: 'number', description: 'Duration of the flip animation, in milliseconds.' },
    disableClickFlip: { control: 'boolean', description: 'Disables flipping the card on click.' },
  },
  args: {
    flipDirection: 'horizontal',
    front: (
      <Card padding="24" radius="m" border="neutral-alpha-medium" horizontal="center" vertical="center">
        <Text>Front</Text>
      </Card>
    ),
    back: (
      <Card padding="24" radius="m" border="brand-alpha-medium" background="brand-medium" horizontal="center" vertical="center">
        <Text onBackground="brand-strong">Back</Text>
      </Card>
    ),
  },
} satisfies Meta<typeof FlipFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <FlipFx {...args} width={16} height={10} />,
};
