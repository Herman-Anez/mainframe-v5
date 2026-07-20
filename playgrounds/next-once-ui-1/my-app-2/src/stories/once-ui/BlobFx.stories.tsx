import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BlobFx } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Effects/BlobFx',
  component: BlobFx,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders an animated, organically morphing gradient blob shape, useful as decorative background or avatar filler.',
      },
    },
  },
  argTypes: {
    seed: { control: 'number', description: 'Seed value that determines the blob\'s shape and color.' },
  },
  args: {
    seed: 1,
  },
} satisfies Meta<typeof BlobFx>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <BlobFx {...args} width={16} height={16} />,
};
