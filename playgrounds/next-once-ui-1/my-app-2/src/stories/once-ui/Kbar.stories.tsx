import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Kbar, Text } from '@once-ui-system/core';

const items = [
  { id: 'home', name: 'Go to Home', section: 'Navigation', shortcut: ['g', 'h'], keywords: 'home start' },
  { id: 'docs', name: 'Go to Docs', section: 'Navigation', shortcut: ['g', 'd'], keywords: 'documentation' },
  { id: 'new', name: 'Create new item', section: 'Actions', shortcut: ['c'], keywords: 'add create' },
];

const meta = {
  title: 'Once UI/Navigation/Kbar',
  component: Kbar,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
    docs: {
      description: {
        component: 'A command-palette (⌘K / Ctrl+K) overlay for searching and running actions. Click the trigger or press the shortcut to open it.',
      },
    },
  },
  args: {
    items,
    children: <Text onBackground="neutral-weak">Search... (⌘K)</Text>,
  },
} satisfies Meta<typeof Kbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
