import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SplitView, Flex, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Layout/SplitView',
  component: SplitView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A resizable two-panel layout with a draggable divider between a left and right panel.',
      },
    },
  },
  argTypes: {
    defaultSplit: { control: { type: 'range', min: 10, max: 90, step: 5 }, description: 'Initial split position as a percentage.' },
    minSplit: { control: 'number', description: 'Minimum split position as a percentage.' },
    maxSplit: { control: 'number', description: 'Maximum split position as a percentage.' },
  },
  args: {
    defaultSplit: 50,
    minSplit: 20,
    maxSplit: 80,
    leftPanel: null,
    rightPanel: null,
  },
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SplitView
      {...args}
      leftPanel={
        <Flex fillWidth fillHeight horizontal="center" vertical="center" background="neutral-alpha-weak">
          <Text>Left panel</Text>
        </Flex>
      }
      rightPanel={
        <Flex fillWidth fillHeight horizontal="center" vertical="center" background="neutral-alpha-medium">
          <Text>Right panel</Text>
        </Flex>
      }
      style={{ height: 240 }}
    />
  ),
};
