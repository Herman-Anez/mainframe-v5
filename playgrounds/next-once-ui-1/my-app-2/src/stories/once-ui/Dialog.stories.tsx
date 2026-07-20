import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Dialog, Button, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A modal overlay used to display focused content or ask for confirmation before continuing.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Title displayed at the top of the dialog.' },
    description: { control: 'text', description: 'Supporting text displayed below the title.' },
    stack: { control: 'boolean', description: 'Allows the dialog to stack above other open dialogs.' },
    base: { control: 'boolean', description: 'Renders the dialog without its default padding and chrome.' },
    closeOnClickaway: { control: 'boolean', description: 'Closes the dialog when clicking outside of it.' },
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
