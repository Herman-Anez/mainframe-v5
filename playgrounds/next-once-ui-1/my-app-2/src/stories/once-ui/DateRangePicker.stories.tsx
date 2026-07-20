import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A calendar component for selecting a start and end date as a range.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'], description: 'Size of the date range picker.' },
    dual: { control: 'boolean', description: 'Shows two months side by side instead of one.' },
  },
  args: {
    size: 'm',
    dual: true,
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const DateRangePickerWithState = () => {
      const [value, setValue] = useState<DateRange>({ startDate: undefined, endDate: undefined });
      return <DateRangePicker {...args} value={value} onChange={setValue} />;
    };
    return <DateRangePickerWithState />;
  },
};
