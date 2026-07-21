import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileMegaMenu } from '@once-ui-system/core';

const menuGroups = [
  {
    id: 'products',
    label: 'Products',
    sections: [
      {
        title: 'Platform',
        links: [
          { label: 'Overview', href: '#' },
          { label: 'Pricing', href: '#' },
        ],
      },
    ],
  },
  { id: 'docs', label: 'Docs', href: '#' },
  { id: 'about', label: 'About', href: '#' },
];

const meta = {
  title: 'Once UI/Navigation/MobileMegaMenu',
  component: MobileMegaMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The mobile/collapsed counterpart to MegaMenu — a full-screen stacked navigation panel for small viewports.',
      },
    },
  },
  args: {
    menuGroups,
    onClose: () => {},
  },
} satisfies Meta<typeof MobileMegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
