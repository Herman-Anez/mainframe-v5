import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DropdownWrapper, Button, Dropdown, Option } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Overlay/DropdownWrapper',
  component: DropdownWrapper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'DropdownWrapper positions a floating Dropdown panel relative to a trigger element and manages its open/close state.',
      },
    },
  },
  argTypes: {
    minWidth: { control: 'number', description: 'Minimum width of the dropdown panel.' },
    maxWidth: { control: 'number', description: 'Maximum width of the dropdown panel.' },
    closeAfterClick: { control: 'boolean', description: 'Whether the dropdown closes automatically after an option is clicked.' },
  },
  args: {
    trigger: null,
    dropdown: null,
  },
} satisfies Meta<typeof DropdownWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const DropdownWrapperWithState = () => {
      const [selected, setSelected] = useState<string | undefined>(undefined);
      return (
        <DropdownWrapper
          trigger={<Button label={selected ?? 'Choose a fruit'} variant="secondary" />}
          dropdown={
            <Dropdown>
              <Option label="Apple" value="apple" />
              <Option label="Banana" value="banana" />
              <Option label="Cherry" value="cherry" />
            </Dropdown>
          }
          selectedOption={selected}
          onSelect={setSelected}
          minWidth={12}
        />
      );
    };
    return <DropdownWrapperWithState />;
  },
};
