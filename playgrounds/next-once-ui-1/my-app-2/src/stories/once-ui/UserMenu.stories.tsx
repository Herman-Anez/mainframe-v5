import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserMenu, Dropdown, Option } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'UserMenu combines a User summary with a DropdownWrapper, showing a dropdown menu of options when the user entry is clicked.',
      },
    },
  },
  argTypes: {
    name: { control: 'text', description: 'Display name of the user.' },
    subline: { control: 'text', description: 'Secondary text shown below the name, e.g. an email or role.' },
    selected: { control: 'boolean', description: 'Whether the user entry is shown in a selected/active state.' },
  },
  args: {
    name: 'Ada Lovelace',
    subline: 'ada@example.com',
    avatarProps: { value: 'AL' },
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <UserMenu
      {...args}
      dropdown={
        <Dropdown>
          <Option label="Profile" value="profile" />
          <Option label="Settings" value="settings" />
          <Option label="Sign out" value="signout" />
        </Dropdown>
      }
    />
  ),
};
