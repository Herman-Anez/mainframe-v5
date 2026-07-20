import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Toaster, Button, Column } from '@once-ui-system/core';

type ToastItem = { id: string; variant: 'success' | 'danger' | 'warning' | 'info'; message: string };

const meta = {
  title: 'Once UI/Feedback/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Toaster renders a stack of transient toast notifications and handles their positioning and removal.',
      },
    },
  },
  args: {
    toasts: [],
    removeToast: () => {},
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const ToasterDemo = () => {
      const [toasts, setToasts] = useState<ToastItem[]>([]);
      const addToast = () =>
        setToasts((prev) => [
          ...prev,
          { id: String(Date.now()), variant: 'success', message: 'Changes saved successfully.' },
        ]);
      const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
      return (
        <Column gap="16">
          <Button label="Show toast" onClick={addToast} />
          <Toaster toasts={toasts} removeToast={removeToast} />
        </Column>
      );
    };
    return <ToasterDemo />;
  },
};
