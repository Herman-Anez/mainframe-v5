import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavIcon, Row } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/NavIcon',
  component: NavIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'NavIcon is an animated hamburger-style icon button used to toggle navigation menus, typically on mobile.',
      },
    },
  },
  argTypes: {
    isActive: { control: 'boolean', description: 'Whether the icon renders in its active (open) state.' },
  },
  args: {
    isActive: false,
  },
} satisfies Meta<typeof NavIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Row gap="16">
      <NavIcon isActive={false} />
      <NavIcon isActive={true} />
    </Row>
  ),
};
