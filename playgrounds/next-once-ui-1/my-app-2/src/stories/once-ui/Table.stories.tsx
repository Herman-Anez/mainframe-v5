import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Table } from '@once-ui-system/core';

const sampleData = {
  headers: [
    { content: 'Name', key: 'name' },
    { content: 'Role', key: 'role' },
    { content: 'Status', key: 'status' },
  ],
  rows: [
    ['Ada Lovelace', 'Engineer', 'Active'],
    ['Alan Turing', 'Researcher', 'Active'],
    ['Grace Hopper', 'Engineer', 'Away'],
  ],
};

const meta = {
  title: 'Once UI/Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders tabular data from a headers/rows data object, with optional row click handling.',
      },
    },
  },
  args: {
    data: sampleData,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
