import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Fade, Column, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/Fade',
  component: Fade,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a gradient overlay that fades content into a background color at one edge, commonly used to hint at scrollable overflow.',
      },
    },
  },
  argTypes: {
    to: { control: 'select', options: ['bottom', 'top', 'left', 'right'], description: 'Edge the fade gradient is anchored to.' },
    base: { control: 'text', description: 'Background color the content fades into.' },
    blur: { control: 'number', description: 'Amount of blur applied to the fade.' },
  },
  args: {
    to: 'bottom',
    base: 'page',
    height: 4,
    position: 'absolute',
    bottom: '0',
    fillWidth: true,
  },
} satisfies Meta<typeof Fade>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Column style={{ position: 'relative', height: 160, overflow: 'hidden' }} padding="16" gap="8">
      {Array.from({ length: 10 }).map((_, i) => (
        <Text key={i} onBackground="neutral-weak">
          Scrollable line {i + 1}
        </Text>
      ))}
      <Fade {...args} />
    </Column>
  ),
};
