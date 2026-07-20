import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toast, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A single notification message communicating the outcome of an action, typically shown via the Toaster.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['success', 'danger', 'warning', 'info'], description: 'Visual style indicating the message severity.' },
    icon: { control: 'boolean', description: 'Shows an icon matching the variant.' },
  },
  args: {
    variant: 'success',
    icon: true,
    children: 'Changes saved successfully.',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Column gap="12" maxWidth={24}>
      <Toast variant="success" icon>Changes saved successfully.</Toast>
      <Toast variant="info" icon>New version available.</Toast>
      <Toast variant="warning" icon>Session expires in 5 minutes.</Toast>
      <Toast variant="danger" icon>Failed to save changes.</Toast>
    </Column>
  ),
};
