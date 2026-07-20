import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SmartLink } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Actions/SmartLink',
  component: SmartLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A styled anchor that automatically routes internal links through Next.js Link while rendering plain anchors for external URLs.',
      },
    },
  },
  argTypes: {
    selected: { control: 'boolean', description: 'Displays the link in a selected/active state.' },
    unstyled: { control: 'boolean', description: 'Removes the default link styling.' },
    fillWidth: { control: 'boolean', description: 'Expands the link to fill the width of its container.' },
    prefixIcon: { control: 'text', description: 'Name of the icon shown before the link text.' },
    suffixIcon: { control: 'text', description: 'Name of the icon shown after the link text.' },
    href: { control: 'text', description: 'Destination URL of the link.' },
  },
  args: {
    href: 'https://docs.once-ui.com',
    children: 'Read the docs',
  },
} satisfies Meta<typeof SmartLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { suffixIcon: 'arrowUpRight' },
};
