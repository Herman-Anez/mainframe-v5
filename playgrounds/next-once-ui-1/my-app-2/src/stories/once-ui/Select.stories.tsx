import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Select } from '@once-ui-system/core';

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const meta = {
  title: 'Once UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    searchable: { control: 'boolean' },
    multiple: { control: 'boolean' },
    fillWidth: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
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
