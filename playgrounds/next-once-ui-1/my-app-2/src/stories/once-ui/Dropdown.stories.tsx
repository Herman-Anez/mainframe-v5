import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Dropdown, Option } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Dropdown renders a list of Option items in a floating panel; typically rendered inside a DropdownWrapper or ContextMenu.',
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown minWidth={12}>
      <Option label="Apple" value="apple" />
      <Option label="Banana" value="banana" />
      <Option label="Cherry" value="cherry" />
    </Dropdown>
  ),
};
