import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Accordion is a collapsible panel with a header that toggles the visibility of its content.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the accordion header and content padding.' },
    radius: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl', 'full'], description: 'Corner radius of the accordion container.' },
    open: { control: 'boolean', description: 'Whether the accordion content is expanded.' },
    title: { control: 'text', description: 'Header text shown for the accordion trigger.' },
  },
  args: {
    title: 'What is Once UI?',
    open: false,
    children: null,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Text onBackground="neutral-weak">A design system and component library for Next.js.</Text>
    </Accordion>
  ),
};

export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <Accordion {...args}>
      <Text onBackground="neutral-weak">A design system and component library for Next.js.</Text>
    </Accordion>
  ),
};
