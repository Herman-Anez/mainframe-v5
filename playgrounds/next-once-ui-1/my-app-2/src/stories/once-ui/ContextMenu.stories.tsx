import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContextMenu, Dropdown, Option, Card, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ContextMenu wraps content and shows a Dropdown menu at the cursor position when the user right-clicks it.',
      },
    },
  },
  args: {
    children: null,
    dropdown: null,
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu
      dropdown={
        <Dropdown>
          <Option label="Copy" value="copy" />
          <Option label="Rename" value="rename" />
          <Option label="Delete" value="delete" />
        </Dropdown>
      }
    >
      <Card padding="24" radius="m" border="neutral-alpha-medium">
        <Text onBackground="neutral-weak">Right-click me</Text>
      </Card>
    </ContextMenu>
  ),
};
