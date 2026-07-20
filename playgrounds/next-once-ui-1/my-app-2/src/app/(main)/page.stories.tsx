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
    await expect(
      canvas.getByRole('heading', { name: /presence that doesn't beg for attention/i })
    ).toBeVisible();
    // Button renders as an anchor because href is passed — proves the href prop reached the DOM.
    const link = await canvas.findByRole('link', { name: /explore docs/i });
    await expect(link).toHaveAttribute('href', 'https://docs.once-ui.com/once-ui/quick-start');
  },
};
