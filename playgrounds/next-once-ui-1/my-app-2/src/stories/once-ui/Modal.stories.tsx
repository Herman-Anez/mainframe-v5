import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Modal, Button, Text } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Modal is a dialog overlay that displays content above the page, with a title and a controlled open/close state.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Title displayed in the modal header.' },
  },
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Modal title',
    children: null,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const ModalWithState = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <>
          <Button label="Open modal" onClick={() => setIsOpen(true)} />
          <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Text onBackground="neutral-weak">Modal body content goes here.</Text>
          </Modal>
        </>
      );
    };
    return <ModalWithState />;
  },
};
