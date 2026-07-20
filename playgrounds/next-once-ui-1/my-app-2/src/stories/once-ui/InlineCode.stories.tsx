import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InlineCode, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Typography/InlineCode',
  component: InlineCode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders short code fragments inline within text using a monospace font and subtle background.',
      },
    },
  },
  args: {
    children: 'npm install',
  },
} satisfies Meta<typeof InlineCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSentence: Story = {
  render: () => (
    <Text>
      Run <InlineCode>pnpm exec storybook dev</InlineCode> to start the reference.
    </Text>
  ),
};
