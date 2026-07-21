import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MegaMenu } from '@once-ui-system/core';

const menuGroups = [
  {
    id: 'products',
    label: 'Products',
    sections: [
      {
        title: 'Platform',
        links: [
          { label: 'Overview', href: '#', description: 'What we do' },
          { label: 'Pricing', href: '#', description: 'Plans and pricing' },
        ],
      },
    ],
  },
  { id: 'docs', label: 'Docs', href: '#' },
  { id: 'about', label: 'About', href: '#' },
];

const meta = {
  title: 'Once UI/Navigation/MegaMenu',
  component: MegaMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A horizontal navigation bar where top-level items can expand into multi-column dropdown panels with sections and links.',
      },
    },
  },
  args: {
    menuGroups,
  },
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
