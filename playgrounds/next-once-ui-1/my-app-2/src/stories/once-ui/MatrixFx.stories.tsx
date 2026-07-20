import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MatrixFx, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/MatrixFx',
  component: MatrixFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a canvas-based Matrix-style falling character rain behind its children, useful as a decorative or thematic background effect.',
      },
    },
  },
  argTypes: {
    trigger: { control: 'select', options: ['hover', 'instant', 'mount', 'click', 'manual'], description: 'What user action starts the effect.' },
    speed: { control: 'number', description: 'Speed at which characters fall.' },
    flicker: { control: 'boolean', description: 'Enables a flickering brightness effect on characters.' },
  },
  args: {
    trigger: 'mount',
    speed: 1,
  },
} satisfies Meta<typeof MatrixFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <MatrixFx {...args} width={20} height={12}>
      <Text>Matrix background</Text>
    </MatrixFx>
  ),
};
