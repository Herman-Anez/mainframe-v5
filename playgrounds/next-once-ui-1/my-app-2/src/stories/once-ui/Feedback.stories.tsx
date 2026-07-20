import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Feedback, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/Feedback',
  component: Feedback,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An inline message box for communicating status, alerts, or contextual information to the user.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['info', 'danger', 'warning', 'success'], description: 'Severity/color scheme of the message.' },
    icon: { control: 'boolean', description: 'Shows an icon matching the variant.' },
    showCloseButton: { control: 'boolean', description: 'Shows a button to dismiss the message.' },
    title: { control: 'text', description: 'Title text of the message.' },
    description: { control: 'text', description: 'Body text of the message.' },
  },
  args: {
    variant: 'info',
    icon: true,
    title: 'Heads up',
    description: 'This is an informational message.',
  },
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Column gap="12" maxWidth={24}>
      <Feedback variant="info" icon title="Info" description="Something you should know." />
      <Feedback variant="success" icon title="Success" description="Your changes were saved." />
      <Feedback variant="warning" icon title="Warning" description="Double-check before continuing." />
      <Feedback variant="danger" icon title="Danger" description="Something went wrong." />
    </Column>
  ),
};
