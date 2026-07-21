import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeadingLink } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/HeadingLink',
  component: HeadingLink,
  tags: ['autodocs'],
  argTypes: {
    as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], description: 'HTML heading level to render.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a heading with an anchor link icon on hover, so readers can copy a direct link to that section — typically used in long-form docs content.',
      },
    },
  },
  args: {
    id: 'example-heading',
    as: 'h2',
    children: 'An example section heading',
  },
} satisfies Meta<typeof HeadingLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
