import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AutoScroll, Tag } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Media/AutoScroll',
  component: AutoScroll,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Continuously auto-scrolls its children horizontally, useful for marquees like logo or tag lists.',
      },
    },
  },
  argTypes: {
    speed: { control: 'select', options: ['slow', 'medium', 'fast'], description: 'Scrolling speed.' },
    hover: { control: 'select', options: ['slow', 'pause', 'none'], description: 'Behavior when the user hovers over the content.' },
    reverse: { control: 'boolean', description: 'Reverses the scrolling direction.' },
  },
  args: {
    speed: 'medium',
    hover: 'pause',
    children: null,
  },
} satisfies Meta<typeof AutoScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AutoScroll {...args} gap="12" style={{ maxWidth: 480 }}>
      {['React', 'Next.js', 'TypeScript', 'Once UI', 'Storybook', 'Vite'].map((label) => (
        <Tag key={label} label={label} variant="neutral" />
      ))}
    </AutoScroll>
  ),
};
