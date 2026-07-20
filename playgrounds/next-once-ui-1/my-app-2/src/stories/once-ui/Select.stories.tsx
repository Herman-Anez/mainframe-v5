import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Select } from '@once-ui-system/core';

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const meta = {
  title: 'Once UI/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A dropdown field for choosing one or more options from a list, with optional search filtering.',
      },
    },
  },
  argTypes: {
    searchable: { control: 'boolean', description: 'Shows a search field to filter the options.' },
    multiple: { control: 'boolean', description: 'Allows selecting more than one option.' },
    fillWidth: { control: 'boolean', description: 'Makes the select expand to fill its container width.' },
    label: { control: 'text', description: 'Label text displayed above the select.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when no option is selected.' },
  },
  args: {
    id: 'select-default',
    label: 'Fruit',
    placeholder: 'Choose a fruit',
    options: fruitOptions,
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const SelectWithState = () => {
      const [value, setValue] = useState<string | string[] | undefined>(args.value);
      return <Select {...args} value={value} onSelect={setValue} />;
    };
    return <SelectWithState />;
  },
};

export const Searchable: Story = {
  args: { searchable: true },
  render: (args) => {
    const SelectWithState = () => {
      const [value, setValue] = useState<string | string[] | undefined>(args.value);
      return <Select {...args} value={value} onSelect={setValue} />;
    };
    return <SelectWithState />;
  },
};
