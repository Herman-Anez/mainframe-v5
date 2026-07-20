import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Scroller, Tag } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Layout/Scroller',
  component: Scroller,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A scrollable row or column of content with faded edges indicating overflow.',
      },
    },
  },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'], description: 'Scroll direction.' },
  },
  args: {
    direction: 'row',
  },
} satisfies Meta<typeof Scroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Scroller {...args} gap="8" style={{ maxWidth: 320 }}>
      {['All', 'Active', 'Completed', 'Archived', 'Trashed', 'Drafts'].map((label) => (
        <Tag key={label} label={label} variant="neutral" />
      ))}
    </Scroller>
  ),
};
