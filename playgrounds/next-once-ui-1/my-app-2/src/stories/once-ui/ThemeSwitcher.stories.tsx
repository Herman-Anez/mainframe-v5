import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeSwitcher } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ThemeSwitcher is a control that toggles the app between light and dark color themes.',
      },
    },
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
