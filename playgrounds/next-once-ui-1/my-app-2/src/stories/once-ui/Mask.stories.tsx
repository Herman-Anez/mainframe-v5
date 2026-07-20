import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Mask, Flex, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/Mask',
  component: Mask,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Reveals its children through a circular mask that can follow the cursor or a fixed position.',
      },
    },
  },
  argTypes: {
    cursor: { control: 'boolean', description: 'Makes the mask follow the cursor position.' },
    radius: { control: 'number', description: 'Radius of the mask circle.' },
    x: { control: 'number', description: 'Fixed horizontal position of the mask, when not following the cursor.' },
    y: { control: 'number', description: 'Fixed vertical position of the mask, when not following the cursor.' },
  },
  args: {
    cursor: true,
    radius: 30,
  },
} satisfies Meta<typeof Mask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Mask {...args} style={{ position: 'relative', width: 320, height: 160 }}>
      <Flex
        fillWidth
        fillHeight
        horizontal="center"
        vertical="center"
        background="brand-medium"
      >
        <Text onBackground="brand-strong">Move your cursor over this box</Text>
      </Flex>
    </Mask>
  ),
};
