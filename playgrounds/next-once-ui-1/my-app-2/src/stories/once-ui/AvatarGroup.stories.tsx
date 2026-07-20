import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AvatarGroup } from '@once-ui-system/core';

const avatars = [{ value: 'AL' }, { value: 'GH' }, { value: 'AT' }, { value: 'CS' }];

const meta = {
  title: 'Once UI/Data Display/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'AvatarGroup displays a stack of overlapping Avatar components, useful for showing a list of participants with an optional overflow count.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'], description: 'Size of each avatar in the group.' },
    reverse: { control: 'boolean', description: 'Whether the stacking order of avatars is reversed.' },
    limit: { control: 'number', description: 'Maximum number of avatars to display before showing an overflow count.' },
  },
  args: {
    avatars,
    size: 'm',
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Limited: Story = {
  args: { limit: 2 },
};
