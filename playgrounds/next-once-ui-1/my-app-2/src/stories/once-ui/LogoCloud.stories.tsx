import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LogoCloud } from '@once-ui-system/core';

const logos = [
  { icon: '/trademarks/icon-dark.svg', size: 'm' as const },
  { icon: '/trademarks/icon-dark.svg', size: 'm' as const },
  { icon: '/trademarks/icon-dark.svg', size: 'm' as const },
  { icon: '/trademarks/icon-dark.svg', size: 'm' as const },
];

const meta = {
  title: 'Once UI/Data Display/LogoCloud',
  component: LogoCloud,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'LogoCloud displays a grid of partner/brand logos, optionally rotating through a larger set of logos over time.',
      },
    },
  },
  argTypes: {
    columns: { control: 'select', options: ['2', '3', '4', '6'], description: 'Number of grid columns used to lay out the logos.' },
  },
  args: {
    logos,
    columns: '4',
    gap: '24',
  },
} satisfies Meta<typeof LogoCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
