import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingNav, HeadingLink, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/HeadingNav',
  component: HeadingNav,
  tags: ['autodocs'],
  argTypes: {
    header: { control: 'boolean', description: 'Reserves space as if a page header is present.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Automatically scans HeadingLink elements on the page and renders a "table of contents" style side navigation that highlights the section currently in view.',
      },
    },
  },
} satisfies Meta<typeof HeadingNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Column gap="24" style={{ maxWidth: 480 }}>
      <HeadingLink id="intro" as="h2">Introduction</HeadingLink>
      <HeadingLink id="usage" as="h2">Usage</HeadingLink>
      <HeadingLink id="api" as="h2">API reference</HeadingLink>
      <HeadingNav />
    </Column>
  ),
};
