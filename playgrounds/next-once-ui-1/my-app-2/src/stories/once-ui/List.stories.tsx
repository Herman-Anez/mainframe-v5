import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { List, ListItem } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Data Display/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A styled ordered or unordered list container, used together with ListItem for bulleted or numbered content.',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['ul', 'ol'], description: 'Renders as an unordered or ordered list element.' },
    gap: { control: 'select', options: ['4', '8', '12', '16'], description: 'Vertical spacing token between list items.' },
  },
  args: {
    as: 'ul',
    gap: '8',
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem>First item</ListItem>
      <ListItem>Second item</ListItem>
      <ListItem>Third item</ListItem>
    </List>
  ),
};

export const Ordered: Story = {
  args: { as: 'ol' },
  render: (args) => (
    <List {...args}>
      <ListItem>Install dependencies</ListItem>
      <ListItem>Run the dev server</ListItem>
      <ListItem>Open Storybook</ListItem>
    </List>
  ),
};
