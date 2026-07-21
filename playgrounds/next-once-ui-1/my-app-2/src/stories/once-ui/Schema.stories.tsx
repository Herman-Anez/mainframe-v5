import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Schema } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/SEO/Schema',
  component: Schema,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['website', 'article', 'blogPosting', 'techArticle', 'webPage', 'organization'],
      description: 'The schema.org type to generate structured data for.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a JSON-LD <script> tag with schema.org structured data for SEO. Invisible on the page — check "Show code" or view page source to see the generated JSON-LD.',
      },
    },
  },
  args: {
    as: 'article',
    title: 'Once UI Storybook reference',
    description: 'An interactive reference for the Once UI component library.',
    baseURL: 'https://example.com',
    path: '/blog/once-ui-storybook',
  },
} satisfies Meta<typeof Schema>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
