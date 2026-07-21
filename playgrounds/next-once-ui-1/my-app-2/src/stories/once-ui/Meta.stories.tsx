import type { Meta as StorybookMeta, StoryObj } from '@storybook/nextjs-vite';
import { Meta, InlineCode, Column, Text } from '@once-ui-system/core';

/**
 * `Meta` is not a visual component — it's a server-side helper for Next.js App Router
 * (`Meta.generate(...)`) that returns a `Metadata` object for `export const metadata = ...`
 * in a page/layout file. This story just renders what it produces, for reference.
 */
const MetaPreview = () => {
  const metadata = Meta.generate({
    title: 'Once UI Storybook reference',
    description: 'An interactive reference for the Once UI component library.',
    baseURL: 'https://example.com',
    path: '/docs',
  });
  return (
    <Column gap="8">
      <Text onBackground="neutral-weak">
        Not a UI component — call <InlineCode>Meta.generate()</InlineCode> in a Next.js page/layout and export the result as{' '}
        <InlineCode>metadata</InlineCode>. Output for the sample args:
      </Text>
      <pre style={{ fontSize: 12, overflow: 'auto' }}>{JSON.stringify(metadata, null, 2)}</pre>
    </Column>
  );
};

const meta = {
  title: 'Once UI/SEO/Meta',
  component: MetaPreview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Generates a Next.js Metadata object (title, description, Open Graph tags, canonical URL, etc.) for use in a page or layout — not a renderable component itself.',
      },
    },
  },
} satisfies StorybookMeta<typeof MetaPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
