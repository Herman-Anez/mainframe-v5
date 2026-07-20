import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import Home from './page';

const meta = {
  component: Home,
  tags: ['ai-generated'],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('col1')).toBeVisible();
    await expect(canvas.getByText('Text on background')).toBeVisible();
  },
};

// Once UI's Column applies `display: flex` via its own stylesheet — a raw <div>
// defaults to `display: block`, so this fails if Once UI's CSS never loaded.
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const col1 = canvas.getByText('col1');
    await expect(getComputedStyle(col1.parentElement as HTMLElement).display).toBe('flex');
  },
};
