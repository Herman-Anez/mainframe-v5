import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { User } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/User',
  component: User,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'User displays a person\'s avatar alongside their name, an optional subline, and an optional tag/badge.',
      },
    },
  },
  argTypes: {
    name: { control: 'text', description: 'Display name of the user.' },
    subline: { control: 'text', description: 'Secondary text shown below the name, e.g. an email or role.' },
    tag: { control: 'text', description: 'Label text for a badge shown next to the user.' },
    loading: { control: 'boolean', description: 'Whether to show a loading/skeleton state.' },
  },
  args: {
    name: 'Ada Lovelace',
    subline: 'ada@example.com',
    avatarProps: { value: 'AL' },
  },
} satisfies Meta<typeof User>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTag: Story = {
  args: { tag: 'Admin' },
};
