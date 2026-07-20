import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DatePicker } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A calendar component for selecting a single date, with optional time selection.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the date picker.' },
    timePicker: { control: 'boolean', description: 'Shows an additional time selection control.' },
    previousMonth: { control: 'boolean', description: 'Shows the previous month alongside the current one.' },
    nextMonth: { control: 'boolean', description: 'Shows the next month alongside the current one.' },
  },
  args: {
    size: 'm',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const DatePickerWithState = () => {
      const [value, setValue] = useState<Date | undefined>(new Date());
      return <DatePicker {...args} value={value} onChange={setValue} />;
    };
    return <DatePickerWithState />;
  },
};
