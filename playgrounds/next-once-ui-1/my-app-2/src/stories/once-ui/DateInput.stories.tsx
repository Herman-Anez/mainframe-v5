import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DateInput } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'DateInput is a text field that opens a date picker for selecting a single date, optionally with a time picker.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Floating label text for the field.' },
    placeholder: { control: 'text', description: 'Placeholder text shown when empty.' },
    timePicker: { control: 'boolean', description: 'Whether to include a time picker alongside the date picker.' },
  },
  args: {
    id: 'date-input-default',
    label: 'Date of birth',
    placeholder: 'Select a date',
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const DateInputWithState = () => {
      const [value, setValue] = useState<Date | undefined>(undefined);
      return <DateInput {...args} value={value} onChange={setValue} />;
    };
    return <DateInputWithState />;
  },
};
