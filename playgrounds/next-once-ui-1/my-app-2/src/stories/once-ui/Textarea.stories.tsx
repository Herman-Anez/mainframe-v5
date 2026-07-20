import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea, Column } from '@once-ui-system/core';

const meta = {
  title: 'Once UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'ghost'] },
    height: { control: 'select', options: ['s', 'm', 'l'] },
    resize: { control: 'select', options: ['horizontal', 'vertical', 'both', 'none'] },
    lines: { control: 'number' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    characterCount: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    id: 'textarea-default',
    label: 'Message',
    placeholder: 'Write something...',
    lines: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <Column gap="16" maxWidth={24}>
      <Textarea id="textarea-default-state" label="Default" placeholder="Type here" lines={3} />
      <Textarea id="textarea-disabled-state" label="Disabled" placeholder="Type here" lines={3} disabled />
      <Textarea id="textarea-error-state" label="Error" placeholder="Type here" lines={3} error errorMessage="This field is required" />
    </Column>
  ),
};
