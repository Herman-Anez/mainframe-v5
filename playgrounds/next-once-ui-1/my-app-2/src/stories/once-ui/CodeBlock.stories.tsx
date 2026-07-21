import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeBlock } from '@once-ui-system/core';

const sample = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

const meta = {
  title: 'Once UI/Code/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays syntax-highlighted source code (via Prism) with an optional copy button and line numbers.',
      },
    },
  },
  args: {
    codes: [{ code: sample, language: 'typescript', label: 'TypeScript' }],
    copyButton: true,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
