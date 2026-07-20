import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { DateRangeInput, type DateRange } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Forms/DateRangeInput',
  component: DateRangeInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A pair of text inputs for entering a start and end date, opening a range picker on focus.',
      },
    },
  },
  argTypes: {
    startLabel: { control: 'text', description: 'Label for the start date field.' },
    endLabel: { control: 'text', description: 'Label for the end date field.' },
  },
  args: {
    id: 'date-range-input-default',
    startLabel: 'Check-in',
    endLabel: 'Check-out',
  },
} satisfies Meta<typeof DateRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const DateRangeInputWithState = () => {
      const [value, setValue] = useState<DateRange>({ startDate: undefined, endDate: undefined });
      return <DateRangeInput {...args} value={value} onChange={setValue} />;
    };
    return <DateRangeInputWithState />;
  },
};
