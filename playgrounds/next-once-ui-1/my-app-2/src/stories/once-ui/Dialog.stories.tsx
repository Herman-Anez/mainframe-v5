import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Dialog, Button, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    stack: { control: 'boolean' },
    base: { control: 'boolean' },
    closeOnClickaway: { control: 'boolean' },
  },
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Confirm action',
    description: 'This cannot be undone.',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const DialogWithState = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <>
          <Button label="Open dialog" onClick={() => setIsOpen(true)} />
          <Dialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Text onBackground="neutral-weak">Dialog body content goes here.</Text>
          </Dialog>
        </>
      );
    };
    return <DialogWithState />;
  },
};
