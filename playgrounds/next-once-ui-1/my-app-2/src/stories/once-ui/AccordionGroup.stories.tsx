import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AccordionGroup } from '@once-ui-system/core';

const items = [
  { title: 'What is Once UI?', content: 'A design system and component library for Next.js.' },
  { title: 'Is it free?', content: 'Yes, Once UI is open source under the MIT license.' },
  { title: 'Does it support dark mode?', content: 'Yes, theming is built in via ThemeProvider.' },
];

const meta = {
  title: 'Once UI/Navigation/AccordionGroup',
  component: AccordionGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a list of collapsible accordion items from a data array, e.g. for FAQ sections.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the accordion items.' },
    autoCollapse: { control: 'boolean', description: 'Collapses other items automatically when one is opened.' },
  },
  args: {
    items,
    autoCollapse: true,
  },
} satisfies Meta<typeof AccordionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
